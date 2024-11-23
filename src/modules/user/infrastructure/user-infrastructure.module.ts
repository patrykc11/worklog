import { Module } from '@nestjs/common';
import { UserDrizzleModule } from './drizzle/user-drizzle.module';

@Module({
  imports: [UserDrizzleModule],
  exports: [UserDrizzleModule],
})
export class UserInfrastructureModule {}
