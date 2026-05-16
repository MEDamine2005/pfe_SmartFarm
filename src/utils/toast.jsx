import React from "react";
import { toast } from "react-toastify";

const BASE_OPTIONS = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export const areNotificationsEnabled = () =>
  window.localStorage.getItem("smartFarmNotifications") !== "false";

export const setNotificationsEnabled = (enabled) => {
  window.localStorage.setItem("smartFarmNotifications", enabled ? "true" : "false");
};

export const notify = {
  success: (message, options = {}) => toast.success(message, { ...BASE_OPTIONS, ...options }),
  error: (message, options = {}) => toast.error(message, { ...BASE_OPTIONS, ...options }),
  info: (message, options = {}) => toast.info(message, { ...BASE_OPTIONS, ...options }),
  warning: (message, options = {}) => toast.warn(message, { ...BASE_OPTIONS, ...options }),
  dismiss: (id) => toast.dismiss(id),
};

const toastFnForAlert = (type) => {
  if (type === "critical" || type === "danger") return toast.error;
  if (type === "warning") return toast.warn;
  return toast.info;
};

export const showAlertToast = (alert, { onMarkRead, onDismiss } = {}) => {
  if (!areNotificationsEnabled()) return;

  const toastFn = toastFnForAlert(alert.type);
  const time = new Date(alert.timestamp).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  toastFn(
    ({ closeToast }) => (
      <div className="sf-alert-toast">
        <div className="sf-alert-toast__header">
          <span className="sf-alert-toast__title">{alert.title}</span>
          <span className="sf-alert-toast__time">{time}</span>
        </div>
        <p className="sf-alert-toast__message">{alert.message}</p>
        <div className="sf-alert-toast__actions">
          {!alert.read && onMarkRead && (
            <button
              type="button"
              className="sf-alert-toast__btn sf-alert-toast__btn--primary"
              onClick={() => {
                onMarkRead(alert.id);
                closeToast();
              }}
            >
              Marquer lu
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              className="sf-alert-toast__btn"
              onClick={() => {
                onDismiss(alert.id);
                closeToast();
              }}
            >
              Ignorer
            </button>
          )}
        </div>
      </div>
    ),
    {
      ...BASE_OPTIONS,
      toastId: `alert-${alert.id}`,
      className: `sf-toast sf-toast--${alert.type}`,
      autoClose: alert.type === "critical" || alert.type === "danger" ? 10000 : 7000,
    },
  );
};
