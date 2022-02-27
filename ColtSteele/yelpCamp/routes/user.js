const express = require("express");
const router = express.Router();
const { validateUserBeforeLogIn } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const {
  register,
  renderLogin,
  login,
  logout,
  renderRegister,
} = require("../controllers/users");

router.route("/register").get(renderRegister).post(catchAsync(register));

router
  .route("/login")
  .get(renderLogin)
  .post(validateUserBeforeLogIn, catchAsync(login));

router.get("/logout", logout);

module.exports = router;
