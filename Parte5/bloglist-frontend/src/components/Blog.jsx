import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    };
    await updateBlog(blog.id, updatedBlog);
  };

  const blogStyle = {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
  };
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'Hide' : 'View'}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
          <p>Likes: {blog.likes}<button onClick={handleLike}>Like</button></p>
          <p>Author: {blog.author}</p>
        </div>
      )}
    </div>
  );
};

export default Blog