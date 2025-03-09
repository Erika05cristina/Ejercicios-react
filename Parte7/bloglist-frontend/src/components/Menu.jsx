import { NavLink } from "react-router-dom";

const Menu = () => {
  const linkStyle = {
    padding: 5,
    textDecoration: "none",
  };

  return (
    <nav>
      <NavLink style={linkStyle} to="/" end>
        Blogs
      </NavLink>
      <NavLink style={linkStyle} to="/users">
        Users
      </NavLink>
    </nav>
  );
};

export default Menu;
