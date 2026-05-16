import React from "react";
import { ToastContainer } from "react-toastify";

const AppToastContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    limit={4}
    className="sf-toast-container"
    toastClassName="sf-toast"
    progressClassName="sf-toast-progress"
  />
);

export default AppToastContainer;
