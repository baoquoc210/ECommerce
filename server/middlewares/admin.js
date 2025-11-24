import UserModel from '../models/user.model.js';

const admin = async (request, response, next) => {
  try {
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({
        message: 'Unauthorized',
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select('role');

    if (!user || user.role !== 'ADMIN') {
      return response.status(403).json({
        message: 'Admin access required',
        error: true,
        success: false,
      });
    }

    next();
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default admin;

