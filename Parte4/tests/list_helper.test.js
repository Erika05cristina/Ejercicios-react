 
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'A New Kind of Science',
      author: 'Stephen Wolfram',
      url: 'https://www.wolframscience.com/nks/',
      likes: 7,
      __v: 0
    }
  ];

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 12);
  });

  test('when list is empty, equals 0', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
});

// Resto de los tests (sin cambios)...



describe('favoriteBlog', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Blog 1',
      author: 'Edsger ',
      url: 'https://blog1',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a71b54a676234d18a',
      title: 'Blog2',
      author: 'Erika',
      url: 'https://Blog2.com',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422c1a71b54a676234d18b',
      title: 'Blog 3',
      author: 'Cris',
      url: 'https://Blog3.com',
      likes: 3,
      __v: 0
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      title: 'Blog2',
      author: 'Erika',
      likes: 10
    })
  })
})


describe('mostBlogs', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Blog 1',
      author: 'Cristina',
      url: 'https://blog1.com',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a71b54a676234d18a',
      title: 'Blog 2',
      author: 'Cristina',
      url: 'https://blog1.com',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422c1a71b54a676234d18b',
      title: 'Blog 3',
      author: 'Erika',
      url: 'https://blog2.com',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422d1a71b54a676234d18c',
      title: 'Blog 4',
      author: 'Edgar',
      url: 'https://blog3.com',
      likes: 6,
      __v: 0
    },
    {
      _id: '5a422e1a71b54a676234d18d',
      title: 'Blog 5',
      author: 'Juan',
      url: 'https://blog4.com',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422f1a71b54a676234d18e',
      title: 'Blog 6',
      author: 'Cristina',
      url: 'https://blog1.com',
      likes: 4,
      __v: 0
    }
  ]

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Cristina',
      blogs: 3
    })
  })
})

describe('mostLikes', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Blog 1',
      author: 'Cristina',
      url: 'https://blog1.com',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a71b54a676234d18a',
      title: 'Blog 2',
      author: 'Cristina',
      url: 'https://blog1.com',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422c1a71b54a676234d18b',
      title: 'Blog 3',
      author: 'Erika',
      url: 'https://blog2.com',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422d1a71b54a676234d18c',
      title: 'Blog 4',
      author: 'Edgar',
      url: 'https://blog3.com',
      likes: 6,
      __v: 0
    },
    {
      _id: '5a422e1a71b54a676234d18d',
      title: 'Blog 5',
      author: 'Juan',
      url: 'https://blog4.com',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422f1a71b54a676234d18e',
      title: 'Blog 6',
      author: 'Cristina',
      url: 'https://blog1.com',
      likes: 4,
      __v: 0
    }
  ];

  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs);
    assert.deepStrictEqual(result, {
      author: 'Cristina',
      likes: 19 
    });
  });
});

test('si la propiedad likes falta en la solicitud, debe tener el valor 0 por defecto', async () => {
  const newBlog = {
    title: 'Blog sin likes',
    author: 'Autor desconocido',
    url: 'http://example.com/blog-sin-likes'
  }

  const response = await api.post('/api/blogs').send(newBlog).expect(201)
  expect(response.body.likes).toBe(0)
})

