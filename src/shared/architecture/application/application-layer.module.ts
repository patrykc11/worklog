import {
  ForwardReference,
  Module,
  Type,
  type DynamicModule,
} from '@nestjs/common';

type ModuleImport =
  | Type
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference;

@Module({})
export class ApplicationLayerModule {
  public static withInfrastructure(
    ...infrastructure: ModuleImport[]
  ): DynamicModule {
    return {
      module: this,
      imports: infrastructure,
      exports: [...(infrastructure || [])],
    };
  }
}
