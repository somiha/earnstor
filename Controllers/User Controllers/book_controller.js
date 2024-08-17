const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_book_cat = async (req, res, next) => {
  try {
    const { name } = req.body;

    const addBookCatQuery = "INSERT INTO book_cat (name) VALUES (?)";
    await queryAsync(addBookCatQuery, [name]);

    return res.status(200).json({
      status: true,
      msg: "Book category added successfully",
      category: { name },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_book_cat = async (req, res, next) => {
  try {
    const getBookCatsQuery = "SELECT * FROM book_cat";
    const categories = await queryAsync(getBookCatsQuery);

    return res.status(200).json({ status: true, categories });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_book = async (req, res, next) => {
  try {
    const { name, author, about_author, overview, price, cat_id } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addBookQuery =
      "INSERT INTO book (name, author, about_author, overview, price, cat_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await queryAsync(addBookQuery, [
      name,
      author,
      about_author,
      overview,
      price,
      cat_id,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Book added successfully",
      book: {
        name,
        author,
        about_author,
        overview,
        price,
        cat_id,
        image: imageUrl,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_all_book = async (req, res, next) => {
  try {
    const getAllBooksQuery = `
      SELECT b.*, c.name AS cat_name
      FROM book b
      INNER JOIN book_cat c ON b.cat_id = c.id
    `;

    const books = await queryAsyncWithoutValue(getAllBooksQuery);

    return res.status(200).json({ status: true, books });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_book_by_cat = async (req, res, next) => {
  try {
    const { cat_id } = req.query;

    const getBooksByCatQuery = `
      SELECT b.*, c.name AS cat_name
      FROM book b
      INNER JOIN book_cat c ON b.cat_id = c.id
      WHERE b.cat_id = ?
    `;

    const books = await queryAsync(getBooksByCatQuery, [cat_id]);

    return res.status(200).json({ status: true, books });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_book_by_book_id = async (req, res, next) => {
  try {
    const { book_id } = req.query;

    const getBookByIdQuery = `
      SELECT b.*, c.name AS cat_name
      FROM book b
      INNER JOIN book_cat c ON b.cat_id = c.id
      WHERE b.id = ?
    `;

    const book = await queryAsync(getBookByIdQuery, [book_id]);

    return res.status(200).json({ status: true, book });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_order = async (req, res, next) => {
  try {
    const { user_id, book_id } = req.body;
    const status = "pending";

    const addOrderQuery =
      "INSERT INTO order_book (user_id, book_id, status) VALUES (?, ?, ?)";
    await queryAsync(addOrderQuery, [user_id, book_id, status]);

    return res.status(200).json({
      status: true,
      msg: "Order placed successfully",
      order: {
        user_id,
        book_id,
        status,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.get_order_by_user_id = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const getOrderByUserIdQuery = `
      SELECT o.*, 
             b.name AS book_name, b.author, b.about_author, b.overview, b.price, b.image,
             c.name AS cat_name
      FROM order_book o
      INNER JOIN book b ON o.book_id = b.id
      INNER JOIN book_cat c ON b.cat_id = c.id
      WHERE o.user_id = ?
    `;

    const orders = await queryAsync(getOrderByUserIdQuery, [user_id]);

    return res.status(200).json({ status: true, orders });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
