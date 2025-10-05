const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUserValidation = [
  body("username")
    .isString()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .isString()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("fullName.firstName")
    .isString()
    .notEmpty()
    .withMessage("First name is required"),
  body("fullName.lastName")
    .isString()
    .notEmpty()
    .withMessage("Last name is required"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("addresses")
    .isArray()
    .withMessage("Addresses must be an array")
    .custom((addresses) => {
      if (addresses && addresses.length > 0) {
        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i];
          if (
            !address.street ||
            !address.city ||
            !address.state ||
            !address.zip ||
            !address.country
          ) {
            throw new Error(`Address at index ${i} is missing required fields`);
          }
        }
      }
      return true;
    }),
  body("role").isString().notEmpty().withMessage("Role is required"),
  respondWithValidationErrors,
];

const loginValidation = [
  body("email").optional().isString().withMessage("Email is invalid"),
  body("username").optional().isString().withMessage("Username is invalid"),
  body("password").isString().notEmpty().withMessage("Password is required"),
  respondWithValidationErrors,
];

module.exports = {
  registerUserValidation,
  loginValidation,
};
