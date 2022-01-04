import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  changeInputValue,
  render_errors,
} from "../helperfunctions/helperfunctions";
import Redirect from "../components/redirect";
import Input from "../components/input";
import Button from "../components/button";
import Label from "../components/label";
import { UserContext } from "../App";

const Signup_page = () => {
  const [newUser, setNewUser] = useState("Nick");
  const [newPassword, setNewPassword] = useState("hello");
  const [confirmPassword, setConfirmedPassword] = useState("hello");
  const [errorResponse, setErrorResponse] = useState(null);
  const [signedUp, setSignedUp] = useState(false);
  const user_context = useContext(UserContext);

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
      `${user_context.webAddress}/auth/signup`,
      options
    );
    const response = signup_request;

    if (response.data.errors) {
      setErrorResponse(response.data.errors);
      return;
    }

    setSignedUp(true);
  };

  return (
    <div className="login-page">
      {signedUp && <Redirect route={"/login"}></Redirect>}
      <h1>Signup today!</h1>
      <h2>Begin browsing blogs instantly!</h2>
      <form>
        <Label label={"Username"} />
        <Input
          type={"text"}
          value={newUser}
          on_change={(e) => {
            changeInputValue(e.target.value, setNewUser);
          }}
        />
        <Label label={"Password"} />
        <Input
          type={"password"}
          value={newPassword}
          on_change={(e) => {
            changeInputValue(e.target.value, setNewPassword);
          }}
        />
        <Label label={"Confirm password"} />
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

      {errorResponse && render_errors(errorResponse)}
    </div>
  );
};

export default Signup_page;
