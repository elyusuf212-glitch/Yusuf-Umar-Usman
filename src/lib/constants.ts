export const SITE = {
  name: "CitizensNexus",
  tagline: "Connecting Citizens. Developing Leaders. Creating Impact.",
  description:
    "CitizensNexus is a youth leadership, mentorship, learning, networking and civic-impact platform that identifies, develops, connects and empowers young people across Nigeria and Africa to become effective leaders and changemakers.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export const NAV_LINKS: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Programmes",
    href: "/programmes",
    children: [
      { label: "All Programmes", href: "/programmes", description: "Leadership tracks and cohorts" },
      { label: "Fellowship", href: "/fellows", description: "Meet the CitizensNexus Fellows" },
      { label: "Mentorship", href: "/mentorship", description: "How mentorship works" },
      { label: "Mentors", href: "/mentors", description: "Meet our mentor network" },
    ],
  },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Events", href: "/events" },
  { label: "Learning Hub", href: "/learning" },
  {
    label: "Impact",
    href: "/projects",
    children: [
      { label: "Projects", href: "/projects", description: "Community & civic projects" },
      { label: "Success Stories", href: "/stories", description: "Fellow spotlights" },
      { label: "SDG Impact", href: "/projects#sdgs", description: "Our contribution to the Global Goals" },
    ],
  },
  { label: "Resources", href: "/resources" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  platform: [
    { label: "Programmes", href: "/programmes" },
    { label: "Fellowship", href: "/fellows" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Learning Hub", href: "/learning" },
    { label: "Opportunities", href: "/opportunities" },
  ],
  organisation: [
    { label: "About CitizensNexus", href: "/about" },
    { label: "Success Stories", href: "/stories" },
    { label: "Partners", href: "/partners" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
  account: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Application Portal", href: "/apply" },
    { label: "Verify a Certificate", href: "/certificates/verify" },
  ],
};

export const IMPACT_STATS_DEFAULT = [
  { label: "Young People Reached", value: "10,000+" },
  { label: "Fellows Developed", value: "500+" },
  { label: "Active Mentors", value: "200+" },
  { label: "Community Projects", value: "100+" },
];

export const PROGRAMME_THEMES = [
  "Leadership & Mindset",
  "Public Speaking",
  "Entrepreneurship",
  "Digital & AI Skills",
  "Project Management",
  "Advocacy & Civic Engagement",
  "Personal Branding",
  "Research & Data",
  "Employability",
];

export const FELLOW_DEVELOPMENT_AREAS = [
  "Leadership",
  "Public Speaking",
  "Advocacy",
  "Project Management",
  "Research & Data",
  "Fundraising & Proposal Writing",
  "Digital Skills",
  "Artificial Intelligence",
  "Employability",
  "Mobilisation",
  "Partnerships",
  "Policy",
  "Personal Branding",
  "Monitoring & Evaluation",
  "Strategy",
  "Mentorship",
];

export const LEARNING_CATEGORIES = [
  "Leadership",
  "Mindset",
  "Entrepreneurship",
  "Project Management",
  "Public Speaking",
  "Digital Literacy",
  "Artificial Intelligence",
  "Research & Data",
  "Advocacy",
  "Personal Branding",
  "Employability",
  "Fundraising",
  "Monitoring & Evaluation",
  "Policy & Governance",
];

export const OPPORTUNITY_CATEGORIES = [
  { value: "JOB", label: "Jobs" },
  { value: "INTERNSHIP", label: "Internships" },
  { value: "SCHOLARSHIP", label: "Scholarships" },
  { value: "FELLOWSHIP", label: "Fellowships" },
  { value: "GRANT", label: "Grants" },
  { value: "COMPETITION", label: "Competitions" },
  { value: "CONFERENCE", label: "Conferences" },
  { value: "TRAINING", label: "Trainings" },
  { value: "VOLUNTEERING", label: "Volunteering" },
  { value: "YOUTH_PROGRAMME", label: "Youth Programmes" },
] as const;

export const EVENT_TYPES = [
  { value: "TRAINING", label: "Training" },
  { value: "WEBINAR", label: "Webinar" },
  { value: "LEADERSHIP_CONVERSATION", label: "Leadership Conversation" },
  { value: "NETWORKING", label: "Networking" },
  { value: "TOWN_HALL", label: "Town Hall" },
  { value: "COMMUNITY_PROJECT", label: "Community Project" },
  { value: "MENTORSHIP_SESSION", label: "Mentorship Session" },
  { value: "CONFERENCE", label: "Conference" },
] as const;

export const SDG_LIST = [
  { number: 1, name: "No Poverty", colorHex: "#E5243B" },
  { number: 2, name: "Zero Hunger", colorHex: "#DDA63A" },
  { number: 3, name: "Good Health and Well-being", colorHex: "#4C9F38" },
  { number: 4, name: "Quality Education", colorHex: "#C5192D" },
  { number: 5, name: "Gender Equality", colorHex: "#FF3A21" },
  { number: 6, name: "Clean Water and Sanitation", colorHex: "#26BDE2" },
  { number: 7, name: "Affordable and Clean Energy", colorHex: "#FCC30B" },
  { number: 8, name: "Decent Work and Economic Growth", colorHex: "#A21942" },
  { number: 9, name: "Industry, Innovation and Infrastructure", colorHex: "#FD6925" },
  { number: 10, name: "Reduced Inequalities", colorHex: "#DD1367" },
  { number: 11, name: "Sustainable Cities and Communities", colorHex: "#FD9D24" },
  { number: 12, name: "Responsible Consumption and Production", colorHex: "#BF8B2E" },
  { number: 13, name: "Climate Action", colorHex: "#3F7E44" },
  { number: 14, name: "Life Below Water", colorHex: "#0A97D9" },
  { number: 15, name: "Life on Land", colorHex: "#56C02B" },
  { number: 16, name: "Peace, Justice and Strong Institutions", colorHex: "#00689D" },
  { number: 17, name: "Partnerships for the Goals", colorHex: "#19486A" },
] as const;

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  WAITLISTED: "Waitlisted",
  REJECTED: "Not Successful",
};

export const APPLICATION_STATUS_TONE: Record<string, "navy" | "gold" | "green" | "red" | "gray"> = {
  DRAFT: "gray",
  SUBMITTED: "navy",
  UNDER_REVIEW: "gold",
  SHORTLISTED: "gold",
  INTERVIEW: "gold",
  ACCEPTED: "green",
  WAITLISTED: "gray",
  REJECTED: "red",
};
