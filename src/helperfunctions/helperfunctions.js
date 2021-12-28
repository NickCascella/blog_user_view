import { Navigate } from "react-router-dom";

const changeInputValue = (value, state_changing) => {
  state_changing(value);
};

const Redirect = ({ route }) => {
  return <Navigate to={route} />;
};

export { changeInputValue, Redirect };
