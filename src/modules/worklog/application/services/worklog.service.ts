import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorklogRepository } from '../ports/worklog.repository';
import {
  FindProjectsResult,
  ProjectRepository,
} from '../ports/project.repository';
import { CreateProjectResource } from '../../domain/resources/project-resource';
import { Project } from '../../domain/aggregates/project.aggregate';
import { OffsetPageOptionsDto } from '@worklog/shared/dtos/offset-page-options.dto';
import {
  FinishJobResource,
  StartJobResource,
} from '../../domain/resources/worklog-resource';
import { Worklog } from '../../domain/aggregates/worklog.aggregate';
import { UserService } from '@worklog/modules/user/application/services/user.service';
import { DateUtil } from '@worklog/shared/utils';
import { TimeUnit } from '@worklog/shared/definitions';

@Injectable()
export class WorklogService {
  constructor(
    private readonly worklogRepository: WorklogRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userService: UserService,
  ) {}

  public async addProject({ name }: CreateProjectResource): Promise<string> {
    const project = await this.projectRepository.findOne({
      type: 'name',
      value: name,
    });

    if (project) {
      throw new ConflictException({
        message: 'Project with that name already exists',
      });
    }

    const newProject = await Project.createProject(name);

    await this.projectRepository.create(newProject);

    return newProject.id.value;
  }

  public async getAllProjects(
    pageOptions: OffsetPageOptionsDto,
  ): Promise<FindProjectsResult> {
    return this.projectRepository.findMany({ pageOptions });
  }

  public async startWork(data: StartJobResource): Promise<string> {
    const user = await this.userService.getUserById(data.userId);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const project = await this.projectRepository.findOne({
      type: 'id',
      value: data.projectId,
    });

    if (!project) {
      throw new NotFoundException({
        message: 'Project not found',
      });
    }

    await this.finishNotFinishedWorks(data.userId);

    const worklog = await Worklog.startWork({
      projectId: data.projectId,
      description: data.description ?? 'New worklog',
      userId: data.userId,
    });

    await this.worklogRepository.create(worklog);

    return worklog.id.value;
  }

  public async finishWork(data: FinishJobResource): Promise<void> {
    const user = await this.userService.getUserById(data.userId);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }
    const worklog = await this.worklogRepository.findOne({
      type: 'id',
      value: data.id,
    });

    if (!worklog || worklog.userId.value !== data.userId) {
      throw new NotFoundException({
        message: 'Worklog not found',
      });
    }

    await worklog.finishWork();
    await this.worklogRepository.update(worklog);
  }

  public async getTotalWorklogForAllUsers(
    usersIds?: string[] | null,
    sinceDate?: Date | null,
    toDate?: Date | null,
  ): Promise<object> {
    const responseMap = new Map<string, number>();

    const allWorklogs = await this.worklogRepository.findMany({
      usersIds,
      sinceDate,
      toDate,
    });

    allWorklogs.worklogs.forEach((worklog) => {
      const finishDate = worklog.finishDate;
      const startDate = worklog.startDate;

      if (finishDate && startDate) {
        const duration = DateUtil.diff(startDate, finishDate, TimeUnit.Hour);
        const dateKey = finishDate.toISOString().split('T')[0];

        const totalHours = responseMap.get(dateKey) ?? 0;

        responseMap.set(dateKey, totalHours + duration);
      }
    });

    return Object.fromEntries(responseMap);
  }

  private async finishNotFinishedWorks(userId: string): Promise<void> {
    const worklogs = await this.worklogRepository.findNotFinished({
      userId,
    });

    for (const worklog of worklogs) {
      await worklog.finishWork();
      await this.worklogRepository.update(worklog);
    }
  }
}
