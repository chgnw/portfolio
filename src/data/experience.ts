export interface Experience {
  id: string;
  company: string;
  role: string;
  dateRange: string;
  isCurrent: boolean;
  hook: string;
  contributions: string[];
}

const experience: Experience[] = [
  {
    id: 'bosnet',
    company: 'PT Bosnet Distribution Indonesia',
    role: 'Software Engineer',
    dateRange: 'April 2026 – Present',
    isCurrent: true,
    hook: '[1–2 sentence hook about what you build here. Fill this in.]',
    contributions: [
      '[Contribution bullet 1]',
      '[Contribution bullet 2]',
      '[Contribution bullet 3]',
    ],
  },
  {
    id: 'polytron',
    company: 'PT Hartono Istana Teknologi (Polytron)',
    role: 'Application Developer Intern',
    dateRange: 'February 2025 – February 2026',
    isCurrent: false,
    hook: 'Developed and maintained internal applications supporting business operations. Worked across the full stack using Node.js, Express, and Next.js, translating business requirements into working systems.',
    contributions: [
      '[Contribution bullet 1]',
      '[Contribution bullet 2]',
      '[Contribution bullet 3]',
    ],
  },
];

export default experience;
