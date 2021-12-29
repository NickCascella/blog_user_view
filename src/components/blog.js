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
  const [editingComment, setEditingComment] = useState(false);
  const [editedComment, setEditiedComment] = useState("");

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
    console.log(response.data);
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
    get_blog_comments();
  };

  const delete_comment = async (comment_id) => {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        blog_comment_id: comment_id,
      },
    };

    const delete_comment_request = await axios.delete(
      `http://localhost:4000/blogs/${id}/comments`,
      options
    );
    get_blog_comments();
  };

  const edit_comment = async (comment_id) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const options = {
      data: {
        comment_id: comment_id,
        comment: editedComment,
      },
    };
    console.log(editedComment);

    const submit_edits = await axios.put(
      `http://localhost:4000/blogs/${id}/comments`,
      options,
      { headers }
    );
    setEditiedComment(false);
    setEditingComment(false);
    get_blog_comments();
  };

  const check_comment = (blog_comment_id) => {
    return editedComment._id === blog_comment_id ? true : false;
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
              {!check_comment(blog_comment._id) && (
                <div>
                  <div>{blog_comment.body}</div>
                  <div>{blog_comment.author.username}</div>
                  <button
                    onClick={() => {
                      delete_comment(blog_comment._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
              {editingComment && check_comment(blog_comment._id) && (
                <div>
                  <form>
                    <input
                      value={editedComment.body}
                      onChange={(e) => {
                        let editedCommentCopy = { ...editedComment };
                        editedCommentCopy.body = e.target.value;

                        changeInputValue(editedCommentCopy, setEditiedComment);
                      }}
                    ></input>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        await edit_comment(blog_comment._id);
                        setEditingComment(!editingComment);
                      }}
                    >
                      Submit Edits
                    </button>
                  </form>
                </div>
              )}
              <button
                onClick={() => {
                  setEditingComment(!editingComment);
                  editedComment
                    ? setEditiedComment(false)
                    : setEditiedComment(blog_comment);
                }}
              >
                Edit
              </button>
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
          value={comment}
        ></input>
        <button type="submit">Send</button>
      </form>
      <div>{render_blog_comments()}</div>
    </div>
  );
};

export default Blog_page;
