export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  thumbnail?: string;
}

const projects: Project[] = [
  {
    id: 'silap',
    name: 'SILAP',
    description: 'A digital waste management and recycling platform built as a final thesis project. Handles pickup scheduling, recyclable weight tracking, and end-to-end process management through a role-based dashboard.',
    tags: ['Next.js', 'MySQL', 'REST APIs', 'SSR', 'JWT Auth'],
    links: [
      { label: '↗ Live site', url: 'https://...' },
      { label: '↗ GitHub', url: 'https://github.com/...' },
    ],
    thumbnail: 'silap-preview.png',
  },
  {
    id: 'kpi-logs',
    name: 'KPI Logs',
    description: 'A personal React Native app for tracking daily work hours, logging what was worked on each day, and managing next-day to-do lists. Built to solve a real personal need for work accountability.',
    tags: ['React Native', 'SQLite'],
    links: [
      { label: '↗ GitHub', url: 'https://github.com/...' },
    ],
    thumbnail: 'kpi-logs-preview.png',
  },
  {
    id: 'portfolio',
    name: 'Personal Portfolio',
    description: 'The site you\'re on right now. Built with React and TypeScript, designed around a calm "Night Reading Lamp" aesthetic with a glassmorphism design language throughout.',
    tags: ['React', 'TypeScript', 'Vite', 'CSS Modules'],
    links: [
      { label: '↗ GitHub', url: 'https://github.com/...' },
    ],
    thumbnail: 'portfolio-preview.png',
  },
];

export default projects;
