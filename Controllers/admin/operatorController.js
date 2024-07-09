const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
const fs = require("fs");
const path = require("path");
const baseUrl = process.env.baseUrl;

exports.getOperators = async (req, res, next) => {
  try {
    const operatorQuery = `SELECT * FROM operator`;
    const operators = await queryAsyncWithoutValue(operatorQuery);
    const page = parseInt(req.query.page) || 1;
    const operatorsPerPage = 8;
    const startIdx = (page - 1) * operatorsPerPage;
    const endIdx = startIdx + operatorsPerPage;
    const paginatedOperators = operators.slice(startIdx, endIdx);
    return res.status(200).render("pages/operator", {
      title: "Operators",
      operators,
      paginatedOperators,
      operatorsPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postOperator = async (req, res, next) => {
  try {
    const operatorImage = req.files["operator-image"];
    const name = req.body.name;
    const is_disabled = req.body.is_disabled;
    console.log("operatorImage", operatorImage, req.files, req.file);

    if (operatorImage && operatorImage.length > 0) {
      console.log("here", operatorImage[0].filename);
      const operatorImageUrl = `${baseUrl}/uploads/${operatorImage[0].filename}`;
      const insertOperatorQuery =
        "INSERT INTO operator (name, logo, is_disabled) VALUES (?, ?, ?)";

      console.log("here1");
      await queryAsync(insertOperatorQuery, [
        name,
        operatorImageUrl,
        is_disabled,
      ]);
      return res.redirect("/operators");
    } else {
      return res.status(400).json({ msg: "No operator image uploaded" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateOperator = async (req, res, next) => {
  try {
    const { id, previous_operator_image, edit_name, edit_is_disabled } =
      req.body;
    let splited_image = previous_operator_image.split("/");
    let image_name = splited_image[splited_image.length - 1];

    const imagePath = path.join(__dirname, "../../public/uploads/", image_name);

    const operatorImage = req.files["operator-image"];

    let operatorImageUrl = null;
    if (operatorImage && operatorImage.length > 0) {
      operatorImageUrl = `${baseUrl}/uploads/${operatorImage[0].filename}`;
    }

    const updateOperatorQuery =
      "UPDATE operator SET name = ?, logo = ?, is_disabled = ? WHERE id = ?";
    const operatorValues = [edit_name, operatorImageUrl, edit_is_disabled, id];

    await queryAsync(updateOperatorQuery, [
      edit_name,
      operatorImageUrl,
      edit_is_disabled,
      id,
    ]);

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image:", unlinkErr);
        return res.status(500).json({ msg: "Internal server error" });
      }
    });

    return res.redirect("/operators");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteOperators = async (req, res, next) => {
  try {
    const id = req.query.id;

    const selectOperatorsQuery = `SELECT logo FROM operator WHERE id = ?`;
    const result = await queryAsync(selectOperatorsQuery, [id]);

    if (result.length === 0) {
      return res.status(404).json({ msg: "operators not found" });
    }

    const imageFileName = result[0].logo;
    const parts = imageFileName.split("/");
    const fileNameWithExtension = parts[parts.length - 1];

    const imagePath = path.join(
      __dirname,
      "../../public/uploads/",
      fileNameWithExtension
    );

    const deleteOperatorsQuery = `DELETE FROM operator WHERE id = ?`;
    await queryAsync(deleteOperatorsQuery, [id]);

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image:", unlinkErr);
        return res.status(500).json({ msg: "Internal server error" });
      }
    });

    return res.redirect("/operators");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
