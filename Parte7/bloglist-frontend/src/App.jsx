import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setBlogs, addBlog } from "./reducers/blogReducer";
import {
  setNotification,
  clearNotification,
} from "./reducers/notificationReducer";
import { setUser, clearUser } from "./reducers/userReducer";  
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import UserList from "./components/UserList";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  useEffect(() => { 
    const loggedUserJSON = localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(loggedUser));  
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedInUser = await loginService.login({ username, password });
      dispatch(setUser(loggedInUser));  
      blogService.setToken(loggedInUser.token);
      localStorage.setItem("loggedUser", JSON.stringify(loggedInUser));
      setUsername("");
      setPassword("");
      dispatch(
        setNotification({ message: "Login successful", type: "success" })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      dispatch(
        setNotification({
          message: "Invalid username or password",
          type: "error",
        })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser()); 
    localStorage.removeItem("loggedUser");
    blogService.setToken(null);
    dispatch(
      setNotification({ message: "Logged out successfully", type: "success" })
    );
    setTimeout(() => dispatch(clearNotification()), 5000);
  };

  const handleNewBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  const handleNewBlogSubmit = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await blogService.create(newBlog);
      dispatch(addBlog(createdBlog));  
      setNewBlog({
        title: "",
        author: "",
        url: "",
        likes: 0,
      });
      setFormVisible(false);
      dispatch(
        setNotification({
          message: "New blog created successfully",
          type: "success",
        })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    } catch (error) {
      console.error("Error al crear un blog", error);
      dispatch(
        setNotification({ message: "Error creating blog", type: "error" })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification} />

      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      ) : (
        <>
          <p>{user ? `${user.name} logged in` : "No user logged in"}</p>
          <button onClick={handleLogout}>Logout</button>

          {/* {!formVisible ? (
            <button onClick={() => setFormVisible(true)}>
              Create new blog
            </button>
          ) : (
            <BlogForm
              handleNewBlogSubmit={handleNewBlogSubmit}
              newBlog={newBlog}
              handleNewBlogChange={handleNewBlogChange}
              setFormVisible={setFormVisible}
            />
          )}

          <BlogList blogs={blogs} /> */}
          <UserList />
        </>
      )}
    </div>
  );
};

export default App;
