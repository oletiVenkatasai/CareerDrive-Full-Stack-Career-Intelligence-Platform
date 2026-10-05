const SkillDependency = require("../models/SkillDependency");
const { normalizeSkill, normalizeSkills } = require("../utils/normalizeSkill");

const getDirectPrerequisites = async (skillName) => {
  const normalized = normalizeSkill(skillName);
  const deps = await SkillDependency.find({ skill: normalized });
  return deps.map((d) => d.prerequisite);
};

const getAllPrerequisites = async (skillName, visited = new Set()) => {
  const normalized = normalizeSkill(skillName);

  if (visited.has(normalized)) return []; 
  visited.add(normalized);

  const directPrereqs = await getDirectPrerequisites(normalized);
  const allPrereqs = [...directPrereqs];

  for (const prereq of directPrereqs) {
    const transitive = await getAllPrerequisites(prereq, visited);
    allPrereqs.push(...transitive);
  }

  
  return [...new Set(allPrereqs)];
};

const getDependencyGraph = async () => {
  const allDeps = await SkillDependency.find({}).sort({ skill: 1, order: 1 });
  
  
  const graph = {};
  for (const dep of allDeps) {
    if (!graph[dep.skill]) {
      graph[dep.skill] = { skill: dep.skill, prerequisites: [], type: dep.relationshipType };
    }
    graph[dep.skill].prerequisites.push({
      name: dep.prerequisite,
      type: dep.relationshipType,
      order: dep.order,
    });
  }

  return Object.values(graph);
};

const getSkillDependencies = async (skillName) => {
  const normalized = normalizeSkill(skillName);
  const deps = await SkillDependency.find({ skill: normalized }).sort({ order: 1 });
  const prerequisites = await getAllPrerequisites(normalized);

  return {
    skill: skillName,
    directPrerequisites: deps.map((d) => ({ name: d.prerequisite, type: d.relationshipType })),
    allPrerequisites: prerequisites,
  };
};

module.exports = {
  getDirectPrerequisites,
  getAllPrerequisites,
  getDependencyGraph,
  getSkillDependencies,
};
