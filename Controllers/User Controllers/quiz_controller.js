const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.add_quiz = async (req, res, next) => {
  try {
    const {
      date,
      question,
      option1,
      option2,
      option3,
      option4,
      option5,
      answer,
      points,
    } = req.body;

    const addQuery = `
      INSERT INTO quiz (date, question, option1, option2, option3, option4, option5, answer, points) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await queryAsync(addQuery, [
      date,
      question,
      option1,
      option2,
      option3,
      option4,
      option5,
      answer,
      points,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Quiz added successfully",
      quiz: {
        date,
        question,
        option1,
        option2,
        option3,
        option4,
        option5,
        answer,
        points,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_quiz = async (req, res, next) => {
  try {
    const todayDate = new Date().toISOString().slice(0, 10);

    // Check if a quiz exists for today
    const getTodayQuizQuery = `SELECT * FROM quiz WHERE date = ?`;
    const todayQuiz = await queryAsync(getTodayQuizQuery, [todayDate]);

    if (todayQuiz.length > 0) {
      return res.status(200).json({ status: true, quiz: todayQuiz[0] });
    }

    // If no quiz exists for today, get a random quiz
    const getRandomQuizQuery = `SELECT * FROM quiz ORDER BY RAND() LIMIT 1`;
    const randomQuiz = await queryAsync(getRandomQuizQuery);

    return res.status(200).json({ status: true, quiz: randomQuiz[0] });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.update_quiz = async (req, res, next) => {
  try {
    const {
      id,
      date,
      question,
      option1,
      option2,
      option3,
      option4,
      option5,
      answer,
    } = req.body;

    const updateQuery = `
      UPDATE quiz 
      SET date = ?, question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, option5 = ?, answer = ? 
      WHERE id = ?
    `;
    await queryAsync(updateQuery, [
      date,
      question,
      option1,
      option2,
      option3,
      option4,
      option5,
      answer,
      id,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Quiz updated successfully",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_quiz = async (req, res, next) => {
  try {
    const { id } = req.body;

    const deleteQuery = `DELETE FROM quiz WHERE id = ?`;
    await queryAsync(deleteQuery, [id]);

    return res.status(200).json({
      status: true,
      msg: "Quiz deleted successfully",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    console.log(1);
    const { user_id, quiz_id, answer } = req.body;

    // Get the correct answer and points for the quiz
    const getQuizQuery = "SELECT answer, points FROM quiz WHERE id = ?";
    const [quiz] = await queryAsync(getQuizQuery, [quiz_id]);

    if (!quiz) {
      return res.status(404).json({
        status: false,
        msg: "Quiz not found",
      });
    }

    // Check if the submitted answer is correct
    const isCorrect = quiz.answer == answer;

    // Insert submission into quiz_submit table
    const submitQuizQuery =
      "INSERT INTO quiz_submit (user_id, quiz_id, answer) VALUES (?, ?, ?)";
    await queryAsync(submitQuizQuery, [user_id, quiz_id, answer]);

    if (isCorrect) {
      // If correct, update the user's points in the users table
      const updateUserPointsQuery =
        "UPDATE users SET point = point + ? WHERE userid = ?";
      await queryAsync(updateUserPointsQuery, [quiz.points, user_id]);

      return res.status(200).json({
        status: true,
        msg: "Answer is correct! Points added.",
        pointsAdded: quiz.points,
      });
    } else {
      return res.status(200).json({
        status: true,
        msg: "Answer is incorrect.",
      });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
