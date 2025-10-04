import { STATUS_ENUM } from '@/types/enums/order-status.enum';

export function statusToNumber(status: string): number {
  const statusKey = status as keyof typeof STATUS_ENUM;

  if (STATUS_ENUM[statusKey] !== undefined) {
    return STATUS_ENUM[statusKey];
  }

  return STATUS_ENUM.pending;
}
