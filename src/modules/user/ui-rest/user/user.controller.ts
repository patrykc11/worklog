import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';

@ApiTags('Users')
@Controller({
  path: '/users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}
}
