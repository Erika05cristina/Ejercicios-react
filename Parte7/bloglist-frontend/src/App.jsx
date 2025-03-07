import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Usamos Redux
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import { setNotification, clearNotification } from "./reducers/notificationReducer"; // Acciones de notificación
const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification); // Usamos el estado de Redux para las notificaciones

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
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
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      localStorage.setItem("loggedUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
      dispatch(setNotification({ message: "Login successful", type: "success" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      dispatch(setNotification({ message: "Invalid username or password", type: "error" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
    blogService.setToken(null);
    dispatch(setNotification({ message: "Logged out successfully", type: "success" }));
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
      setBlogs(blogs.concat(createdBlog));
      setNewBlog({
        title: "",
        author: "",
        url: "",
        likes: 0,
      });
      setFormVisible(false);
      dispatch(setNotification({ message: "New blog created successfully", type: "success" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    } catch (error) {
      console.error("Error al crear un blog", error);
      dispatch(setNotification({ message: "Error creating blog", type: "error" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const updateBlog = async (id, updatedBlog) => {
    const newBlog = await blogService.update(id, updatedBlog);
    setBlogs(blogs.map((blog) => (blog.id === id ? newBlog : blog)));
  };

  const deleteBlog = async (id) => {
    try {
      const user = JSON.parse(window.localStorage.getItem("loggedUser"));
      if (!user || !user.token) {
        throw new Error("Token not found");
      }
      const blogToDelete = blogs.find((blog) => blog.id === id);
      if (blogToDelete.author !== user.username) {
        dispatch(setNotification({ message: "You are not authorized to delete this blog", type: "error" }));
        setTimeout(() => dispatch(clearNotification()), 5000);
        return;
      }
      await blogService.remove(id, user.token);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      dispatch(setNotification({ message: "Blog deleted successfully", type: "success" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    } catch (error) {
      console.error("Error eliminando blog:", error);
      dispatch(setNotification({ message: "Error deleting blog", type: "error" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <p>{user ? `${user.name} logged in` : 'No user logged in'}</p>
      <button onClick={handleLogout}>Logout</button>

      {notification.message && (
        <div
          style={{
            padding: "10px",
            backgroundColor: notification.type === "success" ? "green" : "red",
            color: "white",
            marginBottom: "20px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {notification.message}
        </div>
      )}

      {!formVisible ? (
        <button onClick={() => setFormVisible(true)}>Create new blog</button>
      ) : (
        <BlogForm
          handleNewBlogSubmit={handleNewBlogSubmit}
          newBlog={newBlog}
          handleNewBlogChange={handleNewBlogChange}
          setFormVisible={setFormVisible}
        />
      )}

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            user={user ? user : { id: null }}
          />
        ))}
    </div>
  );
};

export default App;
