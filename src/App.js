import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Debug from "./test_fetch";
import Signup_page from "./pages/signup";
import Login_page from "./pages/login";
import Blogs from "./pages/blogs";
import React, { useState, useEffect } from "react";

const UserContext = React.createContext();

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState("Nick");

  return (
    <Router>
      <UserContext.Provider value={{ token: token, setToken: setToken }}>
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
            </Routes>
          </div>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
export { UserContext };
