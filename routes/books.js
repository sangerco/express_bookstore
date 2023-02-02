const express = require("express");
const Book = require("../models/book");
const jsonschema = require('jsonschema');
const bookSchema = require('../schemas/bookSchema.json');
const ExpressError = require('../expressError');
const db = require("../db");

const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    console.log(req.body);
    const data = jsonschema.validate(req.body, bookSchema);
    const book = data.instance.book;
    if(!data.valid) {
        console.log(book);
        const listOfErrors = data.errors.map(error => error.stack);
        const error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    const result = await Book.create(book)
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const { isbn } = req.params;
    console.log(isbn);
    const data = jsonschema.validate(req.body, bookSchema)
    const book = data.instance.book;
    if(!data.valid) {
        const listOfErrors = result.errors.map(error => error.stack);
        const error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    const result = await Book.update(isbn, book);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
