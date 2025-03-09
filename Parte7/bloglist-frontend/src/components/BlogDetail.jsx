import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const BlogDetail = () => {
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
    return <p>Blog not found</p>;
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <p>
        URL:{" "}
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      <p>Likes: {blog.likes}</p>
    </div>
  );
};

export default BlogDetail;
