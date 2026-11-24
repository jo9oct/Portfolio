import visitorService from "../service/visitor.service.js";

/**
 * Controller for registering a unique visitor.
 * Endpoint: POST /api/v1/visitors/register
 */
export const handleRegisterVisitor = async (req, res) => {
  try {
    const { visitorId } = req.body;
    const result = await visitorService.registerVisitor(visitorId);

    return res.status(200).json({
      success: true,
      data: {
        totalVisitors: result.totalVisitors,
        isNew: result.isNew,
      },
    });
  } catch (error) {
    console.error("Visitor registration failed:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error ||
      error.message ||
      "Internal visitor service error";

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
};

/**
 * Controller for retrieving total visitor stats.
 * Endpoint: GET /api/v1/visitors/stats
 */
export const handleGetVisitorStats = async (req, res) => {
  try {
    const result = await visitorService.getVisitorStats();

    return res.status(200).json({
      success: true,
      data: {
        totalVisitors: result.totalVisitors,
      },
    });
  } catch (error) {
    console.error("Visitor stats retrieval failed:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error ||
      error.message ||
      "Internal visitor service error";

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
};

export default {
  handleRegisterVisitor,
  handleGetVisitorStats,
};
