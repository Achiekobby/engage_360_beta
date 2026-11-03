import { notify, STATUSES } from 'reapop';

export function notifyError(message, options = {}) {
  return notify(message, STATUSES.error, {
    title: options.title || 'Error',
    dismissible: true,
    dismissAfter: options.dismissAfter ?? 5000,
    ...options,
  });
}

export function notifySuccess(message, options = {}) {
  return notify(message, STATUSES.success, {
    title: options.title || 'Success',
    dismissible: true,
    dismissAfter: options.dismissAfter ?? 4000,
    ...options,
  });
}

export function notifyInfo(message, options = {}) {
  return notify(message, STATUSES.info, {
    dismissible: true,
    dismissAfter: options.dismissAfter ?? 4000,
    ...options,
  });
}
