







export const allowAdminOnly = (req, res, next) => {
  if (req.decoded?.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
