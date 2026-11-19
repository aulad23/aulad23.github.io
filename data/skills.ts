export type SkillGroup = { category: string; skills: string[]; note?: string };

export const skillGroups: SkillGroup[] = [
  { category: "Programming", skills: ["Python", "JavaScript", "TypeScript (working knowledge)"] },
  {
    category: "AI agents & MCP",
    skills: ["Multi-agent systems", "Agent orchestration", "Claude Code", "Claude API", "MCP (Model Context Protocol)"],
  },
  { category: "Web scraping", skills: ["Selenium", "Playwright", "BeautifulSoup", "Requests", "lxml"] },
  { category: "Data processing", skills: ["Pandas", "OpenPyXL", "Excel automation", "CSV processing"] },
  {
    category: "Quality assurance",
    skills: ["Data validation", "Duplicate detection", "SKU checks", "Price verification", "Dimension checks"],
  },
  { category: "Tools", skills: ["Git", "GitHub", "Chrome DevTools", "VS Code"] },
  { category: "Web fundamentals", skills: ["HTML", "CSS", "Responsive design"] },
];
