import React from "react";

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>Blog List</h2>
      {sortedBlogs.map((blog) => (
        <div key={blog.id}>
          <h3>{blog.title}</h3>
          <p>{blog.author}</p>
          <p>{blog.likes} likes</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
