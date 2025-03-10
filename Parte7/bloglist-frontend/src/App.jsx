import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setBlogs, addBlog } from "./reducers/blogReducer";
import { setNotification, clearNotification,} from "./reducers/notificationReducer";
import { setUser, clearUser } from "./reducers/userReducer";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import BlogDetail from "./components/BlogDetail";
import Menu from "./components/Menu";
import { Route, Routes } from "react-router-dom";
import userService from "./services/users";
import { Container, Button, Typography } from "@mui/material";


const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);
  const [usuarios, setUsuarios] = useState([]);
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
    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await blogService.getAll();
        console.log("Fetched blogs:", fetchedBlogs);
        dispatch(setBlogs(fetchedBlogs));
      } catch (error) {
        console.error("Error fetching blogs", error);
        dispatch(
          setNotification({ message: "Error fetching blogs", type: "error" })
        );
        setTimeout(() => dispatch(clearNotification()), 5000);
      }
    };
    if (user) {
      fetchBlogs();
    }
  }, [dispatch, user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(loggedUser));
      blogService.setToken(loggedUser.token);
    }
  }, [dispatch]);

  useEffect(() => {
    userService
      .getAll()  
      .then((data) => {
        console.log("Usuarios recibidos:", data); 
        setUsuarios(data);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
      });
  }, []);

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
    <Container>
      <Typography variant="h2" gutterBottom>
        Blogs
      </Typography>
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
          <Typography variant="h5" gutterBottom>
            {user ? `${user.name} logged in        ` : "No user logged in"}
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
          </Typography>
       
          
          {!formVisible ? (
          <Container>  <Button variant="contained" color="primary" onClick={() => setFormVisible(true)} style={{ marginTop: 16 }}>
              Create new blog
            </Button></Container>
          ) : (
            <BlogForm
              handleNewBlogSubmit={handleNewBlogSubmit}
              newBlog={newBlog}
              handleNewBlogChange={handleNewBlogChange}
              setFormVisible={setFormVisible}
            />
          )}
          <Menu />
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/users" element={<UserList usuarios={usuarios} />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
          </Routes>
        </>
      )}
    </Container>
  );
};

export default App;
