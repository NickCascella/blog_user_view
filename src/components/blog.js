import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import Loading_page from "./loading";
import { Redirect, changeInputValue } from "../helperfunctions/helperfunctions";

const Blog_page = (props) => {
  const { id } = useParams();
  const user_context = useContext(UserContext);
  const token = user_context.token;
  const [blog, setBlog] = useState();
  const [comment, setComment] = useState();

  useEffect(() => {
    get_blog();
  }, []);

  const get_blog = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    };
    const get_blog = await axios.get(
      `http://localhost:4000/blogs/${id}`,
      options
    );
    const response = get_blog;
    setBlog(response.data);
  };

  const leave_comment = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
      data: {
        blog_id: id,
        comment: comment,
      },
    };
    const create_comment = await axios.post(
      `http://localhost:4000/blogs/${id}/comments`,
      options
    );
    const response = create_comment;
    console.log(response);
  };

  if (!token) {
    return <Redirect route={"/login"} />;
  } else if (!blog) {
    return <Loading_page message={"Cant find blog :("} />;
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <div>{blog.body}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          leave_comment();
        }}
      >
        <input
          type={"text"}
          placeholder="Comment here.."
          onChange={(e) => {
            changeInputValue(e.target.value, setComment);
          }}
        ></input>
        <button type="submit" value={comment}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Blog_page;
