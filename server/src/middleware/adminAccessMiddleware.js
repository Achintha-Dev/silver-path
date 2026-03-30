

export const verifyAdminAccess = (req, res, next) => {
  const accessKey = req.headers['x-admin-key'] || req.query.key

  if (!accessKey || accessKey !== process.env.ADMIN_ACCESS_KEY) {
    return res.status(404).json({
      success: false,
      message: 'Page not found'   // deliberately vague — looks like 404
    })
  }

  next()
}