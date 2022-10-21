module.exports.error = (err, req, res, next) => {
  const { status = 500, message } = err;

  res.status(status).send({ message: status === 500 ? 'Произошла внутренняя ошибка сервера' : message });

  next();
};
