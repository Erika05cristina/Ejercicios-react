import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
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
      showNotification("Login successful", "success");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      showNotification("Invalid username or password", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
    blogService.setToken(null);
    showNotification("Logged out successfully", "success");
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
      showNotification("New blog created successfully", "success");
    } catch (error) {
      console.error("Error al crear un blog", error);
      showNotification("Error creating blog", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {notification.message && (
          <div
            style={{
              padding: "10px",
              backgroundColor:
                notification.type === "success" ? "green" : "red",
              color: "white",
              marginBottom: "20px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {notification.message}
          </div>
        )}
      </div>
    );
  }
  const updateBlog = async (id, updatedBlog) => {
    const newBlog = await blogService.update(id, updatedBlog);
    setBlogs(blogs.map((blog) => (blog.id === id ? newBlog : blog)));
  };

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
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
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
        ))}
    </div>
  );
};

export default App;
