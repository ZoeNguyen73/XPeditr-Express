const QuestModel = require("../models/questModel");
const DEFAULT_SELECT_STRING = "_id type title description is_completed completed_at due_date createdAt updatedAt status";

const getChildrenQuest = async (quest, queries = {}, selectString = DEFAULT_SELECT_STRING) => {
  if (quest.type === "minor") return [];
  queries.parent_quest = quest._id;

  try {
    const quests = await QuestModel.find(queries)
      .select(selectString)
      .lean();
    if (quests.length === 0) return [];
    for await (const childQuest of quests) {
      const grandChildrenQuests = await getChildrenQuest(childQuest, queries, selectString);
      childQuest.children_quests = grandChildrenQuests;
    }
    return quests;
  } catch (error) {
    throw error;
  }
};

module.exports = getChildrenQuest;