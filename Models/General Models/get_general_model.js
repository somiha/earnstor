const DB = require("../../Utils/db_connection");
module.exports = class GetGeneralModel {
  static GetGeneralInfos() {
    return DB.execute("SELECT * from general");
  }
};
