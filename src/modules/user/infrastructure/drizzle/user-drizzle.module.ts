import { Module } from '@nestjs/common';
import { UserRepository } from '../../application/ports/user.repository';
import { UserMapper } from './mappers/user.mapper';
import { UserDrizzleRepository } from './adapters/user-repository.adapter';

@Module({
  providers: [
    UserMapper,
    {
      provide: UserRepository,
      useClass: UserDrizzleRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserDrizzleModule {}
