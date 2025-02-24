const BlogForm = ({ handleNewBlogSubmit, newBlog, handleNewBlogChange, setFormVisible }) => {
    return (
      <div>
        <form onSubmit={handleNewBlogSubmit}>
          <div>
            <label>Title</label>
            <input type="text" name="title" value={newBlog.title} onChange={handleNewBlogChange} required />
          </div>
          <div>
            <label>Author</label>
            <input type="text" name="author" value={newBlog.author} onChange={handleNewBlogChange} required />
          </div>
          <div>
            <label>URL</label>
            <input type="text" name="url" value={newBlog.url} onChange={handleNewBlogChange} required />
          </div>
          <div>
            <label>Likes</label>
            <input type="number" name="likes" value={newBlog.likes} onChange={handleNewBlogChange} min="0" />
          </div>
          <button type="submit">Create Blog</button>
          <button onClick={() => setFormVisible(false)}>Cancel</button>
        </form>
      </div>
    )
  }
  
  export default BlogForm
  