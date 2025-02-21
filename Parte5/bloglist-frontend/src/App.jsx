import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  useEffect(() => {
    if (user) {  // Solo obtener blogs si hay usuario autenticado
      blogService.getAll().then(blogs => {
        console.log('Blogs recibidos:', blogs)  // 👀 Verifica qué llega del backend
        setBlogs(blogs)
      }).catch(error => {
        console.error('Error obteniendo blogs:', error)
      })
    }
  }, [user])  // 🔥 Se ejecuta cada vez que cambia `user`
  
  

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      localStorage.setItem('loggedUser', JSON.stringify(user)) 
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Error al iniciar sesión', error)
    }
  }
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('loggedUser')  
    blogService.setToken(null)  
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username
            <input 
              type="text" 
              value={username} 
              onChange={({ target }) => setUsername(target.value)} 
            />
          </div>
          <div>
            Password
            <input 
              type="password" 
              value={password} 
              onChange={({ target }) => setPassword(target.value)} 
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button> {/* Botón de logout */}
      {blogs.map(blog => (
        <div >
          <h3>{blog.title}</h3>
          <p><strong>Url:</strong> <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
          <p><strong>Likes:</strong> {blog.likes}</p>
        </div>
      ))}
    </div>
  )
  
}

export default App
