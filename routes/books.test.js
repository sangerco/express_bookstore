process.env.NODE_ENV === "test"

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const { findAll, findOne, create, update, remove } = require("../models/book");
const Book = require("../models/book");


beforeEach(async () => {
    await db.query("DELETE FROM books");

    const b = await create({
        isbn: "123456789",
        amazon_url: "www.amazon.com/test",
        author: "Test McAuthor",
        language: "english",
        pages: 444,
        publisher: "Test Books",
        title: "Test Book",
        year: 1929
    });

    const b2 = await create({
        isbn: "234567890",
        amazon_url: "www.amazon.com/test2",
        author: "Test McAuthor",
        language: "english",
        pages: 333,
        publisher: "Test Books",
        title: "Test Book2",
        year: 1939
    });
});

afterAll(async () => {
    await db.end();
});

describe('Test Book class', () => {
    test('get all books', async () => {
        const res = await findAll();
        expect(res).toEqual([
                {
                    "isbn": "123456789",
                    "amazon_url": "www.amazon.com/test",
                    "author": "Test McAuthor",
                    "language": "english",
                    "pages": 444,
                    "publisher": "Test Books",
                    "title": "Test Book",
                    "year": 1929
                },
                {
                    "isbn": "234567890",
                    "amazon_url": "www.amazon.com/test2",
                    "author": "Test McAuthor",
                    "language": "english",
                    "pages": 333,
                    "publisher": "Test Books",
                    "title": "Test Book2",
                    "year": 1939
                }
            ]);
    });

    test('get a single book', async () => {
        const res = await findOne(123456789);
        expect(res).toEqual({
                "isbn": "123456789",
                "amazon_url": "www.amazon.com/test",
                "author": "Test McAuthor",
                "language": "english",
                "pages": 444,
                "publisher": "Test Books",
                "title": "Test Book",
                "year": 1929
            });
    });

    test('create book', async () => {
        const b = await create({
            isbn: "345678901",
            amazon_url: "www.amazon.com/test3",
            author: "Test McAuthor",
            language: "english",
            pages: 555,
            publisher: "Test Books",
            title: "Test Book3",
            year: 1949
        });

        expect(b).toEqual({
                "isbn": "345678901",
                "amazon_url": "www.amazon.com/test3",
                "author": "Test McAuthor",
                "language": "english",
                "pages": 555,
                "publisher": "Test Books",
                "title": "Test Book3",
                "year": 1949
            });
    });

    test('update a book', async () => {
        const data = {
            amazon_url: "www.amazon.com/test",
            author: "Test McAuthor",
            language: "english",
            pages: 555,
            publisher: "Test Books",
            title: "Test Book",
            year: 1929
        }
        const b = await update("123456789", data);
        expect(b).toEqual({
                "isbn": "123456789",
                "amazon_url": "www.amazon.com/test",
                "author": "Test McAuthor",
                "language": "english",
                "pages": 555,
                "publisher": "Test Books",
                "title": "Test Book",
                "year": 1929
            });
    });

    test('delete book', async () => {
        const b = await remove(234567890);
        expect(b).toBe(undefined);
    });
})

describe('test book routes', () => {
    test('GET /books', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "books": [
                {
                    "isbn": "123456789",
                    "amazon_url": "www.amazon.com/test",
                    "author": "Test McAuthor",
                    "language": "english",
                    "pages": 444,
                    "publisher": "Test Books",
                    "title": "Test Book",
                    "year": 1929
                },
                {
                    "isbn": "234567890",
                    "amazon_url": "www.amazon.com/test2",
                    "author": "Test McAuthor",
                    "language": "english",
                    "pages": 333,
                    "publisher": "Test Books",
                    "title": "Test Book2",
                    "year": 1939
                }
            ]
        });
    });
    
    
    test('GET /books/isbn', async () => {
        const res = await request(app).get(`/books/123456789`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "book": {
                "isbn": "123456789",
                "amazon_url": "www.amazon.com/test",
                "author": "Test McAuthor",
                "language": "english",
                "pages": 444,
                "publisher": "Test Books",
                "title": "Test Book",
                "year": 1929
            }
        });
    });

    test('POST /books', async () => {
        const data = {
            book: {
            isbn: "345678901",
            amazon_url: "www.amazon.com/test3",
            author: "Test McAuthor",
            language: "english",
            pages: 555,
            publisher: "Test Books",
            title: "Test Book3",
            year: 1949
        }}
        const res = await request(app).post('/books').send(data);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            "book": {
                "isbn": "345678901",
                "amazon_url": "www.amazon.com/test3",
                "author": "Test McAuthor",
                "language": "english",
                "pages": 555,
                "publisher": "Test Books",
                "title": "Test Book3",
                "year": 1949
            }
        })
    });

    test('PUT /books/isbn', async () => {
        const data = {
            book: {
            isbn: "123456789",
            amazon_url: "www.amazon.com/test",
            author: "Test McAuthor",
            language: "english",
            pages: 555,
            publisher: "Test Books",
            title: "Test Book",
            year: 1929
        }}
        const res = await request(app).put('/books/123456789').send(data);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "book": {
                "isbn": "123456789",
                "amazon_url": "www.amazon.com/test",
                "author": "Test McAuthor",
                "language": "english",
                "pages": 555,
                "publisher": "Test Books",
                "title": "Test Book",
                "year": 1929
            }
        });
    });

    test('DELETE /books/isbn', async () => {
        const res = await request(app).delete('/books/234567890');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "message": "Book deleted"
        })
    });
})

