const adminAuth = async (req, res, next) => {
  const is_logged_in = req.cookies.is_logged_in;
  console.log(req.cookies);

  if (!is_logged_in) {
    return res.redirect("/admin/login");
  }
  try {
    const verified = is_logged_in == "true";
    //console.log(jwt.verify(token,"passwordKey"))
    if (!verified) return res.redirect("/admin/login");

    req.admin_logged_in = true;

    return next();
  } catch (err) {
    return res.status(500).redirect("/admin/login");
  }
};

module.exports = adminAuth;
