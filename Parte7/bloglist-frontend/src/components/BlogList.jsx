import { useDispatch, useSelector } from "react-redux";
import { updateBlog, removeBlog } from "../reducers/blogReducer";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";  

const BlogList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs); 
  const token = user ? user.token : null;
 
  const sortedBlogs = (blogs && Array.isArray(blogs) ? [...blogs] : []).sort((a, b) => b.likes - a.likes);

  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    blogService
      .update(blog.id, updatedBlog)
      .then((updated) => {
        dispatch(updateBlog(updated));
      })
      .catch((error) => {
        console.error("Error al dar me gusta:", error);
      });
  };

  const handleDelete = (id) => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar este blog?")) {
      blogService
        .remove(id, token)
        .then(() => {
          dispatch(removeBlog({ id }));
        })
        .catch((error) => {
          console.error("Error al eliminar el blog:", error);
        });
    }
  };
 
  if (sortedBlogs.length === 0) {
    return <p>No hay blogs disponibles.</p>;
  }

  return (
    <div>
      <h2>Blog List</h2>
      {sortedBlogs.map((blog) => (
        <div key={blog.id}>
          <h3>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </h3>

          <p>{blog.author}</p>
          <p>{blog.url}</p>
          <p>{blog.likes} likes</p>
          <button onClick={() => handleLike(blog)}>Like</button>
          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
