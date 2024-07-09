const DB = require("../../Utils/db_connection");

module.exports = class PaymentModel {
  static addPayment(mobile_number, transaction_id, operator, amount, user_id) {
    return DB.execute(
      "INSERT INTO payment(mobile_number,transaction_id,operator,amount,user_id) VALUES (?, ?, ?, ?,?)",
      [mobile_number, transaction_id, operator, amount, user_id]
    );
  }

  static getPaymentByUserId(user_id) {
    return DB.execute(
      "SELECT * FROM payment WHERE user_id = '" +
        user_id +
        "' AND payment_status = 'accepted'"
    );
  }
};
