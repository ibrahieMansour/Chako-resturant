import React from "react";
import { Alert } from "react-bootstrap";

const StatusAlert = ({ status, text }) => {
  return (
    <Alert variant={`${status === "valid" ? "success" : "danger"} m-0`}>
      <Alert.Heading>{text}</Alert.Heading>
    </Alert>
  );
};

export default StatusAlert;
