import React, { useState, useEffect } from "react";
import axios from "axios";
import { changeInputValue, Redirect } from "../helperfunctions/helperfunctions";

const Signup_page = () => {
  const [newUser, setNewUser] = useState("Nick");
  const [newPassword, setNewPassword] = useState("hello");
  const [confirmPassword, setConfirmedPassword] = useState("hello");
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {}, []);

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
    const signup_request = await axios.post(
      "http://localhost:4000/auth/signup",
      options
    );
    const response = signup_request;
    console.log(response);
    response.data.errors
      ? console.log(response.data.errors.msg)
      : setSignedUp(true);
  };

  return (
    <div>
      {signedUp && <Redirect route={"/login"}></Redirect>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signupTest();
        }}
      >
        <input
          type={"text"}
          name="newUser"
          value={newUser}
          onChange={(e) => {
            changeInputValue(e.target.value, setNewUser);
          }}
        ></input>
        <input
          type={"password"}
          name="newPassword"
          value={newPassword}
          onChange={(e) => {
            changeInputValue(e.target.value, setNewPassword);
          }}
        ></input>
        <input
          type={"password"}
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            changeInputValue(e.target.value, setConfirmedPassword);
          }}
        ></input>
        <button type="submit">Signup Test</button>
      </form>
    </div>
  );
};

export default Signup_page;
