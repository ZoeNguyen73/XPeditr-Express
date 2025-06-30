const UserModel = require("../models/userModel");
const UserValidator = require("../validations/userValidation");
const QuestModel = require("../models/questModel");

const getChildrenQuest = require("../utils/getChildrenQuests");

const controller = {
  retrieveByUsername: async (req, res, next) => {

  },

  updateByUsername: async (req, res, next) => {
    let validatedResults = null;

    try {
      validatedResults = await UserValidator.update.validateAsync(req.body);
      if (validatedResults.email) validatedResults.email = validatedResults.email.trim().toLowerCase();
      validatedResults.needs_profile_update = false;

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.authUserId,
        validatedResults,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Account updated",
        user : {
          id: updatedUser._id,
          username: updatedUser.username,
          updated_fields: validatedResults,
        }
      });
      
    } catch (error) {
      next(error);
    }
  },

  retrieveUserQuests: async (req, res, next) => {
    try {
      const { summarized, active, completed, nested } = req.query;
      const userId = req.authUserId;
      const queries = { user_id: userId };

      if (active !== undefined) {
        queries["status"] = active === "true" ? "active" : { $ne: "active" };
      }

      if (completed !== undefined) {
        queries["is_completed"] = completed === "true";
      }

      let selectString = "_id type title description is_completed completed_at due_date createdAt updatedAt status"

      if (summarized !== undefined && summarized === "true") {
        selectString = "_id type title is_completed status";
      }

      let quests;

      if (nested !== undefined && nested) {
        quests = await QuestModel.find({ parent_quest: null }).select(selectString).lean();
        for await (const quest of quests) {
          const childrenQuests = await getChildrenQuest(quest, queries, selectString);
          quest.children_quests = childrenQuests;
        }

        return res.status(200).json(quests);
      };

      if (summarized !== undefined && summarized === "true") {
        quests = await QuestModel.find(queries).select(selectString);
      } else {
        quests = await QuestModel.find(queries).lean();
      }

      if (!quests) return res.status(200).json({ message: "No quests found "});

      return res.status(200).json({count: quests.length, quests});

    } catch (error) {
      next(error);
    }
  },
};

module.exports = controller;