// Editable experience timeline. Add `period` and `details` once you have verified them.

export type ExperienceItem = {
  role: string;
  team: string;
  company: string;
  period?: string;
  details?: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Associate Automation Engineer",
    team: "Web Development",
    company: "Accord Tech Solutions",
  },
];

export const workflow = [
  { stage: "01", name: "Research", description: "Inspect website structure, product pages and available data sources." },
  { stage: "02", name: "Extract", description: "Collect relevant product data using appropriate scraping methods." },
  { stage: "03", name: "Process", description: "Clean, normalize and structure the extracted data." },
  { stage: "04", name: "Validate", description: "Check data quality, duplicates, SKU, price and dimensions where relevant." },
  { stage: "05", name: "Deliver", description: "Prepare organized Excel/CSV outputs and report known limitations." },
];

export const journey = [
  "Started with Python fundamentals and object-oriented programming.",
  "Moved into web scraping — static pages first, then dynamic, JavaScript-heavy sites.",
  "Now focused on product data extraction, processing and quality checks before delivery.",
  "Building multi-agent systems with Claude Code, connected to tools through MCP.",
  "Studying for a BSc in Computer Science & Engineering, after a Diploma in Engineering.",
];
