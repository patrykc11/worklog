import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@worklog/modules/auth/utils/decorators/roles.decorator';
import { AuthenticationGuard } from '@worklog/modules/auth/utils/guards/authentication.guard';
import { RolesGuard } from '@worklog/modules/auth/utils/guards/roles.guard';
import { WorklogService } from '@worklog/modules/worklog/application/services/worklog.service';
import { UserRole } from '@worklog/shared/definitions';
import { DescribeApi } from '@worklog/shared/utils';
import { StartWorkDto } from './dtos/worklog.dto';
import { CurrentUser } from '@worklog/modules/auth/utils/decorators/current-user.decorator';
import { AuthenticatedUser } from '@worklog/modules/auth/models/authenticated-user';

@ApiTags('Worklogs')
@Controller({
  path: '/worklogs',
})
export class WorklogController {
  constructor(private readonly worklogService: WorklogService) {}

  @Post('/start')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.USER)
  @DescribeApi({
    operationOptions: {
      summary: 'Start working in the project',
    },
    response: {
      status: HttpStatus.CREATED,
    },
  })
  public async startWork(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartWorkDto,
  ) {
    return {
      id: await this.worklogService.startWork({
        ...dto,
        userId: user.id,
      }),
    };
  }

  @Patch('/:id/finish')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.USER)
  @DescribeApi({
    operationOptions: {
      summary: 'Finish working in the project',
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
  public async finishWork(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.worklogService.finishWork({
      id,
      userId: user.id,
    });
  }

  @Get('/working-time/all')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @DescribeApi({
    operationOptions: {
      summary: 'Get working time from all users',
    },
    query: [
      {
        name: 'sinceDate',
        type: 'date',
        required: false,
      },
      {
        name: 'toDate',
        type: 'date',
        required: false,
      },
      {
        name: 'usersIds',
        type: 'array',
        required: false,
        items: {
          type: 'string',
          format: 'ulid',
        },
      },
    ],
    response: {
      status: HttpStatus.OK,
    },
  })
  public async getAllUsersWorkingTime(
    @Query('usersIds') usersIds?: string[],
    @Query('sinceDate') sinceDate?: Date,
    @Query('toDate') toDate?: Date,
  ) {
    return this.worklogService.getTotalWorklogForAllUsers(
      usersIds,
      sinceDate,
      toDate,
    );
  }

  @Get('/working-time/me')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.USER)
  @DescribeApi({
    operationOptions: {
      summary: 'Get my working time',
    },
    query: [
      {
        name: 'sinceDate',
        type: 'date',
        required: false,
      },
      {
        name: 'toDate',
        type: 'date',
        required: false,
      },
    ],
    response: {
      status: HttpStatus.OK,
    },
  })
  public async getWorkingTIme(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sinceDate') sinceDate?: Date,
    @Query('toDate') toDate?: Date,
  ) {
    return this.worklogService.getTotalWorklogForAllUsers(
      [user.id],
      sinceDate,
      toDate,
    );
  }
}
