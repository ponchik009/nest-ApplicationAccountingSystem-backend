import { SetMetadata } from '@nestjs/common';

export const WORKGROUPS_KEY = 'workgroups';

export const Workgroups = (...workgroups: string[]) =>
  SetMetadata(WORKGROUPS_KEY, workgroups);
