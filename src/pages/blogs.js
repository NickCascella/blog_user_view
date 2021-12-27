import React, { useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { Redirect } from "../helperfunctions/helperfunctions";

const Blogs = () => {
  const user_context = useContext(UserContext);

  useEffect(() => {
    get_blogs();
  }, []);

  const get_blogs = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_context.token}`,
      },
      mode: "cors",
    };
    const get_all_blogs = await axios.get(
      "http://localhost:4000/blogs",
      options
    );
    const response = get_all_blogs;
    console.log(response);
  };
  return (
    <div>
      {!user_context.token && <Redirect route={"/login"}></Redirect>}
      <div>Welcome to blogs</div>
    </div>
  );
};

export default Blogs;
