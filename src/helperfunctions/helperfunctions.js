import axios from "axios";
import { format } from "date-fns";

const changeInputValue = (value, state_changing) => {
  state_changing(value);
};

const create_timestamp = () => {
  let date = format(new Date(), "yyyy-MM-dd @ ");
  const hours = format(new Date(), "HH");
  let formatted_hours = hours > 12 ? hours - 12 : hours;
  let am_or_pm = hours > 12 ? "pm" : "am";
  const minutes = format(new Date(), "mm");
  return (date += `${formatted_hours}:${minutes}${am_or_pm} EST`);
};

const logout = (setToken, setUser, setUserId, setBlogs) => {
  setToken(null);
  setUser(null);
  setUserId(null);
  setBlogs(null);
};

//GET BLOGS

const get_blogs = async (token, setBlogs, setToken) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };
  const get_all_blogs = async () => {
    try {
      let response = await axios.get("http://localhost:4000/blogs", options);
      // const response = get_all_blogs();
      setBlogs(response.data);
      return;
    } catch (err) {
      setToken(null);

      return err;
    }
  };
  get_all_blogs();
};

//COMMENT RELATED FUNCTION BELOW

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
  const date = create_timestamp();
  const options = {
    method: "POST",
    mode: "cors",
    data: {
      blog_id: id,
      comment: comment,
      date: date,
    },
  };

  const create_comment = await axios.post(
    `http://localhost:4000/blogs/${id}/comments`,
    options,
    { headers }
  );

  const error_array = create_comment.data.errors;
  if (error_array) {
    return error_array;
  }
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
  const format_comment = editedComment.date.split("edited");
  format_comment[0]
    ? (editedComment.date = `edited - ${format_comment[0]}`)
    : (editedComment.date = `edited ${format_comment[1]}`);
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
  const error_array = submit_edits.data.errors;
  if (error_array) {
    return error_array;
  }
};

const check_same_comment = (edited_comment_id, blog_comment_id) => {
  return edited_comment_id === blog_comment_id ? true : false;
};

const render_errors = (error_array) => {
  return (
    <div className="rendered-errors">
      <div className="rendered-error-header">
        Unable to complete request. Please note the following issues.
      </div>
      <ul className="rendered-errors-list">
        {error_array.map((error) => {
          return (
            <li key={error.msg} className="rendered-error-message">
              {error.msg}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export {
  changeInputValue,
  logout,
  get_blogs,
  get_blog_comments,
  leave_comment,
  delete_comment,
  edit_comment,
  check_same_comment,
  render_errors,
};
