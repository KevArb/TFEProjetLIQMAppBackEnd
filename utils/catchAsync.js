// ===> with this function we can get rid of the try catch statement
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
