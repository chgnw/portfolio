/**
 * Seeds the database with the original portfolio content and publishes it.
 *   npm run db:seed            (skips if content already exists)
 *   npm run db:seed -- --force (wipes content tables first; users are kept)
 *
 * Also creates the admin account when ADMIN_EMAIL / ADMIN_PASSWORD are set.
 */
import { db, writeBatch } from "../src/lib/db/client";
import { newId } from "../src/lib/ids";
import { SECTION_DEFINITIONS } from "../src/lib/content/registry";
import { portfolioDocumentSchema, type PortfolioDocument, type MediaItem } from "../src/lib/content/schema";
import { insertMedia, loadDocument, publishDocument, saveDocument } from "../src/lib/content/store";
import { loadEnv } from "./env";
import { migrate } from "./db-migrate";
import { upsertAdmin } from "./set-admin";

const CONTENT_TABLES = [
  "tr_publish_history", "tr_social_link", "tr_skill", "tr_project_detail", "tr_project_link", "tr_project_technology",
  "tr_project_image", "tr_project", "tr_education", "tr_experience", "ms_technology", "ms_employment_type",
  "ms_organization", "ms_site_text", "ms_section", "ms_profile", "ms_media",
];

async function main() {
  loadEnv();
  await migrate();
  const force = process.argv.includes("--force");
  const existing = await db().execute("SELECT COUNT(*) AS n FROM ms_profile WHERE bIsDeleted = 0");
  if (Number(existing.rows[0].n) > 0 && !force) {
    console.log("Content already exists — skipping seed (use --force to reset content).");
  } else {
    if (force) await writeBatch(CONTENT_TABLES.map((t) => `DELETE FROM ${t}`));
    await seedContent();
  }
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await upsertAdmin(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, process.env.ADMIN_NAME);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set — run `npm run admin:set` to create your login.");
  }
}

async function seedContent() {
  const actor = "SEED";
  const media: MediaItem[] = [];
  const mediaCache = new Map<string, string>();
  const asset = async (url: string) => {
    if (mediaCache.has(url)) return mediaCache.get(url)!;
    const ext = url.split(".").pop()!.toLowerCase();
    const mime = ext === "pdf" ? "application/pdf" : ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
    const item = await insertMedia({ fileName: url.split("/").pop()!, mimeType: mime, externalUrl: url }, actor);
    media.push(item);
    mediaCache.set(url, item.id);
    return item.id;
  };

  const texts: Record<string, Record<string, string>> = {
    global: {
      metaTitle: "CHNGNW - Portfolio",
      metaDescription: "Personal Portfolio of Christopher Gunawan",
      presentLabel: "Present",
    },
  };

  // --- master data -----------------------------------------------------------
  const org = async (name: string, logo: string) => ({ id: newId("organization"), isActive: true, name, websiteUrl: "", logoMediaId: await asset(logo) });
  const binus = await org("Bina Nusantara University", "/edu/binus.png");
  const sma = await org("SMA Kristen Yusuf", "/edu/sma.png");
  const polytron = await org("PT Hartono Istana Teknologi (Polytron)", "/exp/polytron.png");
  const intern = { id: newId("employmentType"), isActive: true, name: "Intern" };

  const technologies: PortfolioDocument["technologies"] = [];
  const tech = async (name: string, icon?: string) => {
    const found = technologies.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (found) {
      if (icon && !found.iconMediaId) found.iconMediaId = await asset(icon);
      return found.id;
    }
    const t = { id: newId("technology"), isActive: true, name, iconKey: null, iconMediaId: icon ? await asset(icon) : null };
    technologies.push(t);
    return t.id;
  };

  // --- skills ------------------------------------------------------------------
  const skillSeed: [string, string, string?][] = [
    ["HTML", "/icons/html.png"], ["TailwindCSS", "/icons/tailwind.png"], ["Express.js", "/icons/express.png"],
    ["Node.js", "/icons/node.png"], ["React.js", "/icons/react.png", "/certs/react-cert.png"], ["Next.js", "/icons/nextjs.png"],
    ["SQL", "/icons/mysql.png", "/certs/sql-cert.png"], ["RESTful API", "/icons/restapi.png"], ["C", "/icons/c.png"],
    ["Java", "/icons/java.png", "/certs/java-cert.png"], ["Python", "/icons/python.png"], ["Docker", "/icons/docker.png"],
    ["Git", "/icons/git.png"], ["Postman", "/icons/postman.png"],
  ];
  const skills: PortfolioDocument["skills"] = [];
  for (const [name, icon, cert] of skillSeed) {
    skills.push({ id: newId("skill"), isActive: true, technologyId: await tech(name, icon), certificateMediaId: cert ? await asset(cert) : null });
  }

  // --- projects ----------------------------------------------------------------
  const project = async (p: {
    title: string; summary: string; images: string[]; stack: string[]; github?: string; live?: string;
    background: string; process: string; reasoning: string;
  }): Promise<PortfolioDocument["projects"][number]> => ({
    id: newId("project"), isActive: true, title: p.title, summary: p.summary,
    images: await Promise.all(p.images.map(async (src) => ({ id: newId("projectImage"), mediaId: await asset(src) }))),
    technologies: await Promise.all(p.stack.map(async (name) => ({ id: newId("projectTechnology"), technologyId: await tech(name) }))),
    links: [
      ...(p.github ? [{ id: newId("projectLink"), label: "GitHub", url: p.github, iconKey: "fi:FiGithub", iconMediaId: null }] : []),
      ...(p.live ? [{ id: newId("projectLink"), label: "Live site", url: p.live, iconKey: "fi:FiExternalLink", iconMediaId: null }] : []),
    ],
    details: [
      { id: newId("projectDetail"), heading: "Background", body: p.background },
      { id: newId("projectDetail"), heading: "Process", body: p.process },
      { id: newId("projectDetail"), heading: "Tech Stack Reasoning", body: p.reasoning },
    ],
  });

  const projects = [
    await project({
      title: "Personal Porfolio",
      summary: "A personal portfolio website that allows me to showcase my projects and skills.",
      images: ["/proj/portfolio/portfolio-1.png", "/proj/portfolio/portfolio-2.png", "/proj/portfolio/portfolio-3.png"],
      stack: ["Next.js", "Tailwind CSS", "Framer Motion", "Emailjs"],
      github: "https://github.com/chgnw/portfolio",
      background: "As a full-stack developer, I needed a platform to showcase my work and skills to potential employers and clients. I wanted something that truly represents my personality and technical capabilities.",
      process: "Started with wireframing the design, then built the UI components with a focus on responsive design and smooth animations. Implemented a starfield background for visual appeal, integrated EmailJS for contact functionality, and optimized performance with Next.js 15.",
      reasoning: "Chose Next.js 15 for its excellent SEO, server-side rendering, and developer experience. Tailwind CSS for rapid, maintainable styling. Framer Motion for smooth, professional animations. EmailJS for serverless email handling without backend complexity.",
    }),
    await project({
      title: "SILAP",
      summary: "Digital Waste Management & Recycling Platform",
      images: [1, 2, 3, 4, 5, 6].map((n) => `/proj/silap/silap-${n}.png`),
      stack: ["Next.js", "MySQL", "REST APIs", "SSR", "JWT Auth"],
      live: "https://silap.my.id/",
      background: "Addressing the disconnect between household waste and recycling centers, SILAP was built to digitalize the waste management chain. The goal was to incentivize the 3R (Reduce, Reuse, Recycle) lifestyle by offering a tangible reward system (points/kg) and a seamless pickup service managed through a modern web platform.",
      process: "Architected a multi-role ecosystem involving Users and Driver Partners. I implemented complex business logic for waste valuation and point transactions using MySQL. The development focused on creating a responsive web interface for scheduling pickups and a management portal for drivers, integrating Public APIs for accurate location services.",
      reasoning: "Next.js (App Router) was selected to leverage Server-Side Rendering (SSR) for optimal performance and SEO. MySQL was crucial for maintaining strict data integrity in the relational database, ensuring accurate handling of user balances, transaction history, and driver-partner logistics.",
    }),
    await project({
      title: "Learnticle",
      summary: "A web collection of education articles to help students find related articles easily.",
      images: [1, 2, 3, 4].map((n) => `/proj/learnticle/learnticle-${n}.png`),
      stack: ["Laravel 11", "Tailwind CSS", "Breeze", "MySQL"],
      github: "https://github.com/chgnw/FinalProjectWebProg",
      background: "This was my final project for Web Programming course. Students often struggle to find quality educational content organized in one place. We wanted to create a centralized platform where educational articles are categorized and easily searchable.",
      process: "Set up Laravel with authentication using Breeze, designed a database schema for articles and categories, implemented CRUD operations with proper authorization, added search and filtering functionality, and created an admin panel for content management.",
      reasoning: "Laravel 11 for its elegant syntax, built-in authentication, and powerful ORM (Eloquent). MySQL for reliable relational data storage perfect for articles with categories and tags. Breeze for quick authentication scaffolding. Tailwind CSS for modern, responsive UI.",
    }),
  ];

  const doc: PortfolioDocument = {
    profile: {
      id: "PRF-MAIN",
      fullName: "Christopher Gunawan",
      jobTitle: "Application Developer",
      shortBio: "A passionate full-stack developer focused on building efficient web applications with Node.js, Express, Next.js, and MySQL. I enjoy writing clean, maintainable code and creating scalable, user-friendly systems that deliver real value.",
      aboutDescription: "I'm a Full Stack Developer specializing in building web applications using Node.js, Express, Next.js, and MySQL. I’m passionate about writing clean, maintainable code and designing systems that balance performance, scalability, and usability. With hands-on experience in both backend development and modern frontend frameworks, I focus on turning requirements into reliable, user-friendly solutions that deliver measurable value to businesses.",
      cvMediaId: await asset("/cv.pdf"),
      cvFileName: "cv-christopher-gunawan.pdf",
    },
    sections: SECTION_DEFINITIONS.map((def) => ({
      id: `SEC-${def.key.toUpperCase()}`,
      key: def.key,
      navLabel: def.defaultNavLabel,
      isActive: true,
      texts: texts[def.key] ?? Object.fromEntries(def.texts.map((t) => [t.key, t.fallback])),
    })),
    organizations: [binus, sma, polytron],
    employmentTypes: [intern],
    technologies,
    experiences: [{
      id: newId("experience"), isActive: true, organizationId: polytron.id, employmentTypeId: intern.id,
      roleTitle: "Application Developer", description: "", startDate: "2025", endDate: "", isCurrent: true, periodNote: "",
    }],
    educations: [
      { id: newId("education"), isActive: true, organizationId: binus.id, degree: "Bachelor of Computer Science", startDate: "2022", endDate: "", isCurrent: true, periodNote: "Expected Jan. 2026" },
      { id: newId("education"), isActive: true, organizationId: sma.id, degree: "Ilmu Pengetahuan Alam (IPA)", startDate: "2020", endDate: "2022", isCurrent: false, periodNote: "" },
    ],
    projects,
    skills,
    socialLinks: [
      { id: newId("socialLink"), isActive: true, displayName: "chgnw", url: "https://www.linkedin.com/in/chgnw/", iconKey: "fi:FiLinkedin", iconMediaId: null },
      { id: newId("socialLink"), isActive: true, displayName: "chgnw", url: "https://github.com/chgnw", iconKey: "fi:FiGithub", iconMediaId: null },
      { id: newId("socialLink"), isActive: true, displayName: "ch.gnw", url: "https://instagram.com/ch.gnw", iconKey: "fi:FiInstagram", iconMediaId: null },
    ],
    media,
  };

  const parsed = portfolioDocumentSchema.parse(doc);
  await saveDocument(parsed, actor);
  // Publish what was actually stored so draft and live hash identically.
  await publishDocument(await loadDocument(), actor, "Initial content");
  console.log("✔ seeded and published initial content");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
