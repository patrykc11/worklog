import { validate as validateUUID } from 'uuid';

export function isUUID(id: string): boolean {
  return validateUUID(id);
}
