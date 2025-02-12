const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }

  const favoriteBlog = (blogs) => {
 
    const blog = blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog : max
    }, { likes: 0 })
  
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
  }
  
  const mostBlogs = (blogs) => {
    const authorBlogCount = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1;
      return counts;
    }, {});
 
    const authorArray = Object.entries(authorBlogCount).map(([author, blogs]) => {
      return { author, blogs };
    });
  
    return authorArray.reduce((max, current) => (current.blogs > max.blogs ? current : max), { blogs: 0 });
  }
  
  module.exports = {
    dummy,
    totalLikes, 
    favoriteBlog,
    mostBlogs
  }
  