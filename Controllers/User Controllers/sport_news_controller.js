const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_sport_news = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const image = req.files["image"]; // Assuming single file upload for the image

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addSportNewsQuery = `
      INSERT INTO sport_news (title, description, image, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    await queryAsync(addSportNewsQuery, [title, description, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Sports news added successfully",
      sport_news: { title, description, image: imageUrl },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_all_sport_news = async (req, res, next) => {
  try {
    const getAllNewsQuery = "SELECT * FROM sport_news ORDER BY created_at DESC";
    let news = await queryAsyncWithoutValue(getAllNewsQuery);

    // Format the created_at field
    news = news.map((item) => {
      return {
        ...item,
        created_at: new Date(item.created_at).toLocaleString(),
        updated_at: new Date(item.updated_at).toLocaleString(),
      };
    });

    return res.status(200).json({ status: true, news });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_sport_news_by_id = async (req, res, next) => {
  try {
    const { id } = req.query;
    const getNewsByIdQuery = "SELECT * FROM sport_news WHERE id = ?";
    const news = await queryAsync(getNewsByIdQuery, [id]);

    if (news.length > 0) {
      const formattedNews = {
        ...news[0],
        created_at: new Date(news[0].created_at).toLocaleString(),
        updated_at: new Date(news[0].updated_at).toLocaleString(),
      };
      return res.status(200).json({ status: true, news: formattedNews });
    } else {
      return res.status(404).json({ status: false, msg: "News not found" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
