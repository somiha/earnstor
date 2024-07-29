const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
const baseUrl = process.env.baseUrl;

exports.addSportCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }
  const insertQuery = "INSERT INTO sport_category (name) VALUES (?)";

  await queryAsync(insertQuery, [name]);
  return res.status(200).json({
    msg: "Sport category added successfully",
  });
};

exports.updateSportCategory = async (req, res) => {
  const { id, name } = req.body;

  if (!name || !id) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const fetchQuery = "SELECT * FROM sport_category WHERE id = ?";
  const existingCategory = await queryAsync(fetchQuery, [id]);
  if (!existingCategory[0]) {
    return res.status(404).json({
      error: "Sport category not found",
    });
  }

  const updateQuery = "UPDATE sport_category SET name = ? WHERE id = ?";
  await queryAsync(updateQuery, [name, id]);
  return res.status(200).json({
    msg: "Sport category updated successfully",
  });
};

exports.deleteSportCategory = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const fetchQuery = "SELECT * FROM sport_category WHERE id = ?";
  const existingCategory = await queryAsync(fetchQuery, [id]);
  if (!existingCategory[0]) {
    return res.status(404).json({
      error: "Sport category not found",
    });
  }

  const deleteQuery = "DELETE FROM sport_category WHERE id = ?";
  await queryAsync(deleteQuery, [id]);
  return res.status(200).json({
    msg: "Sport category deleted successfully",
  });
};

exports.getAllSportCategory = async (req, res) => {
  const fetchQuery = "SELECT * FROM sport_category";
  const result = await queryAsyncWithoutValue(fetchQuery);
  return res.status(200).json(result);
};

exports.addTeam = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const iamge = req.files["image"];
  let imageUrl = null;
  if (iamge && iamge[0]) {
    imageUrl = `${baseUrl}/uploads/${iamge[0].filename}`;
  }
  const insertQuery = "INSERT INTO team (name, image) VALUES (?, ?)";
  await queryAsync(insertQuery, [name, imageUrl]);
  return res.status(200).json({
    msg: "Team added successfully",
  });
};

exports.updateTeam = async (req, res) => {
  const { id, name } = req.body;
  if (!name || !id) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }
  const fetchQuery = "SELECT * FROM team WHERE id = ?";
  const existingTeam = await queryAsync(fetchQuery, [id]);
  if (!existingTeam[0]) {
    return res.status(404).json({
      error: "Team not found",
    });
  }

  const iamge = req.files["image"];
  let imageUrl = existingTeam[0].image ?? null;
  if (iamge && iamge[0]) {
    imageUrl = `${baseUrl}/uploads/${iamge[0].filename}`;
  }
  const updateQuery = "UPDATE team SET name = ? WHERE id = ?";
  await queryAsync(updateQuery, [name, id]);
  return res.status(200).json({
    msg: "Team updated successfully",
  });
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }
  const fetchQuery = "SELECT * FROM team WHERE id = ?";
  const existingTeam = await queryAsync(fetchQuery, [id]);
  if (!existingTeam[0]) {
    return res.status(404).json({
      error: "Team not found",
    });
  }
  const deleteQuery = "DELETE FROM team WHERE id = ?";
  await queryAsync(deleteQuery, [id]);
  return res.status(200).json({
    msg: "Team deleted successfully",
  });
};

exports.getTeam = async (req, res) => {
  const fetchQuery = "SELECT * FROM team";
  const result = await queryAsyncWithoutValue(fetchQuery);
  return res.status(200).json(result);
};

exports.addSportUpdate = async (req, res) => {
  const { title, description, cat_id, team1_id, team2_id, datetime } = req.body;
  console.log(
    req.body,
    title,
    description,
    cat_id,
    team1_id,
    team2_id,
    datetime
  );

  if (!title || !cat_id || !team1_id || !team2_id || !datetime) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const fetchQuery = "SELECT * FROM sport_category WHERE id = ?";
  const existingCategory = await queryAsync(fetchQuery, [cat_id]);
  if (!existingCategory[0]) {
    return res.status(404).json({
      error: "Sport category not found",
    });
  }

  const fetchQuery2 = "SELECT * FROM team WHERE id = ?";
  const existingTeam1 = await queryAsync(fetchQuery2, [team1_id]);
  if (!existingTeam1[0]) {
    return res.status(404).json({
      error: "Team 1 not found",
    });
  }

  const fetchQuery3 = "SELECT * FROM team WHERE id = ?";
  const existingTeam2 = await queryAsync(fetchQuery3, [team2_id]);
  if (!existingTeam2[0]) {
    return res.status(404).json({
      error: "Team 2 not found",
    });
  }

  const insertQuery =
    "INSERT INTO sport_update (title, description, cat_id, team1_id, team2_id, datetime) VALUES (?, ?, ?, ?, ?, ?)";
  await queryAsync(insertQuery, [
    title,
    description,
    cat_id,
    team1_id,
    team2_id,
    datetime,
  ]);
  return res.status(200).json({
    msg: "Sport update added successfully",
  });
};

exports.getAllSportUpdates = async (req, res) => {
  const fetchQuery = `SELECT 
    su.*, 
JSON_OBJECT(
    'id', sc.id,
    'name', sc.name
) AS category,
    JSON_OBJECT(
        'id', team1.id,
        'name', team1.name,
        'image', team1.image
    ) AS team1,
    JSON_OBJECT(
        'id', team2.id,
        'name', team2.name,
        'image', team2.image
    ) AS team2

FROM sport_update su
INNER JOIN sport_category sc ON su.cat_id = sc.id
LEFT JOIN team team1 ON su.team1_id = team1.id
LEFT JOIN team team2 ON su.team2_id = team2.id;
`;
  const result = await queryAsyncWithoutValue(fetchQuery);
  return res.status(200).json(result);
};

// exports.getAllSportUpdates = async (req, res) => {
//   try {
//     const fetchQuery = `
//       SELECT
//         su.*,
//         JSON_OBJECT(
//           'id', sc.id,
//           'name', sc.name
//         ) AS category,
//         JSON_OBJECT(
//           'id', team1.id,
//           'name', team1.name,
//           'image', team1.image
//         ) AS team1,
//         JSON_OBJECT(
//           'id', team2.id,
//           'name', team2.name,
//           'image', team2.image
//         ) AS team2
//       FROM sport_update su
//       INNER JOIN sport_category sc ON su.cat_id = sc.id
//       LEFT JOIN team team1 ON su.team1_id = team1.id
//       LEFT JOIN team team2 ON su.team2_id = team2.id;
//     `;

//     const result = await queryAsyncWithoutValue(fetchQuery);

//     // Ensure the result is parsed correctly
//     const formattedResult = result.map((row) => ({
//       ...row,
//       category: JSON.parse(row.category),
//       team1: JSON.parse(row.team1),
//       team2: JSON.parse(row.team2),
//     }));

//     return res.status(200).json({
//       status: true,
//       posts: formattedResult,
//     });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };
