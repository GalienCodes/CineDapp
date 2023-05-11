import React from "react";
import PropTypes from "prop-types";
import  Toaster  from "react-hot-toast";

const Notification = () => (
  <Toaster
    position="top-center"
  />
);

const NotificationSuccess = ({ text }) => (
  <div>
    <i className="bi bi-check-circle-fill text-success mx-2" />
    <span className="text-secondary mx-1">{text}</span>
  </div>
);

const NotificationError = ({ text }) => (
  <div>
    <i className="bi bi-x-circle-fill text-danger mx-2" />
    <span className="text-secondary mx-1">{text}</span>
  </div>
);

const Props = {
  text: PropTypes.string,
};

const DefaultProps = {
  text: "",
};

NotificationSuccess.propTypes = Props;
NotificationSuccess.defaultProps = DefaultProps;

NotificationError.propTypes = Props;
NotificationError.defaultProps = DefaultProps;

export { Notification, NotificationSuccess, NotificationError };