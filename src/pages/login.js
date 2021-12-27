import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { changeInputValue } from "../helperfunctions/helperfunctions";

const Login_page = () => {
  const [user, setUser] = useState("Nick");
  const [password, setPassword] = useState("hello");
  const user_context = useContext(UserContext);

  useEffect(() => {
    console.log(user_context);
  }, [user_context.token]);

  const login = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      data: {
        username: user,
        password: password,
      },
    };
    const get_token = await axios.post(
      "http://localhost:4000/auth/login",
      options
    );
    user_context.setToken(get_token.data.token);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login();
      }}
    >
      <input
        type={"text"}
        name="newUser"
        value={user}
        onChange={(e) => {
          changeInputValue(e.target.value, setUser);
        }}
      ></input>
      <input
        type={"password"}
        name="newPassword"
        value={password}
        onChange={(e) => {
          changeInputValue(e.target.value, setPassword);
        }}
      ></input>
      <button type="submit">login Test</button>
    </form>
  );
};

export default Login_page;
