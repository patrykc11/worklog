import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import { DescribeApi } from '@worklog/shared/utils';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserRole } from '@worklog/shared/definitions';
import { Roles } from '@worklog/modules/auth/utils/decorators/roles.decorator';
import { AuthenticationGuard } from '@worklog/modules/auth/utils/guards/authentication.guard';
import { RolesGuard } from '@worklog/modules/auth/utils/guards/roles.guard';

@ApiTags('Users')
@Controller({
  path: '/users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/:id/role')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
