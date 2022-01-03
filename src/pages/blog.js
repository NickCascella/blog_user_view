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
  render_errors,
} from "../helperfunctions/helperfunctions";
import Textarea from "../components/textarea";

const Blog_page = (props) => {
  const { id } = useParams();
  const user_context = useContext(UserContext);
  const token = user_context.token;
  const [blog, setBlog] = useState("");
  const [comment, setComment] = useState("");
  const [blogComments, setBlogComments] = useState([]);
  const [editedComment, setEditedComment] = useState("");
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
                <div className="blog_comment">
                  <div className="blog-comment-body">{blog_comment.body}</div>
                  <div className="blog_comment_username">
                    {blog_comment.author.username}
                  </div>
                  <div className="button_container">
                    {blog_comment.author.username === user_context.user && (
                      <Button
                        text="Delete"
                        on_click={async () => {
                          await delete_comment(token, id, blog_comment._id);
                          get_blog_comments();
                        }}
                      />
                    )}
                    {blog_comment.author.username === user_context.user && (
                      <Button
                        text={"Edit"}
                        on_click={() => {
                          editedComment
                            ? setEditedComment(false)
                            : setEditedComment(blog_comment);
                        }}
                      />
                    )}
                  </div>

                  {blog_comment.date && (
                    <div className="blog_date">{blog_comment.date}</div>
                  )}
                </div>
              )}
              {check_same_comment(editedComment._id, blog_comment._id) && (
                <div className="blog-editing-popup">
                  <Textarea
                    minRowsStart={5}
                    state={editedComment.body}
                    setState={setEditedComment}
                    additionalOnchange={(e) => {
                      let editedCommentCopy = { ...editedComment };
                      editedCommentCopy.body = e.target.value;
                      changeInputValue(editedCommentCopy, setEditedComment);
                    }}
                  />

                  <div className="button-container">
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
                          setEditedComment
                        );
                        error_response
                          ? setErrorResponse(error_response)
                          : setErrorResponse(null);
                        get_blog_comments();
                      }}
                    />

                    <Button
                      text={"Cancel"}
                      on_click={() => {
                        editedComment
                          ? setEditedComment(false)
                          : setEditedComment(blog_comment);
                      }}
                    />
                    <Button
                      text="Delete"
                      on_click={async () => {
                        await delete_comment(token, id, blog_comment._id);
                        get_blog_comments();
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!token) {
    return <Redirect route={"/login"} />;
  } else if (!blog) {
    return <Loading_page message={"Loading..."} />;
  }

  return (
    <div className="blog-page">
      <div className="blog-page-inner">
        <div className="blog">
          <h1 className="blog-title">{blog.title}</h1>
          <p className="blog-body">{blog.body}</p>
          <div>{blog.created_date}</div>
          <div className="blog-edited-date">
            {blog.edited_date && blog.edited_date}{" "}
          </div>
        </div>
        <form>
          <Textarea
            minRowsStart={1}
            state={comment}
            setState={setComment}
            placeholder={"Comment here..."}
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
        <div>{errorResponse && render_errors(errorResponse)}</div>
        {render_blog_comments()}
      </div>
    </div>
  );
};

export default Blog_page;
