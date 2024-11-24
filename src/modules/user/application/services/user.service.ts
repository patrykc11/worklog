import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import {
  ChangeRolesResource,
  ConfirmEmailResource,
  UserLoginResource,
  UserRegisterResource,
} from '../../domain/resources/user-resource';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserRole } from '@worklog/shared/definitions';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async registerNewUser({
    email,
    password,
  }: UserRegisterResource): Promise<User> {
    const user = await this.userRepository.findOne({
      type: 'email',
      value: email,
    });

    if (user) {
      throw new ConflictException({
        message: 'User already exists',
      });
    }

    const newUser = await User.register({
      email,
      password,
    });

    await this.userRepository.create(newUser);

    return newUser;
  }

  public async loginUser({
    email,
    password,
  }: UserLoginResource): Promise<User> {
    const user = await this.userRepository.findOne({
      type: 'email',
      value: email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid login data');
    }

    if (!user.isEmailConfirmed) {
      throw new BadRequestException('User is not verified');
    }

    const isCorrectPassword = await user.password.compare(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid login data');
    }

    return user;
  }

  public async confirmEmail({
    id,
    email,
  }: ConfirmEmailResource): Promise<void> {
    const user = await this.userRepository.findOne({
      type: 'id',
      value: id,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User does not exist',
      });
    }

    if (user.email.value !== email) {
      throw new BadRequestException({
        message: 'Incorrect email',
      });
    }

    user.update({
      isEmailConfirmed: true,
      roles: [UserRole.USER],
    });

    await this.userRepository.update(user);
  }

  public async changeRole(options: ChangeRolesResource): Promise<void> {
    const user = await this.userRepository.findOne({
      type: 'id',
      value: options.id,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User does not exist',
      });
    }

    user.update({
      roles: options.roles,
    });

    await this.userRepository.update(user);
  }

  public async assignRefreshToken(
    user: User,
    refreshToken: string,
  ): Promise<void> {
    user.update({
      refreshToken: refreshToken,
    });

    await this.userRepository.update(user);
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      type: 'id',
      value: id,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User does not exist',
      });
    }

    return user;
  }
}
