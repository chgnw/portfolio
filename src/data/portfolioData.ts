export interface Project {
  title: string;
  images: string[];
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Skill {
  name: string;
  icon: string;
  certificatePath?: string;
}

export const portfolioData = {
  name: "Christopher Gunawan",
  jobTitle: "Application Developer",
  shortDescription: "A passionate Full Stack Developer with a strong focus on building scalable, high-performance web applications. I turn complex ideas into seamless digital experiences that drive real results.",
  about: {
    description: "I’m a Full Stack Developer specializing in building end-to-end web applications using Node.js, Express, Next.js, and MySQL. I’m passionate about writing clean, maintainable code and designing systems that balance performance, scalability, and usability. With hands-on experience in both backend development and modern frontend frameworks, I focus on turning complex requirements into reliable, user-friendly solutions that deliver measurable value to businesses.",
    education: [
      {
        degree: "Bachelor of Computer Science",
        university: "Bina Nusantara University",
        year: "2022 - 2026",
        image: "/image.png"
      },
      {
        degree: "Ilmu Pengetahuan Alam (IPA)",
        university: "SMA Kristen Yusuf",
        year: "2020 - 2022",
        image: "/image.png"
      }
    ],
    experience: [
      {
        role: "Application Developer",
        company: "PT Hartono Istana Teknologi (Polytron)",
        period: "2025 - Now",
        status: "Intern",
        image: "/image.png"
      }
    ]
  },
  
  projects: [
    {
      title: "Personal Porfolio",
      description: "A personal portfolio website that allows me to showcase my projects and skills.",
      images: ['/image.png', '/image2.png'],
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
      githubUrl: "https://github.com/username/portfolio-nextjs",
    },
    {
      title: "Personal Porfolio",
      description: "A personal portfolio website that allows me to showcase my projects and skills.",
      images: ['/image.png', '/image2.png'],
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
      githubUrl: "https://github.com/username/portfolio-nextjs",
    },
    {
      title: "Personal Porfolio",
      description: "A personal portfolio website that allows me to showcase my projects and skills.",
      images: ['/image.png', '/image2.png'],
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
      githubUrl: "https://github.com/username/portfolio-nextjs",
    },
    {
      title: "Personal Porfolio",
      description: "A personal portfolio website that allows me to showcase my projects and skills.",
      images: ['/image.png', '/image2.png'],
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
      githubUrl: "https://github.com/username/portfolio-nextjs",
    },
  ] as Project[],
  
  skills: [
    { name: "TypeScript", icon: "/image.png", certificatePath: "/certs/typescript-cert.png" },
    { name: "Next.js", icon: "/image.png" },
    { name: "Tailwind CSS", icon: "/image.png", certificatePath: "/certs/path-salah.png" },
    { name: "Framer Motion", icon: "/image.png" },
  ] as Skill[],
  
  contacts: {
    email: "chngw14@gmail.com",
    phone: "+62 896 5757 8746",
    linkedin: "https://www.linkedin.com/in/chgnw/",
    github: "https://github.com/chgnw",
    instagram: "https://instagram.com/ch.gnw",
  }
};