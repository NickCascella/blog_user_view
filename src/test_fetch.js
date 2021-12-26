import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Debug = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    console.log(token);
  }, [token]);

  const [newUser, setNewUser] = useState("Nick");
  const [newPassword, setNewPassword] = useState("hello");
  const [confirmPassword, setConfirmedPassword] = useState("hello");

  const login = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      data: {
        username: newUser,
        password: newPassword,
      },
    };
    axios.post("http://localhost:4000/auth/login", options).then((response) => {
      console.log(response);
      setToken(response.data.token);
    });
  };

  const getDataTwo = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    };
    axios.get("http://localhost:4000/user", options).then((response) => {
      console.log(response);
    });
    // const response = await fetch("http://localhost:4000/login", options);
    // console.log(response, "test");
  };

  const signupTest = async () => {
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: newUser,
        password: newPassword,
        password_confirmation: confirmPassword,
      },
    };
    axios
      .post("http://localhost:4000/auth/signup", options)
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signupTest();
        }}
      >
        <button type="submit">Signup Test</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <button type="submit">Login</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getDataTwo();
        }}
      >
        <button type="submit">Test</button>
      </form>
    </div>
  );
};

export default Debug;
