const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
const fs = require("fs");
const path = require("path");
const baseUrl = process.env.baseUrl;

exports.getBanners = async (req, res, next) => {
  try {
    const bannerQuery = `SELECT * FROM banner`;
    const banners = await queryAsyncWithoutValue(bannerQuery);
    const page = parseInt(req.query.page) || 1;
    const bannersPerPage = 8;
    const startIdx = (page - 1) * bannersPerPage;
    const endIdx = startIdx + bannersPerPage;
    const paginatedBanners = banners.slice(startIdx, endIdx);
    return res.status(200).render("pages/banner", {
      title: "Banners",
      banners,
      paginatedBanners,
      bannersPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postBanner = async (req, res, next) => {
  try {
    const bannerImage = req.files["banner-image"];
    console.log("bannerImage", bannerImage, req.files, req.file);

    if (bannerImage && bannerImage.length > 0) {
      console.log("here", bannerImage[0].filename);
      const bannerImageUrl = `${baseUrl}/uploads/${bannerImage[0].filename}`;
      const insertBannerQuery =
        "INSERT INTO banner (banner_image_url) VALUES (?)";
      const bannerValues = [bannerImageUrl];

      console.log("here1");
      await queryAsync(insertBannerQuery, [bannerValues]);
      return res.redirect("/banners");
    } else {
      return res.status(400).json({ msg: "No banner image uploaded" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const { id, previous_banner_image } = req.body;
    let splited_image = previous_banner_image.split("/");
    let image_name = splited_image[splited_image.length - 1];

    const imagePath = path.join(__dirname, "../../public/uploads/", image_name);

    const bannerImage = req.files["banner-image"];

    let bannerImageUrl = null;
    if (bannerImage && bannerImage.length > 0) {
      bannerImageUrl = `${baseUrl}/uploads/${bannerImage[0].filename}`;
    }

    const updateBannerQuery =
      "UPDATE banner SET banner_image_url = ? WHERE id = ?";
    const bannerValues = [bannerImageUrl, id];

    await queryAsync(updateBannerQuery, [bannerImageUrl, id]);

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image:", unlinkErr);
        return res.status(500).json({ msg: "Internal server error" });
      }
    });

    return res.redirect("/banners");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteBanners = async (req, res, next) => {
  try {
    const id = req.query.id;

    const selectBannersQuery = `SELECT banner_image_url FROM banner WHERE id = ?`;
    const result = await queryAsync(selectBannersQuery, [id]);

    if (result.length === 0) {
      return res.status(404).json({ msg: "banners not found" });
    }

    const imageFileName = result[0].banner_image_url;
    const parts = imageFileName.split("/");
    const fileNameWithExtension = parts[parts.length - 1];

    const imagePath = path.join(
      __dirname,
      "../../public/uploads/",
      fileNameWithExtension
    );

    const deleteBannersQuery = `DELETE FROM banner WHERE id = ?`;
    await queryAsync(deleteBannersQuery, [id]);

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image:", unlinkErr);
        return res.status(500).json({ msg: "Internal server error" });
      }
    });

    return res.redirect("/banners");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
