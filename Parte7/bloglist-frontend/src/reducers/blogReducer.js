import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map(blog => 
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload.id);
    }
  }
});

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;
