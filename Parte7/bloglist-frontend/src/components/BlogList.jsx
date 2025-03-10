import { useDispatch, useSelector } from "react-redux";
import { updateBlog, removeBlog } from "../reducers/blogReducer";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";  
import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";

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
        <Card key={blog.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {blog.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {blog.url}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {blog.likes} likes
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleLike(blog)}>
              Like
            </Button>
            <Button size="small" color="error" onClick={() => handleDelete(blog.id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};
export default BlogList;
