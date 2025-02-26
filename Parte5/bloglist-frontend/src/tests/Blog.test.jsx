import React from 'react';
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import "@testing-library/jest-dom";
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

