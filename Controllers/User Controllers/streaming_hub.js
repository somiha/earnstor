const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.addStreamingHub = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.files["image"];

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery = `
      INSERT INTO streaming_hub (image, name)
      VALUES (?, ?)
    `;
    await queryAsync(addQuery, [imageUrl, name]);

    return res.status(200).json({
      status: true,
      message: "Streaming hub added successfully",
      streamingHub: {
        image: imageUrl,
        name,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getStreamingHubs = async (req, res) => {
  try {
    const getQuery = `
      SELECT * FROM streaming_hub
      ORDER BY id DESC
    `;
    const streamingHubs = await queryAsync(getQuery);

    if (streamingHubs.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No streaming hubs found",
        streamingHubs: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Streaming hubs retrieved successfully",
      streamingHubs,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.addStreamingHubLink = async (req, res) => {
  try {
    const { link, s_hub_id } = req.body;
    const image = req.files["image"];

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addLinkQuery = `
      INSERT INTO streaming_hub_link (image, link, s_hub_id) 
      VALUES (?, ?, ?)
    `;

    await queryAsync(addLinkQuery, [imageUrl, link, s_hub_id]);

    return res.status(200).json({
      status: true,
      msg: "Streaming Hub Link added successfully",
      link: { image: imageUrl, link, s_hub_id },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.getStreamingHubLinks = async (req, res) => {
  try {
    const { s_hub_id } = req.query;

    const getLinksQuery = `
      SELECT shl.*, sh.name as streaming_hub_name 
      FROM streaming_hub_link shl
      LEFT JOIN streaming_hub sh ON shl.s_hub_id = sh.id
      WHERE shl.s_hub_id = ?
    `;

    const response = await queryAsync(getLinksQuery, [s_hub_id]);
    console.log("links", ...response[0].image);

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Streaming Hub Links found for the given s_hub_id",
        links: [],
      });
    }

    return res.status(200).json({
      status: true,
      msg: "Streaming Hub Links retrieved successfully",
      response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
