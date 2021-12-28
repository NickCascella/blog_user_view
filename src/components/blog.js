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
  const [blogComments, setBlogComments] = useState([]);

  useEffect(async () => {
    await get_blog();
    get_blog_comments();
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

  const get_blog_comments = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    };
    const get_blog_comments = await axios.get(
      `http://localhost:4000/blogs/${id}/comments`,
      options
    );
    const response = get_blog_comments;
    console.log(response);
    setBlogComments(response.data);
  };

  const leave_comment = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const options = {
      method: "POST",
      mode: "cors",
      data: {
        blog_id: id,
        comment: comment,
      },
    };

    const create_comment = await axios.post(
      `http://localhost:4000/blogs/${id}/comments`,
      options,
      { headers }
    );
    const response = create_comment;
  };

  const render_blog_comments = () => {
    if (blogComments.length === 0 || !blogComments) {
      return <div>No comments yet</div>;
    }
    return (
      <div>
        {blogComments.map((comment) => {
          return (
            <div>
              <div>{comment.body}</div>
              <div>{comment.author}</div>
            </div>
          );
        })}
      </div>
    );
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
      <div>{render_blog_comments()}</div>
    </div>
  );
};

export default Blog_page;
