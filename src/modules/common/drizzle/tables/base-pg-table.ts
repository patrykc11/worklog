/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DateUtil, generateUUID } from '@worklog/shared/utils';
import { type BuildExtraConfigColumns } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uuid,
  type PgColumnBuilderBase,
  type PgTableExtraConfig,
} from 'drizzle-orm/pg-core';

type GetDefaultColumnsOptions = {
  readonly idType: 'uuid';
};

function getDefaultColumns({ idType }: GetDefaultColumnsOptions) {
  const generateId = (): string => generateUUID();

  return {
    id: (idType === 'uuid' ? uuid('id') : text('id'))
      .primaryKey()
      .$defaultFn(() => generateId()),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .$default(() => DateUtil.now),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .$onUpdate(() => DateUtil.now),
  };
}

type BasePgTableOptions<
  TTableName extends string,
  TColumnsMap extends Record<string, PgColumnBuilderBase>,
> = Partial<GetDefaultColumnsOptions> & {
  extraConfig?: (
    self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'pg'>,
  ) => PgTableExtraConfig;
};

export function basePgTable<
  TTableName extends string,
  TColumnsMap extends Record<string, PgColumnBuilderBase>,
>(
  tableName: TTableName,
  columns: TColumnsMap,
  {
    idType = 'uuid',
    extraConfig,
  }: BasePgTableOptions<TTableName, TColumnsMap> = {},
) {
  return pgTable(
    tableName,
    {
      ...getDefaultColumns({ idType }),
      ...columns,
    },
    extraConfig ? (table) => extraConfig(table) : undefined,
  );
}
