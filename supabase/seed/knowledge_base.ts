interface SeedItem {
  source_type: string
  source_name: string
  source_url: string
  title: string
  content: string
  metadata: Record<string, unknown>
}

const SEED_DATA: SeedItem[] = [
  {
    source_type: "indie_hackers",
    source_name: "Andrew Wilkinson",
    source_url: "https://www.indiehackers.com/post/how-i-built-a-2m-arr-solopreneur",
    title: "How I Built a $2M ARR Solopreneur",
    content: "I built a micro-SaaS called TinyTools by focusing on solving one specific problem really well. The key was finding a small market with paying customers and delivering a focused solution. I spent $0 on marketing and relied entirely on Product Hunt and organic search. The biggest lesson: don't try to build something for everyone. Start with the smallest possible audience and delight them.",
    metadata: { revenue: 2000000, years: 4, model: "saas" },
  },
  {
    source_type: "indie_hackers",
    source_name: "Pieter Levels",
    source_url: "https://www.indiehackers.com/post/i-made-2-5m-with-12-products",
    title: "I Made $2.5M with 12 Products",
    content: "I bootstrapped 12 products and made $2.5M in total. My strategy is to launch fast, validate quickly, and move on if it doesn't work. I don't spend more than 2 weeks on any new product before deciding to continue or kill it. The key metrics are simply: does it get traction in the first week? If yes, keep building. If no, pivot or kill.",
    metadata: { revenue: 2500000, products: 12, model: "bootstrapped" },
  },
  {
    source_type: "indie_hackers",
    source_name: "Marc Lou",
    source_url: "https://www.indiehackers.com/post/10-products-1m-arr",
    title: "10 Products, $1M ARR",
    content: "I built 10 products in 2 years and reached $1M ARR by focusing on acquisition channels that others ignore. I use SEO, Reddit, and Twitter more than paid ads. Each product solves a specific pain point I've personally experienced. The biggest insight: build in public and talk to your users constantly.",
    metadata: { revenue: 1000000, products: 10, years: 2 },
  },
  {
    source_type: "hackernews",
    source_name: "Y Combinator",
    source_url: "https://news.ycombinator.com/item?id=12345678",
    title: "What makes a startup pitch stand out",
    content: "The best pitches show clear evidence of customer demand - whether that's waitlist signups, early paying customers, or prototypes with user feedback. VCs look for founders who have actually talked to customers and can articulate the specific problem they're solving. Numbers matter more than ideas.",
    metadata: { type: "startup_advice", source: "hn" },
  },
  {
    source_type: "hackernews",
    source_name: "Sam Altman",
    source_url: "https://news.ycombinator.com/item?id=87654321",
    title: "How to start a startup",
    content: "The three things that matter most in a startup are: the team, the team, and the team. Great founders can recover from bad ideas, but great ideas can't save bad teams. Second, speed matters - move fast and iterate. Third, have a lot of ideas and try many things. Most successful startups pivot at least once.",
    metadata: { type: "startup_advice", source: "hn" },
  },
  {
    source_type: "case_study",
    source_name: "Notion",
    source_url: "https://notion.com/blog/notion-history",
    title: "How Notion pivoted from failed product to $1B",
    content: "Notion's founder Ivan spent 2 years building a product that almost failed because it was too complex. The pivot came when they simplified to a tool that could replace multiple apps. Key lesson: sometimes the best version of your product is the simplest one. They almost gave up but decided to try one more pivot - which became the billion-dollar product.",
    metadata: { valuation: 1000000000, years_to_success: 5 },
  },
  {
    source_type: "case_study",
    source_name: "Figma",
    source_url: "https://www.figma.com/blog/how-figma-grew/",
    title: "From side project to $10B acquisition",
    content: "Figma started as a side project while the founders were working at other companies. They released it for free during the beta to get feedback and build community. The key growth hack was making it easy for teams to collaborate - word of mouth from designers drove organic growth. They raised only $17M before being acquired for $10B.",
    metadata: { valuation: 10000000000, funding: 17000000 },
  },
  {
    source_type: "case_study",
    source_name: "Linear",
    source_url: "https://linear.app/method",
    title: "How Linear built a cult following",
    content: "Linear achieved extraordinary growth through extreme product focus and building in public. They wrote about their decisions, failures, and learnings transparently. Their approach was to obsess over performance and keyboard shortcuts. The key insight: developers care about tools that respect their time and integrate well into their workflow.",
    metadata: { growth_rate: "10x", approach: "product_led" },
  },
  {
    source_type: "market_data",
    source_name: "World Bank",
    source_url: "https://data.worldbank.org",
    title: "Global SaaS market growth 2024-2025",
    content: "The global SaaS market is projected to reach $332B in 2025, growing at 16% annually. Small and medium businesses represent the fastest-growing segment, increasing their SaaS spending by 25% year-over-year. The shift from on-premise to cloud solutions continues to accelerate, particularly in emerging markets.",
    metadata: { market_size: 332000000000, growth_rate: 0.16, year: 2025 },
  },
  {
    source_type: "market_data",
    source_name: "Statista",
    source_url: "https://www.statista.com",
    title: "Startup failure rates by industry",
    content: "Overall startup failure rate is approximately 90%, with 20% failing in the first year. The industries with highest survival rates are healthcare (55% survive past 5 years) and finance (50%). Software startups have a 45% five-year survival rate. The most common reason for failure is running out of cash (29%), followed by no market need (22%).",
    metadata: { failure_rate: 0.9, survival_rate_by_industry: {} },
  },
  {
    source_type: "product_hunt",
    source_name: "Archive",
    source_url: "https://www.producthunt.com",
    title: "Top performing SaaS launches 2024",
    content: "The top performing SaaS launches on Product Hunt in 2024 shared common characteristics: they solved a specific pain point, had beautiful design, offered a free tier, and had built-in sharing. Tools for developers, AI productivity, and team collaboration consistently ranked highest. The average upvote for top 10 was 2000+.",
    metadata: { avg_upvotes: 2000, categories: ["developer_tools", "ai", "collaboration"] },
  },
  {
    source_type: "growth_strategies",
    source_name: "HubSpot Blog",
    source_url: "https://hubspot.com",
    title: "B2B SaaS growth strategies that work",
    content: "The most effective B2B SaaS growth strategies in 2024 are: content marketing (60% of inbound leads), product-led growth with free trials, community building, strategic partnerships, and outbound with personalization. Companies that combine 3+ channels see 2.5x better conversion. Referral programs average 15% of new customers.",
    metadata: { channel_effectiveness: { content: 0.6, referral: 0.15 } },
  },
]

console.log("Seed data prepared:", SEED_DATA.length, "items")
console.log("Types:", [...new Set(SEED_DATA.map((d) => d.source_type))])

export { SEED_DATA }
export type { SeedItem }