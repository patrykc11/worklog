import { type RoleMatchingMode } from '../enums/auth.enums';

export interface RolesMetadata {
  readonly roles: string[];
  readonly mode: RoleMatchingMode;
}
