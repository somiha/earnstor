const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.add_payment_instruction = async (req, res, next) => {
  try {
    let payment_instruction = req.body.payment_instruction;

    const addPaymentInstructionQuery = `INSERT INTO payment_instruction(payment_instruction) VALUES (?)`;
    await queryAsync(addPaymentInstructionQuery, [payment_instruction]);
    const getPaymentInstructionQuery = `SELECT * FROM payment_instruction`;
    const paymentInstruction = await queryAsyncWithoutValue(
      getPaymentInstructionQuery
    );
    return res.status(200).json({
      msg: "Payment Instruction added successfully",
      paymentInstruction,
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.get_payment_instruction = async (req, res, next) => {
  try {
    const getPaymentInstructionQuery = `SELECT * FROM payment_instruction`;
    const paymentInstruction = await queryAsyncWithoutValue(
      getPaymentInstructionQuery
    );

    return res.status(200).json({ paymentInstruction });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
