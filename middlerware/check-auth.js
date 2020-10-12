const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "knsdfs_DSFASD2@#@swlfsljsaf;#@$#%%&%^&%$^*&^prfsodff");
    next();
  } catch (error) {
    res.status(401);
  }
};
