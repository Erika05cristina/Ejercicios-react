import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
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
          <p>Likes: {blog.likes}</p>
          <p>Author: {blog.author}</p>
        </div>
      )}
    </div>
  );
};

export default Blog