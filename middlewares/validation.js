const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) return value;
  return helpers.error("string.uri");
};

module.exports.validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "cold", "warm").required().messages({
      "string.empty": '"weather" is required',
      "any.only": 'Weather must be "hot", "cold", or "warm"',
      "any.required": '"weather" is required',
    }),
  })
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "A valid email is required",
    }),
    password: Joi.string().trim().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  })
});

module.exports.validateLoginInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "A valid email is required",
    }),
    password: Joi.string().trim().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  })
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length": "Invalid item id format",
      "any.required": "Item id is required",
    }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.length": "Invalid user id format",
      "any.required": "User id is required",
    }),
  }),
});
