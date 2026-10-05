

const ALIASES = {
  "react.js": "react",
  "reactjs": "react",
  "node.js": "nodejs",
  "nodejs": "nodejs",
  "express.js": "express",
  "expressjs": "express",
  "mongodb": "mongodb",
  "mongo": "mongodb",
  "vue.js": "vue",
  "vuejs": "vue",
  "next.js": "nextjs",
  "nextjs": "nextjs",
  "javascript": "javascript",
  "js": "javascript",
  "typescript": "typescript",
  "ts": "typescript",
  "postgresql": "postgresql",
  "postgres": "postgresql",
  "c++": "c++",
  "cpp": "c++",
  "ms sql": "mssql",
  "mysql": "mysql",
  "rest api": "rest api",
  "restapi": "rest api",
  "restful api": "rest api",
};

const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== "string") return "";
  const lower = skill.toLowerCase().trim();
  return ALIASES[lower] || lower;
};

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills.map(normalizeSkill).filter(Boolean);
};

module.exports = { normalizeSkill, normalizeSkills };
