const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

// exports.add_conversation = async (req, res, next) => {
//   try {
//     const { member1, member2 } = req.body;

//     const addQuery =
//       "INSERT INTO conversation (member1, member2) VALUES (?, ?)";
//     await queryAsync(addQuery, [member1, member2]);

//     return res.status(200).json({
//       status: true,
//       msg: "conversation added successfully",
//       conversation: {
//         member1,
//         member2,
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };

exports.add_conversation = async (req, res, next) => {
  try {
    const { member1, member2 } = req.body;

    // Check if a conversation already exists between the two members
    const checkQuery = `
      SELECT id FROM conversation 
      WHERE (member1 = ? AND member2 = ?) 
      OR (member1 = ? AND member2 = ?)
    `;
    const existingConv = await queryAsync(checkQuery, [
      member1,
      member2,
      member2,
      member1,
    ]);

    if (existingConv.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Conversation already exists",
        conversation: existingConv[0],
      });
    }

    const addQuery =
      "INSERT INTO conversation (member1, member2) VALUES (?, ?)";
    const result = await queryAsync(addQuery, [member1, member2]);

    return res.status(200).json({
      status: true,
      msg: "Conversation added successfully",
      conversation: {
        id: result.insertId,
        member1,
        member2,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_message = async (req, res, next) => {
  try {
    const { conv_id, from_id, to_id, message } = req.body;

    let newConvId = conv_id;

    if (!conv_id) {
      // Check if a conversation between the two users already exists
      const checkExistingConvQuery =
        "SELECT id FROM conversation WHERE (member1 = ? AND member2 = ?) OR (member1 = ? AND member2 = ?)";
      const existingConv = await queryAsync(checkExistingConvQuery, [
        from_id,
        to_id,
        to_id,
        from_id,
      ]);

      if (existingConv.length) {
        newConvId = existingConv[0].id;
      } else {
        // Create a new conversation if it doesn't exist
        const addConvQuery =
          "INSERT INTO conversation (member1, member2) VALUES (?, ?)";
        const result = await queryAsync(addConvQuery, [from_id, to_id]);
        newConvId = result.insertId;
      }
    } else {
      // Check if the conversation ID provided exists and validate the members
      const checkQuery =
        "SELECT * FROM conversation WHERE id = ? AND ((member1 = ? AND member2 = ?) OR (member1 = ? AND member2 = ?))";
      const conversation = await queryAsync(checkQuery, [
        conv_id,
        from_id,
        to_id,
        to_id,
        from_id,
      ]);

      if (!conversation.length) {
        return res.status(400).json({
          status: false,
          msg: "Invalid conversation ID or members do not match",
        });
      }
    }

    // Add the message to the conversation
    const addMessageQuery =
      "INSERT INTO message (conv_id, from_id, message) VALUES (?, ?, ?)";
    await queryAsync(addMessageQuery, [newConvId, from_id, message]);

    return res.status(200).json({
      status: true,
      msg: "Message added successfully",
      message: {
        conv_id: newConvId,
        from_id,
        to_id,
        message,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// exports.get_conversation_member = async (req, res, next) => {
//   try {
//     const { from } = req.query;

//     const getQuery = `
//       SELECT d.*,
//      u1.name AS member1_name,
//        u2.name AS member2_name
// FROM conversation d
// INNER JOIN users u1 ON d.member1 = u1.userid
// INNER JOIN users u2 ON d.member2 = u2.userid
// WHERE d.member1 = ? OR d.member2 = ?
//     `;

//     const member = await queryAsync(getQuery, [from, from]);

//     return res.status(200).json({ status: true, member });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };

exports.get_conversation_member = async (req, res, next) => {
  try {
    const { from } = req.query;

    const getQuery = `
      SELECT d.*, 
             u1.name AS member1_name,
             u1.imageUrl AS member1_image,
             u2.name AS member2_name,
             u2.imageUrl AS member2_image,
             m.message AS recent_message,
             DATE_FORMAT(m.created_at, '%l:%i %p %d %b %Y') AS recent_message_time
      FROM conversation d
      INNER JOIN users u1 ON d.member1 = u1.userid
      INNER JOIN users u2 ON d.member2 = u2.userid
      LEFT JOIN (
          SELECT message, created_at, conv_id
          FROM message
          WHERE id IN (
              SELECT MAX(id)
              FROM message
              GROUP BY conv_id
          )
      ) m ON m.conv_id = d.id
      WHERE d.member1 = ? OR d.member2 = ?
    `;

    const member = await queryAsync(getQuery, [from, from]);

    return res.status(200).json({ status: true, member });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_messages = async (req, res, next) => {
  try {
    const { conv_id, page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const fetchMessagesQuery = `
      SELECT m.*, 
              u1.name AS from_user_name,
              u1.imageUrl AS member1_image,
              u2.imageUrl AS member2_image,
             u2.userid AS to_id, u2.name AS to_user_name
      FROM message m
      INNER JOIN users u1 ON m.from_id = u1.userid
      INNER JOIN conversation c ON m.conv_id = c.id
      INNER JOIN users u2 ON (c.member1 = u2.userid OR c.member2 = u2.userid) AND u2.userid <> u1.userid
      WHERE m.conv_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const messages = await queryAsync(fetchMessagesQuery, [
      conv_id,
      parseInt(limit),
      parseInt(offset),
    ]);

    const countQuery =
      "SELECT COUNT(*) AS total FROM message WHERE conv_id = ?";
    const countResult = await queryAsync(countQuery, [conv_id]);
    const totalMessages = countResult[0].total;

    return res.status(200).json({
      status: true,
      msg: "Messages fetched successfully",
      data: {
        messages,
        pagination: {
          total: totalMessages,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalMessages / limit),
        },
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_group_conversation = async (req, res, next) => {
  try {
    let { name, members } = req.body;

    // Log the incoming request body for debugging
    console.log("Request Body:", req.body);

    // Ensure members is parsed as an array if it's a string
    if (typeof members === "string") {
      try {
        members = JSON.parse(members);
      } catch (error) {
        return res.status(400).json({
          status: false,
          msg: "Invalid members format: Unable to parse members",
        });
      }
    }

    // Validate the input
    if (typeof name !== "string" || !Array.isArray(members)) {
      return res.status(400).json({
        status: false,
        msg: "Invalid input: 'name' must be a string and 'members' must be an array",
      });
    }

    // Ensure that members array contains integers
    const memberIds = members.map((member) => parseInt(member, 10));

    // Validate if all members are integers
    if (memberIds.some(isNaN)) {
      return res.status(400).json({
        status: false,
        msg: "Invalid members array: All members must be integers",
      });
    }

    // Check if all members exist in the users table
    const memberCheckQuery = `SELECT userid FROM users WHERE userid IN (?)`;
    const membersExist = await queryAsync(memberCheckQuery, [memberIds]);

    if (membersExist.length !== memberIds.length) {
      return res.status(400).json({
        status: false,
        msg: "Some members do not exist in the users table",
      });
    }

    // Add the group conversation
    const addConvQuery = `
      INSERT INTO group_conversation (is_group, name) VALUES (1, ?)
    `;
    const result = await queryAsync(addConvQuery, [name]);
    const convId = result.insertId;

    // Add members to the group conversation
    const addMembersQuery = `
      INSERT INTO group_conversation_member (grp_conv_id, user_id) VALUES (?, ?)
    `;
    for (const member of memberIds) {
      await queryAsync(addMembersQuery, [convId, member]);
    }

    return res.status(200).json({
      status: true,
      msg: "Group conversation added successfully",
      conversation: {
        grp_conv_id: convId,
        name,
        members: memberIds,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// exports.add_group_message = async (req, res, next) => {
//   try {
//     const { grp_conv_id, from_id, message } = req.body;

//     // Check if the group conversation exists
//     const checkQuery =
//       "SELECT * FROM group_conversation WHERE id = ? AND is_group = 1";
//     const conversation = await queryAsync(checkQuery, [grp_conv_id]);

//     if (!conversation.length) {
//       return res
//         .status(400)
//         .json({ status: false, msg: "Invalid group conversation ID" });
//     }

//     // Check if the sender is a member of the group
//     const memberCheckQuery =
//       "SELECT user_id FROM group_conversation_member WHERE grp_conv_id = ? AND user_id = ?";
//     const memberCheck = await queryAsync(memberCheckQuery, [
//       grp_conv_id,
//       from_id,
//     ]);

//     if (memberCheck.length === 0) {
//       return res.status(403).json({
//         status: false,
//         msg: "User is not a member of this group conversation",
//       });
//     }

//     // Fetch all members of the group
//     const membersQuery =
//       "SELECT user_id FROM group_conversation_member WHERE grp_conv_id = ?";
//     const members = await queryAsync(membersQuery, [grp_conv_id]);

//     // Insert the message for each member except the sender
//     const addMessageQuery = `
//       INSERT INTO message (grp_conv_id, from_id, to_id, message) VALUES (?, ?, ?, ?)
//     `;

//     // Use a transaction to ensure atomicity
//     const connection = await db.getConnection();
//     await connection.beginTransaction();

//     try {
//       for (const member of members) {
//         if (member.user_id !== from_id) {
//           await connection.query(addMessageQuery, [
//             grp_conv_id,
//             from_id,
//             member.user_id,
//             message,
//           ]);
//         }
//       }

//       await connection.commit();
//     } catch (err) {
//       await connection.rollback();
//       throw err;
//     } finally {
//       connection.release();
//     }

//     return res.status(200).json({
//       status: true,
//       msg: "Message added successfully",
//       message: {
//         grp_conv_id,
//         from_id,
//         message,
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };

exports.add_group_message = async (req, res, next) => {
  try {
    const { grp_conv_id, from_id, message } = req.body;

    // Check if the group conversation exists
    const checkQuery =
      "SELECT * FROM group_conversation WHERE id = ? AND is_group = 1";
    const conversation = await queryAsync(checkQuery, [grp_conv_id]);

    if (!conversation.length) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid group conversation ID" });
    }

    // Check if the sender is a member of the group
    const memberCheckQuery =
      "SELECT user_id FROM group_conversation_member WHERE grp_conv_id = ? AND user_id = ?";
    const memberCheck = await queryAsync(memberCheckQuery, [
      grp_conv_id,
      from_id,
    ]);

    if (memberCheck.length === 0) {
      return res.status(403).json({
        status: false,
        msg: "User is not a member of this group conversation",
      });
    }

    // Fetch all members of the group excluding the sender
    const membersQuery = `
      SELECT user_id FROM group_conversation_member 
      WHERE grp_conv_id = ? AND user_id <> ?
    `;
    const members = await queryAsync(membersQuery, [grp_conv_id, from_id]);

    // Insert the message for each member
    const addMessageQuery = `
      INSERT INTO message (grp_conv_id, from_id, message) VALUES (?, ?, ?)
    `;

    // Use a transaction to ensure atomicity
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      for (const member of members) {
        await connection.query(addMessageQuery, [
          grp_conv_id,
          from_id,
          member.user_id,
          message,
        ]);
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    return res.status(200).json({
      status: true,
      msg: "Message added successfully",
      message: {
        grp_conv_id,
        from_id,
        message,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// exports.get_group_messages = async (req, res, next) => {
//   try {
//     const { grp_conv_id, page = 1, limit = 20 } = req.query;

//     const offset = (page - 1) * limit;

//     const fetchMessagesQuery = `
//       SELECT m.*,
//              u1.userid AS from_user_id, u1.name AS from_user_name
//       FROM message m
//       INNER JOIN users u1 ON m.from_id = u1.userid
//       WHERE m.grp_conv_id = ?
//       ORDER BY m.created_at DESC
//       LIMIT ? OFFSET ?
//     `;
//     const messages = await queryAsync(fetchMessagesQuery, [
//       grp_conv_id,
//       parseInt(limit),
//       parseInt(offset),
//     ]);

//     const countQuery =
//       "SELECT COUNT(*) AS total FROM message WHERE grp_conv_id = ?";
//     const countResult = await queryAsync(countQuery, [grp_conv_id]);
//     const totalMessages = countResult[0].total;

//     return res.status(200).json({
//       status: true,
//       msg: "Messages fetched successfully",
//       data: {
//         messages,
//         pagination: {
//           total: totalMessages,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(totalMessages / limit),
//         },
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };

exports.get_group_messages = async (req, res, next) => {
  try {
    const { grp_conv_id, page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    // Fetch messages for the given group conversation ID
    const fetchMessagesQuery = `
      SELECT m.*, 
             u1.userid AS from_user_id, u1.name AS from_user_name
      FROM message m
      INNER JOIN users u1 ON m.from_id = u1.userid
      WHERE m.grp_conv_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const messages = await queryAsync(fetchMessagesQuery, [
      grp_conv_id,
      parseInt(limit),
      parseInt(offset),
    ]);

    // Fetch the members of the group conversation
    const fetchMembersQuery = `
      SELECT u.userid, u.name 
      FROM group_conversation_member gcm
      INNER JOIN users u ON gcm.user_id = u.userid
      WHERE gcm.grp_conv_id = ?
    `;
    const membersResult = await queryAsync(fetchMembersQuery, [grp_conv_id]);

    // Create a map of user IDs to user details
    const membersMap = membersResult.reduce((map, member) => {
      map[member.userid] = member;
      return map;
    }, {});

    // Iterate over messages and assign correct to_id and to_user_name
    const enrichedMessages = messages.map((message) => {
      const toUsers = membersResult
        .filter((member) => member.userid !== message.from_user_id)
        .map((member) => ({
          to_id: member.userid,
          to_user_name: member.name,
        }));
      return {
        ...message,
        to_users: toUsers,
      };
    });

    const countQuery =
      "SELECT COUNT(*) AS total FROM message WHERE grp_conv_id = ?";
    const countResult = await queryAsync(countQuery, [grp_conv_id]);
    const totalMessages = countResult[0].total;

    return res.status(200).json({
      status: true,
      msg: "Messages fetched successfully",
      data: {
        messages: enrichedMessages,
        pagination: {
          total: totalMessages,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalMessages / limit),
        },
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_group_conversation = async (req, res, next) => {
  try {
    const { grp_conv_id } = req.query;

    if (!grp_conv_id) {
      return res.status(400).json({
        status: false,
        msg: "Missing group conversation ID",
      });
    }

    // Fetch the group conversation details
    const fetchGroupQuery = `
      SELECT * 
      FROM group_conversation 
      WHERE id = ? AND is_group = 1
    `;
    const groupResult = await queryAsync(fetchGroupQuery, [grp_conv_id]);

    if (groupResult.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "Group conversation not found",
      });
    }

    const groupConversation = groupResult[0];

    // Fetch the members of the group conversation along with their names
    const fetchMembersQuery = `
      SELECT u.userid AS id, u.name
      FROM group_conversation_member gcm
      INNER JOIN users u ON gcm.user_id = u.userid
      WHERE gcm.grp_conv_id = ?
    `;
    const membersResult = await queryAsync(fetchMembersQuery, [grp_conv_id]);

    return res.status(200).json({
      status: true,
      msg: "Group conversation fetched successfully",
      conversation: {
        grp_conv_id: groupConversation.id,
        name: groupConversation.name,
        members: membersResult,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_groups_by_user = async (req, res, next) => {
  try {
    const { from_id } = req.query;

    if (!from_id) {
      return res.status(400).json({
        status: false,
        msg: "Missing user ID",
      });
    }

    // Fetch all group conversations that the user is a member of
    const fetchGroupsQuery = `
      SELECT gc.id AS grp_conv_id, 
             gc.name, 
             (SELECT message 
              FROM message 
              WHERE grp_conv_id = gc.id 
              ORDER BY created_at DESC 
              LIMIT 1) AS recent_message,
             (SELECT DATE_FORMAT(created_at, '%l:%i %p %d %b %Y') 
              FROM message 
              WHERE grp_conv_id = gc.id 
              ORDER BY created_at DESC 
              LIMIT 1) AS recent_message_time
      FROM group_conversation_member gcm
      INNER JOIN group_conversation gc ON gcm.grp_conv_id = gc.id
      WHERE gcm.user_id = ?
    `;

    const groups = await queryAsync(fetchGroupsQuery, [from_id]);

    if (groups.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No group conversations found for the user",
      });
    }

    return res.status(200).json({
      status: true,
      msg: "Group conversations fetched successfully",
      groups,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
