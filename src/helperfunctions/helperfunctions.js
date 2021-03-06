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

const get_blogs = async (token, setBlogs, setToken, user_context) => {
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
      let response = await axios.get(
        `${user_context.webAddress}/blogs`,
        options
      );
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

const get_blog = async (id, token, setToken, setBlog, user_context) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };
  const get_the_blog = async () => {
    try {
      let response = await axios.get(
        `${user_context.webAddress}/blogs/${id}`,
        options
      );
      setBlog(response.data);
      return;
    } catch (err) {
      setToken(null);
      return err;
    }
  };
  get_the_blog();
};

//COMMENT RELATED FUNCTION BELOW

const get_blog_comments = async (id, token, setBlogComments, user_context) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };
  const get_blog_comments = await axios.get(
    `${user_context.webAddress}/blogs/${id}/comments`,
    options
  );
  const response = get_blog_comments;
  setBlogComments(response.data);
};

const leave_comment = async (token, id, comment, user_context) => {
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
    `${user_context.webAddress}/blogs/${id}/comments`,
    options,
    { headers }
  );

  const error_array = create_comment.data.errors;
  if (error_array) {
    return error_array;
  }
};

const delete_comment = async (token, id, comment_id, user_context) => {
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
    `${user_context.webAddress}/blogs/${id}/comments`,
    options
  );
};

const edit_comment = async (
  token,
  id,
  comment_id,
  editedComment,
  setEditiedComment,
  user_context
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
    `${user_context.webAddress}/blogs/${id}/comments`,
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
  get_blog,
  get_blog_comments,
  leave_comment,
  delete_comment,
  edit_comment,
  check_same_comment,
  render_errors,
};
