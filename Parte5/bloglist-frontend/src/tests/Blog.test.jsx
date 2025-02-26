import React from 'react';
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import "@testing-library/jest-dom";

import Blog from '../components/Blog';

test('muestra el título y el autor pero no la URL ni los likes por defecto', () => {
  const blog = {
    title: 'Blog de prueba',
    author: 'Autor de prueba',
    url: 'http://example.com',
    likes: 10
  };

  render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} user={{ id: '123' }} />);

  // Verifica que el título y autor estén en pantalla
  expect(screen.getByText('Blog de prueba Autor de prueba')).toBeInTheDocument();

  // Verifica que la URL y likes NO estén en el documento inicialmente
  expect(screen.queryByText('http://example.com')).not.toBeInTheDocument();
  expect(screen.queryByText('Likes: 10')).not.toBeInTheDocument();
});
