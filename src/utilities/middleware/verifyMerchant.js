export const verifyMerchant = (req, res, next) => {
  if (req.decoded?.role === 'admin' || req.decoded?.accountType === 'merchant') return next();
  return res.status(403).json({ message: 'A merchant account is required for store management' });
};
