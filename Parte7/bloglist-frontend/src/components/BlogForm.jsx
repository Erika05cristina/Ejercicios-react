import React from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";

const BlogForm = ({ handleNewBlogSubmit, newBlog, handleNewBlogChange, setFormVisible }) => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Create New Blog
      </Typography>
      <form onSubmit={handleNewBlogSubmit} data-testid="blog-form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              type="text"
              name="title"
              value={newBlog.title}
              onChange={handleNewBlogChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Author"
              type="text"
              name="author"
              value={newBlog.author}
              onChange={handleNewBlogChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="URL"
              type="text"
              name="url"
              value={newBlog.url}
              onChange={handleNewBlogChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Likes"
              type="number"
              name="likes"
              value={newBlog.likes}
              onChange={handleNewBlogChange}
              fullWidth
              min="0"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Blog
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => setFormVisible(false)} variant="outlined" color="secondary" fullWidth>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default BlogForm;
