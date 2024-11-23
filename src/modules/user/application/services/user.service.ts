import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import {
  ChangeRolesResource,
  ConfirmEmailResource,
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
  }: UserRegisterResource): Promise<string> {
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

    return newUser.id.value;
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

  public async changeRole({ id, roles }: ChangeRolesResource): Promise<void> {
    const user = await this.userRepository.findOne({
      type: 'id',
      value: id,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User does not exist',
      });
    }

    user.update({
      roles,
    });

    await this.userRepository.update(user);
  }
}
