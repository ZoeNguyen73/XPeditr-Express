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

const isHigherHierarchy = (newType, oldType) => {
  const rank = {"minor": 1, "main": 2, "epic": 3};
  return rank[newType] > rank[oldType];
};

const isCircularReference = async (questId, newParentId) => {
    let currentId = newParentId;
    while (currentId) {
      if (currentId.toString() === questId.toString()) return true;
      const quest = await QuestModel.findById(currentId).select('parent_quest');
      currentId = quest?.parent_quest;
    }
    return false;
};

// TO DO: utils to calculate percentage completion

const getChildrenQuest = async (quest) => {
  if (quest.type === "minor") return [];
  try {
    const quests = await QuestModel.find({ parent_quest: quest._id })
      .select("_id type title description is_completed completed_at due_date createdAt updatedAt")
      .lean()
    if (quests.length === 0) return [];
    for await (const childQuest of quests) {
      const grandChildrenQuests = await getChildrenQuest(childQuest);
      childQuest.children_quests = grandChildrenQuests;
    }
    return quests;
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
        title,
      })
      if (hasSimilarQuest) throw badRequest("There is a quest with the same title. Please change the title for better differentiation.");

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
        .select("-__v -user_id")
        .populate({
          path: "parent_quest",
          select: "_id type title description is_completed completed_at parent_quest due_date createdAt updatedAt",
          populate: {
            path: "parent_quest",
            select: "_id type title description is_completed completed_at parent_quest due_date createdAt updatedAt",
          } 
        })
        .lean();

      if (!quest) throw notFound("Unable to find Quest");
      
      const childrenQuests = await getChildrenQuest(quest);
      quest.children_quests = childrenQuests;
      
      
      return res.status(200).json(quest);

    } catch (error) {
      next(error);
    }
  },

  updateQuest: async (req, res, next) => {
    let validatedResults = null;
    const { questId } = req.params;
    try {
      validatedResults = await QuestValidator.update.validateAsync(req.body);
      const currentQuest = await QuestModel.findById(questId).populate("parent_quest");
      if (!currentQuest) throw notFound("Quest not found in database");

      // Prevent update if quest is completed
      if (currentQuest.is_completed) throw badRequest("Cannot update a completed quest");

      // Build the "next state" quest object
      const updatedQuest = {...currentQuest.toObject(), ...validatedResults};
      console.log("validatedResults: " + JSON.stringify(validatedResults));
      console.log("updatedQuest: " + JSON.stringify(updatedQuest));

      // 1. Check title uniqueness
      if (validatedResults.title && validatedResults.title !== currentQuest.title) {
        const duplicate = await QuestModel.exists({ title: validatedResults.title });
        if (duplicate) {
          throw badRequest("There is a quest with the same title. Please change the title for better differentiation.")
        }
      }

      // 2. Validate new parent quest
      if (
        validatedResults.parent_quest && 
        validatedResults.parent_quest !== currentQuest.parent_quest?._id.toString()
      ) {
        const newParent = await QuestModel.findById(validatedResults.parent_quest);
        if (!newParent) throw notFound("Parent quest not found");

        if (newParent.is_completed) throw badRequest("Cannot assign a completed quest as a parent");

        if (!isHigherHierarchy(newParent.type, updatedQuest.type)) throw badRequest("Parent must be of higher hierarchy");

        if (await isCircularReference(questId, newParent._id)) throw badRequest("Circular reference detected");
      }

      // 3. Validate type change
      if (
        validatedResults.type && 
        validatedResults.type !== currentQuest.type
      ) {
        const isUpgraded = isHigherHierarchy(updatedQuest.type, currentQuest.type);
        const hasChildren = await QuestModel.exists({ parent_quest: questId });

        if (!isUpgraded && hasChildren) {
          return res.status(400).json({ error: "Cannot downgrade type with children quests." });
        }

        // If upgrading, optionally update parent to grandparent
        if (isUpgraded && currentQuest.parent_quest) {
          const grandparentId = currentQuest.parent_quest?.parent_quest;
          updatedQuest.parent_quest = grandparentId || null;
        }
      }

      // update database once passed all validations
      const newQuest = await QuestModel.findByIdAndUpdate(questId, updatedQuest, { new: true })
        .select("-__v -user_id")
        .populate({
          path: "parent_quest",
          select: "_id type title description is_completed completed_at parent_quest due_date createdAt updatedAt",
          populate: {
            path: "parent_quest",
            select: "_id type title description is_completed completed_at parent_quest due_date createdAt updatedAt",
          } 
        })
        .lean();
      
      return res.status(200).json({
        message: "quest updated successfully",
        updated_quest: newQuest
      });

    } catch (error) {
      next(error);
    }
  },

  completeQuest: async (req, res, next) => {
    try {
      const { questId } = req.params;
      const quest = await QuestModel.findById(questId);
      if (!quest) throw notFound("Unable to find Quest");

      if (quest.is_completed) {
        return res.status(200).json({ 
          message: "Quest has already been completed",
          completed_at: quest.completed_at
        });
      }

      // check if there are incomplete children quest
      const incompleteChildren = await QuestModel.find({
        parent_quest: questId,
        is_completed: false,
      });

      if (incompleteChildren.length > 0) throw createError("Cannot complete a quest while it has incomplete sub-quests");

      quest.is_completed = true;
      quest.completed_at = new Date();
      await quest.save();

      return res.status(200).json({ message: "Quest marked as completed"});

    } catch (error) {
      next(error);
    }
  }
};

module.exports = controller;