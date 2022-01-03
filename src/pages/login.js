import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";
import {
  changeInputValue,
  render_errors,
} from "../helperfunctions/helperfunctions";
import Button from "../components/button";
import Input from "../components/input";
import Redirect from "../components/redirect";
import Label from "../components/label";

const Login_page = () => {
  const [loginUser, setLoginUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState(null);
  const user_context = useContext(UserContext);

  const login = async () => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      data: {
        username: loginUser,
        password: password,
      },
    };
    console.log(user_context.webAddress);
    const response = await axios.post(
      `${user_context.webAddress}/auth/login`,
      options
    );

    if (response.data.errors) {
      setErrorResponse(response.data.errors);
      return;
    }

    // FIX LOGIN SO IT RENDERS ERRORS!
    setLoginUser("");
    setPassword("");
    setErrorResponse(null);
    user_context.setUser(response.data.user);
    user_context.setUserId(response.data.userId);
    user_context.setToken(response.data.token);
  };

  if (user_context.token) {
    return <Redirect route={"/blogs"} />;
  }

  return (
    <div className="login-page">
      <h1>User Blog Portal</h1>
      <h2>View and comment on various blogs</h2>
      <form>
        <Label label={"Username"}></Label>
        <Input
          type={"text"}
          on_change={(e) => {
            setLoginUser(e.target.value);
          }}
          value={loginUser}
        />
        <Label label={"Password"}></Label>
        <Input
          type={"password"}
          on_change={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <Button
          text={"Login"}
          on_click={(e) => {
            e.preventDefault();
            login();
          }}
        />
      </form>

      {errorResponse && render_errors(errorResponse)}
    </div>
  );
};

export default Login_page;
