import { Navigate } from "react-router-dom";
import axios from "axios";

const changeInputValue = (value, state_changing) => {
  state_changing(value);
};

const Redirect = ({ route }) => {
  return <Navigate to={route} />;
};

const get_blog_comments = async (token, id, setBlogComments) => {
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

const leave_comment = async (token, id, comment) => {
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
};

const delete_comment = async (token, id, comment_id) => {
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
};

const edit_comment = async (
  token,
  id,
  comment_id,
  editedComment,
  setEditiedComment
) => {
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

  const submit_edits = await axios.put(
    `http://localhost:4000/blogs/${id}/comments`,
    options,
    { headers }
  );
  setEditiedComment(false);
  // get_blog_comments();
};

const check_same_comment = (edited_comment_id, blog_comment_id) => {
  return edited_comment_id === blog_comment_id ? true : false;
};

export {
  changeInputValue,
  Redirect,
  get_blog_comments,
  leave_comment,
  delete_comment,
  edit_comment,
  check_same_comment,
};
