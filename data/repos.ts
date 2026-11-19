// Projects shown in the Projects section.
// Public repos link to GitHub; set `private: true` to show "Code available on request" instead.

export type Repo = {
  name: string; // GitHub repository name
  private?: boolean;
  title: string;
  description: string;
  details: string[];
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
      "A multi-agent scraping system built with Claude Code. An orchestrator plans the work and runs vendor scrapers in parallel, all writing to one fixed Master Excel format.",
    details: [
      "Discovers each vendor's product categories and maps them to the client's accepted list",
      "Runs Playwright scrapers in parallel and writes a fixed 191-column Master sheet",
      "Finishes with an automated data-quality pass and price checks before delivery",
    ],
    language: "Python",
    tags: ["Multi-agent", "Claude Code", "Playwright", "OpenPyXL"],
  },
  {
    name: "AVS-Agent",
    private: true,
    title: "AVS Agent",
    description:
      "An agentic scraping framework for interior design vendors, with one shared base scraper and a scraper per vendor.",
    details: [
      "Shared base scraper with an async Playwright engine",
      "Per-category crash recovery and automatic SKU generation",
      "Repeatable refresh runs that produce the same Excel format every time",
    ],
    language: "Python",
    tags: ["AI agent", "Playwright", "Selenium"],
  },
  {
    name: "MCP-Workspace-Setup",
    private: true,
    title: "MCP Workspace Setup",
    description:
      "Scripts that connect Claude agents to Google Workspace through MCP (Model Context Protocol), so agents can work with real tools and data.",
    details: [
      "One-command setup for MCP servers on a new machine",
      "Per-account configuration for multiple Google Workspace accounts",
      "Documented setup so teammates can repeat it",
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
    language: "Python",
    tags: ["Agent", "Claude API", "Data enrichment"],
  },
  {
    name: "Master-Staffing-Recruiting-Agent",
    private: true,
    title: "Staffing & Recruiting Agent",
    description: "An agent that collects and organizes data on staffing and recruiting companies for outreach.",
    details: [
      "Gathers company information from public sources",
      "Cleans and structures the results into one list",
    ],
    language: "Python",
    tags: ["Agent", "Lead data"],
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
    language: "Python",
    tags: ["Selenium", "BeautifulSoup", "Requests"],
  },
  {
    name: "Lead-Gen-Map-Bots",
    private: true,
    title: "Lead Generation Map Bots",
    description: "Bots that build lead lists from Google Maps and Crunchbase.",
    details: [
      "Finds businesses within a set radius across many categories",
      "Collects company details from Crunchbase",
      "Exports clean lists ready for outreach",
    ],
    language: "Python",
    tags: ["Google Maps", "Crunchbase", "Lead generation"],
  },
  {
    name: "Agent-Weekly-Report",
    title: "Agent Weekly Report",
    description: "An AI-powered weekly report agent built with FastAPI.",
    details: ["Generates a weekly summary with the Claude API", "Emails the report automatically"],
    language: "Python",
    tags: ["FastAPI", "Claude API"],
  },
  {
    name: "Chatbox",
    title: "Chatbox",
    description: "A chat app powered by Ollama — free, local AI — built with Flask and Python.",
    details: ["Runs a language model locally, with no paid API", "Simple Flask web interface"],
    language: "Python",
    tags: ["Flask", "Ollama", "Local AI"],
  },
  {
    name: "SC-AU",
    title: "SC-AU",
    description: "LinkedIn automation and investor list automation using Crunchbase.",
    details: ["Verifies LinkedIn contacts", "Builds investor lists from Crunchbase"],
    language: "Python",
    tags: ["LinkedIn", "Crunchbase"],
  },
  {
    name: "Demo-Data",
    title: "Demo Data",
    description: "Scraping scripts and spot-check data for 16 furniture and decor vendors.",
    details: ["One script per vendor", "Spot-check files to verify the scraped results"],
    language: "Python",
    tags: ["Scraping", "Data checks"],
  },
  {
    name: "Map-Bot-Update",
    title: "Map Bot",
    description: "A geolocation bot that finds businesses within a radius and builds lead lists.",
    details: ["Searches across 15+ business categories", "Exports results for outreach"],
    language: "Python",
    tags: ["Maps", "Automation"],
  },
  {
    name: "LinkedIn-Pet-Institute",
    title: "LinkedIn Pet Institute",
    description: "LinkedIn automation for pet industry institutes.",
    details: ["Finds and verifies professional profiles", "Exports structured data for outreach"],
    language: "Python",
    tags: ["LinkedIn", "Automation"],
  },
  {
    name: "Basic-Automation",
    title: "Basic Automation",
    description: "Small input/output automation scripts in Python.",
    details: ["Everyday file and data tasks automated with plain Python"],
    language: "Python",
    tags: ["Automation"],
  },
];
