import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDetail = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);

  const user = users.find((user) => user.id === id);
  if (!user) {
    return <p>User not found</p>;
  }

  const userBlogs = blogs.filter(
    (blog) => blog.user && blog.user.id === id
  );

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {userBlogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetail;
