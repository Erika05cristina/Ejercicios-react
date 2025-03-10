import React from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

const LoginForm = ({ username, password, handleLogin, setUsername, setPassword }) => {
  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;
