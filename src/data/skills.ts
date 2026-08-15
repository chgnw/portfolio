export interface Skill {
  id: string;
  name: string;
  certificateUrl?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

const skills: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { id: 'html', name: 'HTML' },
      { id: 'javascript', name: 'JavaScript' },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'python', name: 'Python' },
      { id: 'java', name: 'Java', certificateUrl: 'https://...' },
      { id: 'c', name: 'C' },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    skills: [
      { id: 'react', name: 'React', certificateUrl: 'https://...' },
      { id: 'nextjs', name: 'Next.js' },
      { id: 'express', name: 'Express.js' },
      { id: 'tailwind', name: 'Tailwind CSS' },
      { id: 'react-native', name: 'React Native' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Platforms',
    skills: [
      { id: 'nodejs', name: 'Node.js' },
      { id: 'mysql', name: 'MySQL', certificateUrl: 'https://...' },
      { id: 'restapi', name: 'RESTful API' },
      { id: 'git', name: 'Git' },
      { id: 'docker', name: 'Docker' },
      { id: 'postman', name: 'Postman' },
    ],
  },
];

export default skills;
