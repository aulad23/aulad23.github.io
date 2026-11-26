// Projects shown in the Projects section.
// Public repos link to GitHub; set `private: true` to show "Code available on request" instead.
// `flow` is the small "how it works" diagram under each project — only steps that exist in the code.
// A step is a plain label, or { group, items } for agents/tools that work side by side.

export type FlowStep = string | { group: string; items: string[] };

// For multi-agent projects: the main agent calls sub-agents round by round (agents in one round run
// at the same time), stores each answer, then combines them into the output.
export type AgentDiagram = { input: string; main: string; rounds: string[][]; store: string; output: string };

export type Repo = {
  name: string; // GitHub repository name
  private?: boolean;
  status?: string; // e.g. "In progress" for projects still being built
  title: string;
  description: string;
  details: string[];
  flow: FlowStep[];
  agents?: AgentDiagram; // shown instead of `flow` when present
  language: string;
  tags: string[];
};

const GH = "https://github.com/aulad23/";
export const repoUrl = (r: Repo) => GH + r.name;
export const allReposUrl = "https://github.com/aulad23?tab=repositories";

export const projects: Repo[] = [
  {
    name: "AVS-Agent-2.0",
    private: true,
    title: "AVS Agent 2.0",
    description:
      "A multi-agent scraping system built with Claude Code, used on 350+ interior design vendor websites. An orchestrator plans the work and runs vendor scrapers in parallel, all writing to one fixed Master Excel format.",
    details: [
      "Discovers each vendor's product categories and maps them to the client's accepted list",
      "Runs Playwright scrapers in parallel and writes a fixed 191-column Master sheet",
      "Finishes with an automated data-quality pass and a USD price check against the live site",
    ],
    flow: [
      "Vendor name + website",
      "Category discovery",
      "Orchestrator",
      { group: "Parallel scrapers", items: ["Vendor A", "Vendor B", "Vendor C"] },
      "191-column Master Excel",
      "Quality + price check",
    ],
    agents: {
      input: "Vendor name + website",
      main: "Orchestrator",
      rounds: [["Category discovery"], ["Scraper · Vendor A", "Scraper · Vendor B", "Scraper · Vendor C"], ["Quality + price check"]],
      store: "Run results",
      output: "191-column Master Excel",
    },
    language: "Python",
    tags: ["Multi-agent", "Claude Code", "Playwright", "OpenPyXL"],
  },
  {
    name: "Lead-Data-Agent",
    status: "In progress",
    title: "Lead Data Agent",
    description:
      "A multi-agent system that builds and fills lead data for any industry: it finds US companies, their decision-makers and contact details, and tracks public LinkedIn posts. It can also take a client's Excel file and fill only the empty cells.",
    details: [
      "A main agent decides which of seven sub-agents to call for each company or spreadsheet row",
      "Each sub-agent has its own memory and learns which steps work, skipping ones that never help",
      "Free public sources first (NPI Registry, OpenStreetMap, web search, public LinkedIn pages); paid Apify lookup only when asked, with a monthly cap",
    ],
    flow: [
      "Industry + city, or client Excel",
      "Main agent",
      {
        group: "Sub-agents",
        items: ["Discovery", "Company", "Company profile", "People", "Posts", "Influencer", "QC"],
      },
      "Scored CSV / filled Excel",
    ],
    agents: {
      input: "Industry + city, or a client Excel file",
      main: "Main agent",
      rounds: [["Discovery"], ["Company"], ["Company profile"], ["People"], ["Posts"], ["QC"]],
      store: "Memory hub",
      output: "Scored CSV / filled Excel",
    },
    language: "Python",
    tags: ["Multi-agent", "LinkedIn", "Lead generation", "Agent memory"],
  },
  {
    name: "MCP-Workspace-Setup",
    private: true,
    title: "MCP Workspace Setup",
    description:
      "Scripts that connect Claude agents to Google Workspace through MCP (Model Context Protocol), so agents can work with real tools and data.",
    details: [
      "One MCP server per Google account, each with its own credentials",
      "Per-account configuration for multiple Google Workspace accounts",
      "Documented setup so teammates can repeat it",
    ],
    flow: [
      "Claude Code",
      { group: "One MCP server per account", items: ["Account 1", "Account 2", "Account 3"] },
      "Gmail · Drive · Docs · Sheets · Calendar",
    ],
    language: "PowerShell",
    tags: ["MCP", "Claude", "Google Workspace"],
  },
  {
    name: "Weekly-Report-Agent",
    private: true,
    title: "Weekly Report Agent",
    description:
      "Reads the team's daily reports from a Google Form, works out each person's hours, and sends a weekly report.",
    details: [
      "Parses free-text time entries and merges tasks that span several days",
      "Splits hours into billable, internal and non-billable work",
      "Runs an audit with outlier and gap flags, then emails reports only after confirmation",
    ],
    flow: [
      "Google Form responses",
      "Time-entry parser",
      { group: "Weekly hours", items: ["Billable", "Internal", "Non-billable"] },
      "Audit flags",
      "Confirm",
      "Email reports",
    ],
    language: "Python",
    tags: ["Agent", "Google Sheets API", "Gmail API"],
  },
  {
    name: "enrich-agent",
    private: true,
    title: "CSV Enrichment Agent",
    description:
      "A modular agent that enriches a company list with extra data — orchestrated enrichers with caching, de-duplication and merging.",
    details: [
      "Adds Google rating and review count, SEO score and AEO (AI-search readiness) score",
      "Uses the Claude API to write a short analysis of each company",
      "Caches results so re-runs are fast and cheap",
    ],
    flow: [
      "Company CSV",
      "De-duplicate by domain",
      { group: "Enrichers", items: ["Google rating", "SEO score", "AEO score", "Claude analysis"] },
      "Cache",
      "Merge back to every row",
    ],
    language: "Python",
    tags: ["Agent", "Claude API", "Data enrichment"],
  },
  {
    name: "Master-Staffing-Recruiting-Agent",
    private: true,
    title: "Staffing & Recruiting Agent",
    description:
      "A research agent that enriches a spreadsheet of staffing and recruiting companies for sales outreach, using public sources only.",
    details: [
      "Adds Google reviews, SEO and AEO scores, recent news, job postings, funding and growth signals",
      "Verifies every result belongs to the right company; wrong-company data is rejected",
      "Writes a short sales summary per company and can resume where it stopped",
    ],
    flow: [
      "Company spreadsheet",
      "Company verification",
      { group: "Research", items: ["Reviews", "SEO / AEO", "News", "Job postings", "Funding"] },
      "Sales summary",
      "Enriched sheet",
    ],
    language: "Python",
    tags: ["Agent", "Lead data", "Playwright"],
  },
  {
    name: "SD_SKU",
    private: true,
    title: "SD_SKU QC Web System",
    description: "A Flask web app that turns vendor Excel/CSV files into a browsable catalog for quality checks.",
    details: [
      "Image proxy and caching so large catalogs stay fast",
      "Tells real broken images (404) apart from sites blocking requests",
      "Exports a CSV audit report per vendor",
    ],
    flow: ["Vendor Excel / CSV", "Importer", "Flask catalog", "Image check", "CSV audit report"],
    language: "Python",
    tags: ["Flask", "Data QC", "Excel / CSV"],
  },
  {
    name: "Vendor-Scrapers",
    private: true,
    title: "Vendor Scrapers",
    description: "A collection of Python scrapers for furniture and interior design vendor websites.",
    details: [
      "Handles Shopify, WooCommerce, Next.js and custom-built stores",
      "Static pages with Requests/BeautifulSoup, dynamic pages with Selenium",
      "Organized by vendor so each scraper can be re-run on its own",
    ],
    flow: [
      "Vendor website",
      "Check site type",
      { group: "Scraping method", items: ["Requests + BeautifulSoup", "Selenium"] },
      "Excel per vendor",
    ],
    language: "Python",
    tags: ["Selenium", "BeautifulSoup", "Requests"],
  },
  {
    name: "Lead-Gen-Map-Bots",
    private: true,
    title: "Lead Generation Map Bots",
    description: "Bots that build lead lists from Google Maps and Crunchbase.",
    details: [
      "Searches Google Maps by business category, with radius and distance versions",
      "Checks each business's website and collects company details from Crunchbase",
      "Exports clean lists ready for outreach",
    ],
    flow: [
      "Category + location",
      "Google Maps search",
      { group: "Checks", items: ["Website check", "Crunchbase"] },
      "Lead list",
    ],
    language: "Python",
    tags: ["Google Maps", "Crunchbase", "Lead generation"],
  },
  {
    name: "Agent-Weekly-Report",
    title: "Agent Weekly Report",
    description:
      "A multi-user FastAPI service that builds each person's weekly work report from time-tracking data on a schedule.",
    details: [
      "Reads TopTracker exports and daily report entries",
      "Runs every week on a scheduler, with a manual run-now endpoint for testing",
      "Writes the report into a Google Doc template and emails it",
    ],
    flow: ["TopTracker CSV", "FastAPI service", "Weekly scheduler", "Google Doc report", "Email"],
    language: "Python",
    tags: ["FastAPI", "APScheduler", "Google Docs API"],
  },
  {
    name: "Chatbox",
    title: "Chatbox",
    description: "A chat app powered by Ollama — free, local AI — built with Flask and Python.",
    details: ["Runs a language model (Llama 3.2) locally, with no paid API", "Simple Flask web interface"],
    flow: ["Browser chat", "Flask", "Ollama · Llama 3.2 (local)", "Reply"],
    language: "Python",
    tags: ["Flask", "Ollama", "Local AI"],
  },
  {
    name: "SC-AU",
    title: "SC-AU",
    description: "LinkedIn automation and investor list automation using Crunchbase.",
    details: ["Verifies LinkedIn contacts", "Builds, filters and merges investor lists from Crunchbase"],
    flow: [{ group: "Sources", items: ["LinkedIn contacts", "Crunchbase investors"] }, "Selenium", "Filter + merge", "Excel list"],
    language: "Python",
    tags: ["LinkedIn", "Crunchbase", "Selenium"],
  },
  {
    name: "Map-Bot-Update",
    title: "Map Bot",
    description: "A Google Maps bot that works out the driving distance from each origin address to target businesses.",
    details: ["Processes each origin address in turn", "Saves the shortest driving distance to one Excel sheet"],
    flow: ["Origin addresses", "Google Maps (Selenium)", "Driving distance", "Master Excel"],
    language: "Python",
    tags: ["Google Maps", "Selenium", "Automation"],
  },
];
