import "../src/App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Signup_page from "./pages/signup";
import Login_page from "./pages/login";
import Blogs from "./pages/blogs";
import Blog_page from "./pages/blog";
import { logout } from "./helperfunctions/helperfunctions";
import Custom_Link from "./components/link";

const UserContext = React.createContext();

function App() {
  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

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
            <div className="inner_nav">
              <div className="nav_content">
                {!token && <Custom_Link text={"Signup"} route={"/signup"} />}
                {!token && <Custom_Link text={"Login"} route={"/login"} />}
                {token && (
                  <Custom_Link
                    text={"Logout"}
                    route={"/login"}
                    on_click={() => {
                      logout(setToken, setUser, setUserId, setBlogs);
                    }}
                  />
                )}
              </div>
            </div>
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
