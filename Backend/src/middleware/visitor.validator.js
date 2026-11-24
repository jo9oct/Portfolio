/**
 * Middleware to validate visitorId format.
 * Expects a non-empty string between 16 and 128 characters consisting of alphanumeric and - _ chars.
 */
export function validateVisitorId(req, res, next) {
  const { visitorId } = req.body || {};

  if (!visitorId || typeof visitorId !== "string") {
    return res.status(400).json({
      success: false,
      error: "visitorId is required and must be a string",
    });
  }

  const trimmed = visitorId.trim();

  if (trimmed.length < 16 || trimmed.length > 128) {
    return res.status(400).json({
      success: false,
      error: "visitorId length must be between 16 and 128 characters",
    });
  }

  const validRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validRegex.test(trimmed)) {
    return res.status(400).json({
      success: false,
      error: "visitorId contains invalid characters",
    });
  }

  req.body.visitorId = trimmed;
  next();
}

export default validateVisitorId;
