const Joi = require("joi");

let validateStatus = (result) => {
  if (result.error) {
    throw result.error.details[0].message;
  }
  return result.value;
};

const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (req.body && Object.keys(req.body)?.length) {
        const result = Joi.object(schema.body).validate(req.body);
        req.body = validateStatus(result);
      }
      if (req.query && Object.keys(req.query)?.length) {
        const result = Joi.object(schema.query).validate(req.query);
        req.query = validateStatus(result);
      }
      if (req.params && Object.keys(req.params)?.length) {
        const result = Joi.object(schema.params).validate(req.params);
        req.params = validateStatus(result);
      }
    } catch (message) {
      return res.status(400).json({ message });
    }

    next();
  };
};
module.exports = { validate };
