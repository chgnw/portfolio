/**
 * The layout is fixed by design, so the set of editable text slots is defined
 * here in code. Values live in ms_site_text; `fallback` is the placeholder
 * rendered on the portfolio whenever a value is empty.
 */
export const SECTION_KEYS = ["global", "home", "about", "projects", "skills", "contacts"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

/** Sections that show up in the navbar (global holds site-wide texts). */
export const NAV_SECTION_KEYS: SectionKey[] = ["home", "about", "projects", "skills", "contacts"];

export interface TextSlot {
  key: string;
  label: string;
  fallback: string;
  multiline?: boolean;
}

export interface SectionDefinition {
  key: SectionKey;
  title: string;
  defaultNavLabel: string;
  description: string;
  texts: TextSlot[];
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    key: "global",
    title: "Site-wide",
    defaultNavLabel: "",
    description: "Browser tab title, SEO description and shared labels.",
    texts: [
      { key: "metaTitle", label: "Browser tab title", fallback: "Portfolio" },
      { key: "metaDescription", label: "SEO description", fallback: "Personal portfolio", multiline: true },
      { key: "presentLabel", label: "Label for ongoing periods", fallback: "Present" },
    ],
  },
  {
    key: "home",
    title: "Home",
    defaultNavLabel: "Home",
    description: "Hero section. Name, job title and bio are edited under Profile.",
    texts: [
      { key: "primaryCta", label: "Primary button", fallback: "Get to Know Me Better" },
      { key: "cvCta", label: "CV button", fallback: "Download CV" },
    ],
  },
  {
    key: "about",
    title: "About",
    defaultNavLabel: "About",
    description: "About description is edited under Profile.",
    texts: [
      { key: "heading", label: "Heading", fallback: "About Me" },
      { key: "educationHeading", label: "Education heading", fallback: "Educations" },
      { key: "experienceHeading", label: "Experience heading", fallback: "Experiences" },
      { key: "educationEmpty", label: "Shown when there is no education", fallback: "No education added yet." },
      { key: "experienceEmpty", label: "Shown when there is no experience", fallback: "No experience added yet." },
    ],
  },
  {
    key: "projects",
    title: "Projects",
    defaultNavLabel: "Projects",
    description: "Project list headings and card hints.",
    texts: [
      { key: "heading", label: "Heading", fallback: "My Projects" },
      { key: "tagline", label: "Tagline", fallback: "Here's some of the projects I've worked on.", multiline: true },
      { key: "flipHint", label: "Card front hint", fallback: "Click for details" },
      { key: "flipBackHint", label: "Card back hint", fallback: "Click to flip back" },
      { key: "empty", label: "Shown when there are no projects", fallback: "No projects yet." },
    ],
  },
  {
    key: "skills",
    title: "Skills",
    defaultNavLabel: "Skills",
    description: "Skills headings.",
    texts: [
      { key: "heading", label: "Heading", fallback: "Skills" },
      { key: "tagline", label: "Tagline (optional)", fallback: "", multiline: true },
      { key: "certificateCta", label: "Certificate button", fallback: "View Certificate" },
      { key: "empty", label: "Shown when there are no skills", fallback: "No skills added yet." },
    ],
  },
  {
    key: "contacts",
    title: "Contacts",
    defaultNavLabel: "Contacts",
    description: "Contact form and social links headings.",
    texts: [
      { key: "heading", label: "Heading", fallback: "Contact Me" },
      { key: "tagline", label: "Tagline", fallback: "Interested to work with me? Let me know!", multiline: true },
      { key: "namePlaceholder", label: "Name field placeholder", fallback: "Name" },
      { key: "emailPlaceholder", label: "Email field placeholder", fallback: "Email" },
      { key: "messagePlaceholder", label: "Message field placeholder", fallback: "Message" },
      { key: "submitLabel", label: "Send button", fallback: "Send Message" },
      { key: "sendingLabel", label: "Sending state", fallback: "Sending..." },
      { key: "successLabel", label: "Success state", fallback: "Sent!" },
      { key: "errorLabel", label: "Error state", fallback: "Failed, please try again!" },
      { key: "socialHeading", label: "Social links heading", fallback: "Or find me at :" },
    ],
  },
];

export const SECTION_BY_KEY = Object.fromEntries(SECTION_DEFINITIONS.map((s) => [s.key, s])) as Record<
  SectionKey,
  SectionDefinition
>;

/** Placeholders for profile fields (shown on the site when empty). */
export const PROFILE_FALLBACK = {
  fullName: "Your Name",
  jobTitle: "Your Job Title",
  shortBio: "A short introduction about yourself goes here.",
  aboutDescription: "Tell visitors more about who you are and what you do.",
  cvFileName: "cv.pdf",
};

/** Placeholder image for missing logos / screenshots. */
export const PLACEHOLDER_IMAGE = "/unavailable.png";
