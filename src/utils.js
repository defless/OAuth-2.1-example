export const error = (res, e) =>
  res.status(e.code || 500).json({ error: e.message || e});

export const check = (elmt, name) => {
  if (!elmt) {
    throw {code: 400, message: `missing_${name}`};
  }
};
