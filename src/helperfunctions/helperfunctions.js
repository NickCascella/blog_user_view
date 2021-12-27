import { Navigate } from "react-router-dom";

const changeInputValue = (value, state_changing) => {
  state_changing(value);
};

const Redirect = (props) => {
  return <Navigate to={props.route} />;
};

export { changeInputValue, Redirect };
