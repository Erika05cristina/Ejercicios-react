import React from 'react';
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import userEvent from '@testing-library/user-event';
import Blog from '../components/Blog';


test('muestra el título y el autor pero no la URL ni los likes por defecto', () => {
  const blog = {
    title: 'Blog de prueba',
    author: 'Autor de prueba',
    url: 'http://example.com',
    likes: 10
  };

  render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} user={{ id: '123' }} />);
 
  expect(screen.getByText('Blog de prueba Autor de prueba')).toBeInTheDocument();
 
  expect(screen.queryByText('http://example.com')).not.toBeInTheDocument();
  expect(screen.queryByText('Likes: 10')).not.toBeInTheDocument();
});
test('muestra la URL y los likes cuando se hace clic en el botón "View"', async () => {
  const blog = {
    title: 'Blog de prueba',
    author: 'Autor de prueba',
    url: 'http://example.com',
    likes: 10
  };

  render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} user={{ id: '123' }} />);

  const button = screen.getByText('View');
  await userEvent.click(button);

  expect(screen.getByText('http://example.com')).toBeInTheDocument();
  expect(screen.getByText('Likes: 10')).toBeInTheDocument();
});

test('llama al manejador de likes dos veces cuando se hace clic dos veces en "Like"', async () => {
  const blog = {
    title: 'Blog de prueba',
    author: 'Autor de prueba',
    url: 'http://example.com',
    likes: 10
  };
  const mockUpdateBlog = vi.fn();

  render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={() => {}} user={{ id: '123' }} />);

  const viewButton = screen.getByText('View');
  await userEvent.click(viewButton);

  const likeButton = screen.getByText('Like');
  await userEvent.click(likeButton);
  await userEvent.click(likeButton);

  expect(mockUpdateBlog).toHaveBeenCalledTimes(2);
});

