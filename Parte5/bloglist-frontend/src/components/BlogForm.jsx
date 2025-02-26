const BlogForm = ({ handleNewBlogSubmit, newBlog, handleNewBlogChange, setFormVisible }) => {
  const submitHandler = (e) => {
    e.preventDefault();
    handleNewBlogSubmit(newBlog); // Verifica que esta función esté siendo llamada
  };
    return (
      <div>
        <form onSubmit={handleNewBlogSubmit} data-testid="blog-form">
          <div>
            <label>Title</label>
            <input type="text" name="title" placeholder="Title" value={newBlog.title} onChange={handleNewBlogChange} required />
          </div>
          <div>
            <label>Author</label>
            <input type="text" name="author" placeholder="Author" value={newBlog.author} onChange={handleNewBlogChange} required />
          </div>
          <div>
            <label>URL</label>
            <input type="text" name="url" placeholder="URL"  value={newBlog.url} onChange={handleNewBlogChange} required />
          </div>
          <div>
            <label>Likes</label>
            <input type="number" name="likes" placeholder="Likes" value={newBlog.likes} onChange={handleNewBlogChange} min="0" />
          </div>
          <button type="submit">Create Blog</button>
          <button onClick={() => setFormVisible(false)}>Cancel</button>
        </form>
      </div>
    )
  }
  
  export default BlogForm
  