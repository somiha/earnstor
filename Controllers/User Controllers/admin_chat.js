const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.startChat = async (req, res, next) => {
  try {
    const customerId = req.body.customer_id;

    // Create a new chat entry with admin_id as null
    const chatQuery = `INSERT INTO admin_chat (customer_id, admin_id) VALUES (?, NULL)`;
    const [result] = await db.execute(chatQuery, [customerId]);

    return res.status(200).json({
      status: true,
      message: "Chat started successfully",
      chat_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { chat_id, admin_id, customer_id, message } = req.body;

    // Check if the admin_id is null in the chat
    const checkChatQuery = `SELECT * FROM admin_chat WHERE id = ?`;
    const [chat] = await db.execute(checkChatQuery, [chat_id]);

    if (chat.length === 0) {
      return res.status(404).json({ status: false, message: "Chat not found" });
    }

    if (chat[0].admin_id === null && admin_id) {
      // Update chat with the admin_id and send message
      const updateChatQuery = `UPDATE admin_chat SET admin_id = ? WHERE id = ?`;
      await db.execute(updateChatQuery, [admin_id, chat_id]);
    }

    if (chat[0].admin_id && admin_id && chat[0].admin_id !== admin_id) {
      return res
        .status(403)
        .json({ status: false, message: "You are not authorized" });
    }

    const senderType = admin_id ? "admin" : "customer";

    const sendMessageQuery = `INSERT INTO admin_message (chat_id, message, sender_type) VALUES (?, ?, ?)`;
    await db.execute(sendMessageQuery, [chat_id, message, senderType]);

    return res
      .status(200)
      .json({ status: true, message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.getChatDetails = async (req, res, next) => {
  try {
    const { chat_id } = req.query;

    const getChatQuery = `
      SELECT ac.id as chat_id, ac.created_at as chat_created_at, ac.updated_at as chat_updated_at,
             u.userid as customer_id, u.name as customer_name, u.imageUrl as customer_image,
             a.id as admin_id, a.name as admin_name, a.image as admin_image,
             am.id as message_id, am.message, am.created_at as message_created_at, am.updated_at as message_updated_at
      FROM admin_chat ac
      LEFT JOIN users u ON ac.customer_id = u.userid
      LEFT JOIN admin a ON ac.admin_id = a.id
      LEFT JOIN admin_message am ON ac.id = am.chat_id
      WHERE ac.id = ?
    `;
    const chatDetails = await queryAsync(getChatQuery, [chat_id]);

    if (chatDetails.length === 0) {
      return res.status(404).json({ status: false, message: "Chat not found" });
    }

    return res.status(200).json({
      status: true,
      chat_details: chatDetails,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.getAdminChats = async (req, res, next) => {
  try {
    const { admin_id } = req.query;

    const getChatsQuery = `
SELECT 
    ac.id AS chat_id,
    ac.customer_id,
    ac.admin_id,
    ac.created_at AS chat_created_at,
    ac.updated_at AS chat_updated_at,
    u.name AS customer_name,
    u.imageUrl AS customer_image,
    a.name AS admin_name,
    a.image AS admin_image,
    am.message AS recent_message,
    am.created_at AS recent_message_created_at
FROM admin_chat ac
LEFT JOIN users u ON ac.customer_id = u.userid
LEFT JOIN admin a ON ac.admin_id = a.id
LEFT JOIN (
    SELECT chat_id, message, created_at
    FROM admin_message
    WHERE created_at = (
        SELECT MAX(created_at)
        FROM admin_message
        WHERE chat_id = admin_message.chat_id
    )
) am ON ac.id = am.chat_id
WHERE ac.admin_id = ? OR ac.admin_id IS NULL
ORDER BY ac.created_at DESC;

`;

    const chats = await queryAsync(getChatsQuery, [admin_id]);

    return res.status(200).json({
      status: true,
      chat_list: chats,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.getCustomerChats = async (req, res, next) => {
  try {
    const { customer_id } = req.query;

    const getChatsQuery = `
SELECT 
    ac.id AS chat_id,
    ac.customer_id,
    ac.admin_id,
    ac.created_at AS chat_created_at,
    ac.updated_at AS chat_updated_at,
    u.name AS customer_name,
    u.imageUrl AS customer_image,
    a.name AS admin_name,
    a.image AS admin_image,
    am.message AS recent_message,
    am.created_at AS recent_message_created_at
FROM admin_chat ac
LEFT JOIN users u ON ac.customer_id = u.userid
LEFT JOIN admin a ON ac.admin_id = a.id
LEFT JOIN (
    SELECT chat_id, message, created_at
    FROM admin_message
    WHERE created_at = (
        SELECT MAX(created_at)
        FROM admin_message
        WHERE chat_id = admin_message.chat_id
    )
) am ON ac.id = am.chat_id
WHERE ac.customer_id = ?
ORDER BY ac.created_at DESC;

`;

    const chats = await queryAsync(getChatsQuery, [customer_id]);

    return res.status(200).json({
      status: true,
      chat_list: chats,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
