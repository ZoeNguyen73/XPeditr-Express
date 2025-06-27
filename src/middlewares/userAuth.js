const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
const QuestModel = require("../models/questModel");

const { unauthorized, notFound, forbidden, badRequest } = require("../utils/errorHelpers");

const userAuth = {
  isOptionalAuthenticated: async (req, res, next) => {
    if (!req.header("Authorization")) {
      req.authUser = "guest";
      return next();
    } else {
      return userAuth.isAuthenticated(req, res, next);
    }
  },

  isAuthenticated: async (req, res, next) => {
    try {

      const authHeader = req.header("Authorization");

      if (!authHeader) throw unauthorized("Authentication header missing");

      if (!authHeader.toLowerCase().startsWith("bearer ")) throw unauthorized("Invalid Authentication type");

      const token = authHeader.slice(7);
      if (token.length === 0) throw unauthorized("Invalid Authentication token");

      const verified = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
      if (!verified) throw unauthorized("Invalid Authentication token");

      const user = await UserModel.findById(verified.data.id);
      if (!user) throw notFound("User not found");

      req.authUser = user;
      req.authUserId = verified.data.id;
      return next();

    } catch (error) {
      next(error);
    }
  },

  isAuthorized: (...allowedRoles) => {
    return async (req, res, next) => {
      try {
        if (!req.authUser || !Array.isArray(req.authUser.roles)) {
          throw forbidden("User roles not found");
        }

        const { username, roles } = req.authUser;

        // if user has authorized role, then can skip further authorization check
        for (const role of roles) {
          if (allowedRoles.includes(role)) return next();
        }

        // if user does not have authorized role, then continue authorization check
        const route = req.baseUrl.split("/").pop();

        const userRouteAuth = () => {
          if (username === req.params.username) return next();
          throw forbidden("User is not authorized");
        };

        const questRouteAuth = async () => {
          if (!req.params.questId) throw badRequest("Quest ID missing in params");
          try {
            const quest = await QuestModel.findById(req.params.questId);
            if (!quest) throw notFound("Quest not found in database");
            if (quest.user_id.toString() !== req.authUserId.toString()) throw forbidden("User is not authorized to review this quest");
            return next();
          } catch (error) {
            throw error;
          }
        };

        switch (route) {
          case "users":
            userRouteAuth();
            break;
          case "quests":
            await questRouteAuth();
            break;
          default:
            throw forbidden("User is not authorized");
        }

      } catch (error) {
        next(error);
      }
      
    };
  },
};

module.exports = userAuth;