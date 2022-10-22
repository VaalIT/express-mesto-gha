module.exports.error = (err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({ message });

  next();
};
