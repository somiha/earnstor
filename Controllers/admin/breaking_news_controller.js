const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getBreakingNews = async (req, res, next) => {
  try {
    const userQuery = `SELECT * FROM general`;

    const breaking_news = await queryAsyncWithoutValue(userQuery);

    const page = parseInt(req.query.page) || 1;
    const breakingNewsPerPage = 8;
    const startIdx = (page - 1) * breakingNewsPerPage;
    const endIdx = startIdx + breakingNewsPerPage;
    const paginatedBreakingNews = breaking_news.slice(startIdx, endIdx);
    // console.log(paginatedBreakingNews);
    return res.status(200).render("pages/breakingNews", {
      title: "All breaking_news",
      breaking_news,
      paginatedBreakingNews,
      breakingNewsPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.updateBreakingNews = async (req, res) => {
  try {
    const { id, headline } = req.body;

    console.log(req.body);

    const updateQuery = "UPDATE general SET headline = ? WHERE id = ?";
    await queryAsync(updateQuery, [headline, id]);

    res.redirect("/breaking-news");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
