export interface Project {
  title: string;
  images: string[];
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  details: {
    background: string;
    process: string;
    techReasoning: string;
  };
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
      images: [
        '/proj/portfolio/portfolio-1.png', 
        '/proj/portfolio/portfolio-2.png', 
        '/proj/portfolio/portfolio-3.png'
      ],
      techStack: [
        "Next.js", 
        "Tailwind CSS", 
        "Framer Motion", 
        "Emailjs"
      ],
      githubUrl: "https://github.com/chgnw/portfolio",
      details: {
        background: "As a full-stack developer, I needed a platform to showcase my work and skills to potential employers and clients. I wanted something that truly represents my personality and technical capabilities.",
        process: "Started with wireframing the design, then built the UI components with a focus on responsive design and smooth animations. Implemented a starfield background for visual appeal, integrated EmailJS for contact functionality, and optimized performance with Next.js 15.",
        techReasoning: "Chose Next.js 15 for its excellent SEO, server-side rendering, and developer experience. Tailwind CSS for rapid, maintainable styling. Framer Motion for smooth, professional animations. EmailJS for serverless email handling without backend complexity."
      }
    },
    {
      title: "SILAP",
      description: "Digital Waste Management & Recycling Platform",
      techStack: [
        "Next.js", 
        "MySQL", 
        "REST APIs", 
        "SSR", 
        "JWT Auth"
      ],
      images: [
        '/proj/silap/silap-1.png', 
        '/proj/silap/silap-2.png', 
        '/proj/silap/silap-3.png', 
        '/proj/silap/silap-4.png', 
        '/proj/silap/silap-5.png', 
        '/proj/silap/silap-6.png'
      ],
      liveUrl: "https://silap.my.id/",
      details: {
        background: "Addressing the disconnect between household waste and recycling centers, SILAP was built to digitalize the waste management chain. The goal was to incentivize the 3R (Reduce, Reuse, Recycle) lifestyle by offering a tangible reward system (points/kg) and a seamless pickup service managed through a modern web platform.",
        process: "Architected a multi-role ecosystem involving Users and Driver Partners. I implemented complex business logic for waste valuation and point transactions using MySQL. The development focused on creating a responsive web interface for scheduling pickups and a management portal for drivers, integrating Public APIs for accurate location services.",
        techReasoning: "Next.js (App Router) was selected to leverage Server-Side Rendering (SSR) for optimal performance and SEO. MySQL was crucial for maintaining strict data integrity in the relational database, ensuring accurate handling of user balances, transaction history, and driver-partner logistics."
      }
    },
    {
      title: "Learnticle",
      description: "A web collection of education articles to help students find related articles easily.",
      images: [
        '/proj/learnticle/learnticle-1.png', 
        '/proj/learnticle/learnticle-2.png', 
        '/proj/learnticle/learnticle-3.png', 
        '/proj/learnticle/learnticle-4.png'
      ],
      techStack: [
        "Laravel 11", 
        "Tailwind CSS", 
        "Breeze", 
        "MySQL"
      ],
      githubUrl: "https://github.com/chgnw/FinalProjectWebProg",
      details: {
        background: "This was my final project for Web Programming course. Students often struggle to find quality educational content organized in one place. We wanted to create a centralized platform where educational articles are categorized and easily searchable.",
        process: "Set up Laravel with authentication using Breeze, designed a database schema for articles and categories, implemented CRUD operations with proper authorization, added search and filtering functionality, and created an admin panel for content management.",
        techReasoning: "Laravel 11 for its elegant syntax, built-in authentication, and powerful ORM (Eloquent). MySQL for reliable relational data storage perfect for articles with categories and tags. Breeze for quick authentication scaffolding. Tailwind CSS for modern, responsive UI."
      }
    },
  ] as Project[],

  // Tambah object certificatePath: "/certs/" kalau ada certificate
  skills: [
    { name: "HTML", icon: "/icons/html.png" },
    { name: "TailwindCSS", icon: "/icons/tailwind.png" },
    { name: "Express.js", icon: "/icons/express.png" },
    { name: "Node.js", icon: "/icons/node.png" },
    { name: "React.js", icon: "/icons/react.png", certificatePath: "/certs/react-cert.png" },
    { name: "Next.js", icon: "/icons/nextjs.png" },
    { name: "SQL", icon: "/icons/mysql.png", certificatePath: "/certs/sql-cert.png" },
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