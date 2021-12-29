import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { changeInputValue } from "../helperfunctions/helperfunctions";
import Button from "../components/button";
import Input from "../components/input";
import Redirect from "../components/redirect";

const Login_page = () => {
  const [loginUser, setLoginUser] = useState("Nick");
  const [password, setPassword] = useState("hello");
  const user_context = useContext(UserContext);

  const login = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      data: {
        username: loginUser,
        password: password,
      },
    };

    const get_token = await axios.post(
      "http://localhost:4000/auth/login",
      options
    );
    user_context.setToken(get_token.data.token);
    user_context.setUser(get_token.data.user);
    user_context.setUserId(get_token.data.userId);
  };

  if (user_context.token) {
    return <Redirect route={"/blogs"} />;
  }

  return (
    <form>
      <Input
        type="text"
        value={loginUser}
        on_change={(e) => {
          changeInputValue(e.target.value, setLoginUser);
        }}
      />
      <Input
        type="password"
        value={password}
        on_change={(e) => {
          changeInputValue(e.target.value, setPassword);
        }}
      />
      <Button
        text={"Login"}
        on_click={(e) => {
          e.preventDefault();
          login();
        }}
      />
    </form>
  );
};

export default Login_page;
