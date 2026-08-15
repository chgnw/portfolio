export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

const socialLinks: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/...', icon: 'linkedin.svg' },
  { id: 'github', label: 'GitHub', url: 'https://github.com/...', icon: 'github.svg' },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/...', icon: 'instagram.svg' },
];

export default socialLinks;
