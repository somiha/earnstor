const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_post = async (req, res, next) => {
  try {
    const { text } = req.body;
    const image = req.files["image"];
    const video = req.files["video"];

    let imageUrl = null;
    let videoUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }
    if (video) {
      videoUrl = `${baseUrl}/uploads/${video[0].filename}`;
    }

    const addQuery =
      "INSERT INTO social_media (image, video, text) VALUES (?, ?, ?)";
    await queryAsync(addQuery, [imageUrl, videoUrl, text]);

    return res.status(200).json({
      status: true,
      msg: "Post added successfully",
      Post: {
        image: imageUrl,
        video: videoUrl,
        text,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_post = async (req, res, next) => {
  try {
    const query = "SELECT * FROM social_media";
    const posts = await queryAsyncWithoutValue(query);

    return res.status(200).json({
      status: true,
      posts,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_comment = async (req, res, next) => {
  try {
    const { post_id, user_id, text } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery =
      "INSERT INTO comment (post_id, user_id, text, image) VALUES (?, ?, ?, ?)";
    await queryAsync(addQuery, [post_id, user_id, text, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Comment added successfully",
      Comment: {
        image: imageUrl,
        text,
        post_id,
        user_id,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_like = async (req, res, next) => {
  try {
    const { post_id, user_id } = req.body;

    const addQuery =
      "INSERT INTO social_media_like (post_id, user_id) VALUES (?, ?)";
    await queryAsync(addQuery, [post_id, user_id]);

    return res.status(200).json({
      status: true,
      msg: "Like added successfully",
      like: {
        post_id,
        user_id,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_comments_by_user_id = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const query =
      "SELECT comment.*, users.name FROM comment JOIN users ON comment.user_id = users.userid WHERE comment.user_id = ?";
    const comments = await queryAsync(query, [user_id]);

    return res.status(200).json({
      status: true,
      comments,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_likes_by_user_id = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const query =
      "SELECT social_media_like.*, users.name FROM social_media_like JOIN users ON social_media_like.user_id = users.userid WHERE social_media_like.user_id = ?";
    const likes = await queryAsync(query, [user_id]);

    return res.status(200).json({
      status: true,
      likes,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_comments_by_post_id = async (req, res, next) => {
  try {
    const { post_id } = req.query;

    const query =
      "SELECT comment.*, users.name FROM comment JOIN users ON comment.user_id = users.userid WHERE comment.post_id = ?";
    const comments = await queryAsync(query, [post_id]);

    return res.status(200).json({
      status: true,
      comments,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_likes_by_post_id = async (req, res, next) => {
  try {
    const { post_id } = req.query;

    const query =
      "SELECT social_media_like.*, users.name FROM social_media_like JOIN users ON social_media_like.user_id = users.userid WHERE social_media_like.post_id = ?";
    const likes = await queryAsync(query, [post_id]);

    return res.status(200).json({
      status: true,
      likes,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_post = async (req, res, next) => {
  try {
    const { post_id } = req.query;

    const deleteQuery = "DELETE FROM social_media WHERE id = ?";
    const result = await queryAsync(deleteQuery, [post_id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Post deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Post not found",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    const { comment_id } = req.query;

    const deleteQuery = "DELETE FROM comment WHERE id = ?";
    const result = await queryAsync(deleteQuery, [comment_id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Comment deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Comment not found",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.delete_like = async (req, res, next) => {
  try {
    const { post_id, user_id } = req.body;

    const deleteQuery =
      "DELETE FROM social_media_like WHERE post_id = ? AND user_id = ?";
    const result = await queryAsync(deleteQuery, [post_id, user_id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Like deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Like not found",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
