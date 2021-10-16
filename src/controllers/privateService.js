export const privateAction = (req, res, next) => {
  res.status(200).json({
    status: 'acces granted'
  });
};
