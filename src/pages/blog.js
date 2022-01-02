import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import Loading_page from "../components/loading";
import Button from "../components/button";
import Input from "../components/input";
import Redirect from "../components/redirect";
import {
  changeInputValue,
  leave_comment,
  delete_comment,
  edit_comment,
  check_same_comment,
} from "../helperfunctions/helperfunctions";

const Blog_page = (props) => {
  const { id } = useParams();
  const user_context = useContext(UserContext);
  const token = user_context.token;
  const [blog, setBlog] = useState("");
  const [comment, setComment] = useState("");
  const [blogComments, setBlogComments] = useState([]);
  const [editedComment, setEditiedComment] = useState("");
  const [errorResponse, setErrorResponse] = useState(null);

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
    setBlogComments(response.data);
  };

  const render_blog_comments = () => {
    if (blogComments.length === 0 || !blogComments) {
      return <div>No comments yet</div>;
    }
    return (
      <div>
        {blogComments.map((blog_comment) => {
          return (
            <div key={blog_comment._id}>
              {!check_same_comment(editedComment._id, blog_comment._id) && (
                <div>
                  <div>{blog_comment.body}</div>
                  <div>{blog_comment.author.username}</div>
                  {blog_comment.author.username === user_context.user && (
                    <Button
                      text="Delete"
                      on_click={async () => {
                        await delete_comment(token, id, blog_comment._id);
                        get_blog_comments();
                      }}
                    />
                  )}
                </div>
              )}
              {check_same_comment(editedComment._id, blog_comment._id) && (
                <div>
                  <Input
                    type="text"
                    placeholder="Your edited comment"
                    on_change={(e) => {
                      let editedCommentCopy = { ...editedComment };
                      editedCommentCopy.body = e.target.value;
                      changeInputValue(editedCommentCopy, setEditiedComment);
                    }}
                    value={editedComment.body}
                  />
                  <Button
                    text="Submit Edits"
                    on_click={async (e) => {
                      e.preventDefault();
                      setErrorResponse(null);
                      let error_response = await edit_comment(
                        token,
                        id,
                        blog_comment._id,
                        editedComment,
                        setEditiedComment
                      );
                      error_response
                        ? setErrorResponse(error_response)
                        : setErrorResponse(null);
                      get_blog_comments();
                    }}
                  />
                </div>
              )}
              {blog_comment.author.username === user_context.user && (
                <Button
                  text={
                    <div>
                      {" "}
                      {!check_same_comment(
                        editedComment._id,
                        blog_comment._id
                      ) && <div>Edit</div>}
                      {check_same_comment(
                        editedComment._id,
                        blog_comment._id
                      ) && <div>Cancel</div>}
                    </div>
                  }
                  on_click={() => {
                    editedComment
                      ? setEditiedComment(false)
                      : setEditiedComment(blog_comment);
                  }}
                />
              )}
              <div>{blog_comment.date}</div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!token) {
    return <Redirect route={"/login"} />;
  } else if (!blog) {
    return <Loading_page message={"Loading :("} />;
  }

  return (
    <div className="blog-page">
      <div className="blog-page-inner">
        <div className="blog">
          <h1 className="blog-title">{blog.title}</h1>
          {/* <div className="blog-description">{blog.created_date}</div> */}
          <p className="blog-body">{blog.body}</p>

          <div className="blog-edited-date">
            {blog.edited_date && blog.edited_date}{" "}
          </div>
        </div>
        <form>
          <Input
            type="text"
            placeholder="Comment here.."
            on_change={(e) => {
              changeInputValue(e.target.value, setComment);
            }}
            value={comment}
          />
          <Button
            text={"Send"}
            on_click={async (e) => {
              e.preventDefault();
              setErrorResponse(null);
              let error_response = await leave_comment(token, id, comment);

              error_response
                ? setErrorResponse(error_response)
                : setErrorResponse(null);
              get_blog_comments();
              setComment("");
            }}
          />
        </form>
        <div>
          {errorResponse &&
            errorResponse.map((error) => {
              return <div key={error.msg}>{error.msg}</div>;
            })}
        </div>
        <div>{render_blog_comments()}</div>
      </div>
    </div>
  );
};

export default Blog_page;
