import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Signup_page from "./pages/signup";
import Login_page from "./pages/login";
import Blogs from "./pages/blogs";
import Blog_page from "./components/blog";

const UserContext = React.createContext();

function App() {
  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState();
  const [user, setUser] = useState("Nick");
  const [userId, setUserId] = useState();

  return (
    <Router>
      <UserContext.Provider
        value={{
          token: token,
          setToken: setToken,
          user: user,
          setUser: setUser,
          userId: userId,
          setUserId: setUserId,
          blogs: blogs,
          setBlogs: setBlogs,
        }}
      >
        <div>
          <nav>
            {!token && (
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            )}
            {!token && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {token && (
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
            )}
          </nav>
          <div>
            <Routes>
              <Route path="/signup" element={<Signup_page />}></Route>
              <Route path="/login" element={<Login_page />}></Route>
              <Route path="/blogs" element={<Blogs />}></Route>
              <Route path="/blogs/:id" element={<Blog_page />}></Route>
            </Routes>
          </div>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
export { UserContext };
