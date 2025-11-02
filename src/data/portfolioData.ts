export interface Project {
  title: string;
  images: string[];
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
  shortDescription: "Saya adalah seorang developer yang bersemangat dalam menciptakan aplikasi web yang intuitif dan menarik.",
  
  about: {
    description: "Dengan pengalaman di bidang pengembangan web, saya selalu antusias untuk belajar teknologi baru dan menerapkannya dalam proyek-proyek yang menantang. Saya percaya bahwa kombinasi antara kode yang bersih dan desain yang baik adalah kunci untuk menciptakan pengalaman digital yang luar biasa. Saat ini saya fokus pada ekosistem React, terutama dengan Next.js.",
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
      images: ['/image.png', '/image2.png'],
      githubUrl: "https://github.com/username/portfolio-nextjs",
    },
    {
      title: "Aplikasi E-Commerce",
      images: ['/image.png'],
      githubUrl: "https://github.com/username/ecommerce",
      liveUrl: "https://ecommerce-demo.com",
    }
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