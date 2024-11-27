import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorklogService } from '../../application/services/worklog.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@worklog/modules/auth/utils/decorators/roles.decorator';
import { AuthenticationGuard } from '@worklog/modules/auth/utils/guards/authentication.guard';
import { RolesGuard } from '@worklog/modules/auth/utils/guards/roles.guard';
import { UserRole } from '@worklog/shared/definitions';
import { DescribeApi } from '@worklog/shared/utils';
import { OffsetPageOptionsDto } from '@worklog/shared/dtos/offset-page-options.dto';
import { GetQuestsResponseDto, CreateNewProjectDto } from './dtos/project.dto';

@ApiTags('Projects')
@Controller({
  path: '/projects',
})
export class ProjectController {
  constructor(private readonly worklogService: WorklogService) {}

  @Post('/add')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @DescribeApi({
    operationOptions: {
      summary: 'Add new project',
    },
    response: {
      status: HttpStatus.CREATED,
    },
  })
  public async addNewProject(@Body() dto: CreateNewProjectDto) {
    return {
      id: await this.worklogService.addProject(dto),
    };
  }

  @Get('/')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.USER)
  @DescribeApi({
    operationOptions: {
      summary: 'Get all projects',
    },
    response: {
      status: HttpStatus.OK,
      schema: GetQuestsResponseDto,
    },
    query: [
      {
        spreadSchema: true,
        schema: OffsetPageOptionsDto,
      },
    ],
  })
  public async getProjects(@Query() pageOptions: OffsetPageOptionsDto) {
    return this.worklogService.getAllProjects(pageOptions);
  }
}
