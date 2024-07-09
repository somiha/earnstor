// Imports
const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routes/user_routes");
const videoRoutes = require("./Routes/video_routes");
const generalRoutes = require("./Routes/general_routes");
const adminRoutes = require("./Routes/admin/adminRoute");
const db = require("./Utils/db_connection");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// App Uses
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/uploads", express.static("uploads"));

// Uses of Routes
app.use(userRoutes);
app.use(videoRoutes);
app.use(generalRoutes);
app.use(adminRoutes);

app.set("view engine", "ejs");
app.set("views");

//Starting of server
app.listen(3000, () => {
  console.log("App Running On server 3000");
});
