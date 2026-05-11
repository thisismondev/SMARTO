const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden access',
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
