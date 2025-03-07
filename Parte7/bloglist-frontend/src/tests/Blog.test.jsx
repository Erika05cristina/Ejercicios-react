import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect } from "vitest";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Blog from "../components/Blog";
import BlogForm from '../components/BlogForm';

test("muestra el título y el autor pero no la URL ni los likes por defecto", () => {
  const blog = {
    title: "Blog de prueba",
    author: "Autor de prueba",
    url: "http://example.com",
    likes: 10,
  };

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      deleteBlog={() => {}}
      user={{ id: "123" }}
    />
  );

  expect(
    screen.getByText("Blog de prueba Autor de prueba")
  ).toBeInTheDocument();

  expect(screen.queryByText("http://example.com")).not.toBeInTheDocument();
  expect(screen.queryByText("Likes: 10")).not.toBeInTheDocument();
});
test('muestra la URL y los likes cuando se hace clic en el botón "View"', async () => {
  const blog = {
    title: "Blog de prueba",
    author: "Autor de prueba",
    url: "http://example.com",
    likes: 10,
  };

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      deleteBlog={() => {}}
      user={{ id: "123" }}
    />
  );

  const button = screen.getByText("View");
  await userEvent.click(button);

  expect(screen.getByText("http://example.com")).toBeInTheDocument();
  expect(screen.getByText("Likes: 10")).toBeInTheDocument();
});

test('llama al manejador de likes dos veces cuando se hace clic dos veces en "Like"', async () => {
  const blog = {
    title: "Blog de prueba",
    author: "Autor de prueba",
    url: "http://example.com",
    likes: 10,
  };
  const mockUpdateBlog = vi.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      deleteBlog={() => {}}
      user={{ id: "123" }}
    />
  );

  const viewButton = screen.getByText("View");
  await userEvent.click(viewButton);

  const likeButton = screen.getByText("Like");
  await userEvent.click(likeButton);
  await userEvent.click(likeButton);

  expect(mockUpdateBlog).toHaveBeenCalledTimes(2);
});


test('llama al manejador de eventos con la información correcta cuando se crea un nuevo blog', async () => {
  const mockCreateBlog = vi.fn();
  const setFormVisible = vi.fn();
  const newBlog = { title: '', author: '', url: '', likes: 0 };

  const handleNewBlogChange = (e) => {
    newBlog[e.target.name] = e.target.value;
  };
  
  const handleNewBlogSubmit = () => {
    mockCreateBlog(newBlog);
  };
  render(
    <BlogForm
      handleNewBlogSubmit={handleNewBlogSubmit}
      newBlog={newBlog}
      handleNewBlogChange={handleNewBlogChange}
      setFormVisible={setFormVisible}
    />
  );

  fireEvent.change(screen.getByPlaceholderText(/Title/), { target: { value: 'Nuevo Blog' } });
  fireEvent.change(screen.getByPlaceholderText(/Author/), { target: { value: 'Nuevo Autor' } });
  fireEvent.change(screen.getByPlaceholderText(/URL/), { target: { value: 'http://nuevo-blog.com' } });
  fireEvent.change(screen.getByPlaceholderText(/Likes/), { target: { value: '10' } });

  fireEvent.click(screen.getByText(/Create Blog/));

  await waitFor(() => expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Nuevo Blog',
    author: 'Nuevo Autor',
    url: 'http://nuevo-blog.com',
    likes: 10
  }));
});