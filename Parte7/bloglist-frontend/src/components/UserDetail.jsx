import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.users.find((u) => u.id === id));

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetail;
