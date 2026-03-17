import type { ReactNode } from 'react';
import { Toaster, toast, type ExternalToast, type ToasterProps } from 'sonner';

type NotificationKind = 'success' | 'error' | 'info' | 'warning';

function withDefaults(options?: ExternalToast): ExternalToast {
  return {
    duration: 4000,
    ...options
  };
}

function notifyByKind(kind: NotificationKind, message: ReactNode, options?: ExternalToast) {
  if (kind === 'success') return toast.success(message, withDefaults(options));
  if (kind === 'error') return toast.error(message, withDefaults(options));
  if (kind === 'warning') return toast.warning(message, withDefaults(options));
  return toast.info(message, withDefaults(options));
}

export const notify = {
  success: (message: ReactNode, options?: ExternalToast) => notifyByKind('success', message, options),
  error: (message: ReactNode, options?: ExternalToast) => notifyByKind('error', message, options),
  warning: (message: ReactNode, options?: ExternalToast) => notifyByKind('warning', message, options),
  info: (message: ReactNode, options?: ExternalToast) => notifyByKind('info', message, options)
};

export function NotificationToaster(props: Omit<ToasterProps, 'richColors'> = {}) {
  return (
    <Toaster
      closeButton
      icons={{
        success: <span aria-hidden="true" className="material-symbols-outlined">check_circle</span>,
        error: <span aria-hidden="true" className="material-symbols-outlined">error</span>,
        warning: <span aria-hidden="true" className="material-symbols-outlined">warning</span>,
        info: <span aria-hidden="true" className="material-symbols-outlined">info</span>
      }}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'ui-notification',
          title: 'ui-notification-title',
          description: 'ui-notification-description',
          closeButton: 'ui-notification-close',
          success: 'ui-notification-success',
          error: 'ui-notification-error',
          warning: 'ui-notification-warning',
          info: 'ui-notification-info'
        }
      }}
      {...props}
    />
  );
}
