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
  shortDescription: "A passionate full-stack developer focused on building efficient web applications with Node.js, Express, Next.js, and MySQL. I enjoy writing clean, maintainable code and creating scalable, user-friendly systems that deliver real value.",
  about: {
    description: "I'm a Full Stack Developer specializing in building web applications using Node.js, Express, Next.js, and MySQL. I’m passionate about writing clean, maintainable code and designing systems that balance performance, scalability, and usability. With hands-on experience in both backend development and modern frontend frameworks, I focus on turning requirements into reliable, user-friendly solutions that deliver measurable value to businesses.",
    education: [
      {
        degree: "Bachelor of Computer Science",
        university: "Bina Nusantara University",
        year: "2022 - Present (Expected Jan. 2026)",
        image: "/edu/binus.png"
      },
      {
        degree: "Ilmu Pengetahuan Alam (IPA)",
        university: "SMA Kristen Yusuf",
        year: "2020 - 2022",
        image: "/edu/sma.png"
      }
    ],
    experience: [
      {
        role: "Application Developer",
        company: "PT Hartono Istana Teknologi (Polytron)",
        period: "2025 - Present",
        status: "Intern",
        image: "/exp/polytron.png"
      }
    ]
  },
  
  projects: [
    {
      title: "Personal Porfolio",
      description: "A personal portfolio website that allows me to showcase my projects and skills.",
      images: ['/proj/portfolio/portfolio-1.png', '/proj/portfolio/portfolio-2.png', '/proj/portfolio/portfolio-3.png'],
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Emailjs"],
      githubUrl: "https://github.com/chgnw/portfolio",
    },
    {
      title: "Money Tracker",
      description: "A simple money tracker web-app to track daily expenses.",
      images: ['/proj/money-tracker/money-tracker-1.png', '/proj/money-tracker/money-tracker-2.png'],
      techStack: ["React.js", "Tailwind CSS", "MongoDB"],
      githubUrl: "https://github.com/chgnw/MoneyTracker",
    },
    {
      title: "Learnticle",
      description: "A web collection of education articles to help students find related articles easily.",
      images: ['/proj/learnticle/learnticle-1.png', '/proj/learnticle/learnticle-2.png', '/proj/learnticle/learnticle-3.png', '/proj/learnticle/learnticle-4.png'],
      techStack: ["Laravel 11", "Tailwind CSS", "Breeze", "MySQL"],
      githubUrl: "https://github.com/chgnw/FinalProjectWebProg",
    },
  ] as Project[],
  
  // Tambah object certificatePath: "/certs/" kalau ada certificate
  skills: [
    { name: "HTML", icon: "/icons/html.png" },
    { name: "TailwindCSS", icon: "/icons/tailwind.png" },
    { name: "Express.js", icon: "/icons/express.png" },
    { name: "Next.js", icon: "/icons/nextjs.png" },
    { name: "MySQL", icon: "/icons/mysql.png", certificatePath: "/certs/sql-cert.png" },
    { name: "RESTful API", icon: "/icons/restapi.png" },
    { name: "C", icon: "/icons/c.png" },
    { name: "Java", icon: "/icons/java.png", certificatePath: "/certs/java-cert.png" },
    { name: "Python", icon: "/icons/python.png" },
    { name: "Docker", icon: "/icons/docker.png" },
    { name: "Git", icon: "/icons/git.png" },
    { name: "Postman", icon: "/icons/postman.png" },
  ] as Skill[],
  
  contacts: {
    email: "chngw14@gmail.com",
    phone: "+62 896 5757 8746",
    linkedin: "https://www.linkedin.com/in/chgnw/",
    github: "https://github.com/chgnw",
    instagram: "https://instagram.com/ch.gnw",
  }
};