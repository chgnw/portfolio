export interface Education {
  id: string;
  institution: string;
  degree: string;
  years: string;
  note?: string;
}

const education: Education[] = [
  {
    id: 'binus',
    institution: 'Bina Nusantara University',
    degree: 'Bachelor of Computer Science',
    years: '2022 – 2026',
  },
  {
    id: 'sma',
    institution: 'SMA Kristen Yusuf',
    degree: 'Ilmu Pengetahuan Alam (IPA)',
    years: '2020 – 2022',
  },
];

export default education;
