import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import { DescribeApi } from '@worklog/shared/utils';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserRole } from '@worklog/shared/definitions';

@ApiTags('Users')
@Controller({
  path: '/users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/:id/role')
  @DescribeApi({
    operationOptions: {
      summary: 'Add user role',
    },
    params: [
      {
        name: 'id',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    response: {
      status: HttpStatus.OK,
    },
  })
  public changeUserRole(
    // @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeRoleDto,
  ): any {
    console.log(id);
    return this.userService.changeRole({
      id: id,
      roles: dto.roles,
    });
  }
}
