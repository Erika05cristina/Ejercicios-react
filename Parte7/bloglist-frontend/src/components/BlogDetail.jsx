import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Typography, Button, Link } from "@mui/material";

const BlogDetail = () => {
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
    return <Typography variant="h6" color="error">Blog not found</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5}}>
      <Typography variant="h4" gutterBottom>
        {blog.title} by {blog.author}
      </Typography>
      <Typography variant="body1" >
        <strong>URL:</strong>{" "}
        <Link href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </Link>
      </Typography>
      <Typography variant="body1"  >
        <strong>Likes:</strong> {blog.likes}
      </Typography>
     
    </Container>
  );
};

export default BlogDetail;
