const QuestModel = require("../models/questModel");
const QuestValidator = require("../validations/questValidation");

const { badRequest, notFound, createError } = require("../utils/errorHelpers");
const parentValidation = async (childQuestType, parentQuestId) => {
  try {
    const parentQuest = await QuestModel.findById(parentQuestId);

    if (!parentQuest) throw notFound("Parent Quest not found in database");

    if (parentQuest.type === "minor") { 
      throw badRequest("Minor Quests cannot have child quest. Please create a Task instead")
    };

    if (parentQuest.type === "main" && childQuestType !== "minor") {
      throw badRequest("Only a Minor Quest can be a child quest of a Main Quest.")
    }

    if (parentQuest.type === "epic" && childQuestType === "epic") {
      throw badRequest("Only a Main or a Minor Quest can be a child quest of an Epic Quest.")
    }

    if (parentQuest.is_completed) throw badRequest("The parent quest is already completed and new child quest cannot be added.")

    return true;

  } catch (error) {
    throw error;
  }
};

const controller = {
  createQuest: async (req, res, next) => {
    let validatedResults = null;

    try {
      
      const userId = req.authUserId;
      
      validatedResults = await QuestValidator.create.validateAsync(req.body);
      const { type, title } = validatedResults;

      if (type === "epic") {
        // check if user already has an epic quest (note: for this phase user can only have 1 epic quest)
        const hasEpicQuest = await QuestModel.findOne({ user_id: userId, type: "epic", is_completed: false });
        if (hasEpicQuest) throw badRequest("User already has an active Epic Quest")
      }

      // check if user already has another quest with the same type and title
      const hasSimilarQuest = await QuestModel.findOne({
        user_id: userId,
        type,
        title,
        is_completed: false
      })
      if (hasSimilarQuest) throw badRequest("There is an active quest with the same title. Please change the title for better differentiation.");

      // check if there is a parent_quest and if yes, the hierarchy logic is correct & parent quest is not completed:
      if (validatedResults.parent_quest) {
        await parentValidation(type, validatedResults.parent_quest);
      }
      
      // check if there is a due_date and if yes, convert to the correct format:
      // note: the due_date field from FE should be in ISOString format
      if (validatedResults.due_date) {
        validatedResults.due_date = new Date(validatedResults.due_date);
      }
      
      const newQuest = await QuestModel.create({ ...validatedResults, is_completed: false, user_id: userId });

      return res.status(201).json({
        message: "Quest created",
        quest: newQuest,
      });

    } catch (error) {
      next(error)
    }

  },

  retrieveQuest: async (req, res, next) => {
    try {
      const { questId } = req.params;

      const quest = await QuestModel.findById(questId)
        .populate({
          path: "parent_quest",
          select: "_id type title description is_completed completed_at parent_quest due_date createdAt updatedAt",
          populate: {
            path: "parent_quest",
            select: "_id type title description is_completed completed_at parent_quest due_date createdAt updatedAt",
          } 
        });

      if (!quest) throw notFound("Unable to find Quest");

      return res.status(200).json(quest);

    } catch (error) {
      next(error);
    }
  },
};

module.exports = controller;