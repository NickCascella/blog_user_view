import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { Redirect } from "../helperfunctions/helperfunctions";
import Loading_page from "../components/loading";
import { Link } from "react-router-dom";

const Blogs = () => {
  const user_context = useContext(UserContext);
  const token = user_context.token;
  const blogs = user_context.blogs;
  const setBlogs = user_context.setBlogs;

  useEffect(() => {
    get_blogs();
  }, []);

  const get_blogs = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    };
    const get_all_blogs = await axios.get(
      "http://localhost:4000/blogs",
      options
    );
    const response = get_all_blogs;
    setBlogs(response.data);
  };

  const render_blogs = () => {
    return blogs.map((blog) => {
      return (
        <div key={blog._id}>
          <Link to={`/blogs/${blog._id}`}>
            <h1>{blog.title}</h1>
          </Link>
        </div>
      );
    });
  };

  if (!token) {
    return <Redirect route={"/login"} />;
  } else if (!blogs) {
    return <Loading_page message="No blogs yet :/" />;
  }

  return (
    <div>
      <div>Welcome to blogs</div>
      {render_blogs()}
    </div>
  );
};

export default Blogs;
