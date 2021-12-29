import React, { useState, useEffect } from "react";
import axios from "axios";
import { changeInputValue } from "../helperfunctions/helperfunctions";
import Redirect from "../components/redirect";
import Input from "../components/input";
import Button from "../components/button";

const Signup_page = () => {
  const [newUser, setNewUser] = useState("Nick");
  const [newPassword, setNewPassword] = useState("hello");
  const [confirmPassword, setConfirmedPassword] = useState("hello");
  const [signedUp, setSignedUp] = useState(false);

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
      <form>
        <Input
          type={"text"}
          value={newUser}
          on_change={(e) => {
            changeInputValue(e.target.value, setNewUser);
          }}
        />
        <Input
          type={"password"}
          value={newPassword}
          on_change={(e) => {
            changeInputValue(e.target.value, setNewPassword);
          }}
        />
        <Input
          type={"password"}
          value={confirmPassword}
          on_change={(e) => {
            changeInputValue(e.target.value, setConfirmedPassword);
          }}
        />
        <Button
          text={"Submit"}
          on_click={(e) => {
            e.preventDefault();
            signupTest();
          }}
        />
      </form>
    </div>
  );
};

export default Signup_page;
