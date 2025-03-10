import { NavLink } from "react-router-dom";
import { Container, Button, Typography } from "@mui/material";

const Menu = () => {
  const linkStyle = {
    padding: 5,
    textDecoration: "none",
  };

  return (
    <Container>
      <nav>
        <Typography variant="h6" gutterBottom>
           
        </Typography>
        <NavLink style={linkStyle} to="/" end>
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Blogs
          </Button>
        </NavLink>
        <NavLink style={linkStyle} to="/users">
          <Button variant="contained" color="primary">
            Users
          </Button>
        </NavLink>
      </nav>
    </Container>
  );
};

export default Menu;
