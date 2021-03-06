import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import Loading_page from "../components/loading";
import Button from "../components/button";
import Redirect from "../components/redirect";
import {
  changeInputValue,
  leave_comment,
  delete_comment,
  edit_comment,
  check_same_comment,
  render_errors,
  get_blog,
  get_blog_comments,
} from "../helperfunctions/helperfunctions";
import Textarea from "../components/textarea";

const Blog_page = (props) => {
  const { id } = useParams();
  const user_context = useContext(UserContext);
  const token = user_context.token;
  const setToken = user_context.setToken;
  const [blog, setBlog] = useState("");
  const [comment, setComment] = useState("");
  const [blogComments, setBlogComments] = useState([]);
  const [editedComment, setEditedComment] = useState("");
  const [errorResponse, setErrorResponse] = useState(null);

  useEffect(async () => {
    await get_blog(id, token, setToken, setBlog, user_context);
    get_blog_comments(id, token, setBlogComments, user_context);
  }, []);

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
                          await delete_comment(
                            token,
                            id,
                            blog_comment._id,
                            user_context
                          );
                          get_blog_comments(
                            id,
                            token,
                            setBlogComments,
                            user_context
                          );
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
                          setEditedComment,
                          user_context
                        );
                        error_response
                          ? setErrorResponse(error_response)
                          : setErrorResponse(null);
                        get_blog_comments(
                          id,
                          token,
                          setBlogComments,
                          user_context
                        );
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
                        await delete_comment(
                          token,
                          id,
                          blog_comment._id,
                          user_context
                        );
                        get_blog_comments(
                          id,
                          token,
                          setBlogComments,
                          user_context
                        );
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
              let error_response = await leave_comment(
                token,
                id,
                comment,
                user_context
              );

              error_response
                ? setErrorResponse(error_response)
                : setErrorResponse(null);
              get_blog_comments(id, token, setBlogComments, user_context);
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
