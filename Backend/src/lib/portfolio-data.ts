export const profile = {
  name: "Yohannis Hailye",
  shortName: "Jo",
  username: "@jo9oct",
  role: "Full-Stack Developer & UI/UX Designer & Cybersecurity Enthusiast",
  tagline:
    "Transforming ideas into polished, user-friendly web experiences with modern design and development.",
  avatar: "./I.png",
  cv: "./Yohannis_Hailye_CV.pdf",
  email: "jops7326@gmail.com",
  phone: "+251973260091",
  location: "Addis Ababa, Ethiopia",
  telegram: "https://t.me/jo9oct",
  linkedin: "https://www.linkedin.com/in/jo9oct/",
  youtube: "https://www.youtube.com/@coderjo21",
  github: "https://github.com/jo9oct",
};

export const abilities = [
  "Full-Stack Developer",
  "UI/UX Designer",
  "React Developer",
  "Mobile App Developer",
  "Cloud & Serverless Developer",
  "Problem Solver",
  "Cybersecurity Enthusiast",
];

export const skillsList = ["React", "Express.js", "TailwindCSS", "Figma", "Next.js", "TypeScript", "JavaScript", "Node.js", "MongoDB", "MySQL", "Bootstrap"];

export const heroBio =
  "I build clean, high-performance web experiences, with a focus on full-stack development and exploration of machine learning.";

export const aboutFacts = [
  { label: "Experience", value: "2+ Years" },
  { label: "Projects", value: "10+" },
  { label: "Visitors", value: "—" },
  { label: "Coffee", value: "∞" },
];

export type Skill = { name: string; level: number };
export type SkillGroup = { name: string; items: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    name: "Frontend",
    items: [
      { name: "HTML / CSS ", level: 95 },
      { name: "JavaScript", level: 88 },
      { name: "TypeScript", level: 88 },
      { name: "TypeScript", level: 88 },
      { name: "React", level: 95 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Bootstrap", level: 80 },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", level: 90 },
      { name: "Express.js", level: 96 },
      { name: "REST APIs", level: 90 },
      { name: "ASP.NET", level: 70 },
      { name: "Laravel", level: 70 },
    ],
  },
  {
    name: "Databases",
    items: [
      { name: "MongoDB", level: 88 },
      { name: "MySQL", level: 80 },
      { name: "PostgreSQL", level: 75 },
    ],
  },
  {
    name: "Data & ML",
    items: [
      { name: "Python", level: 75 },
      { name: "Pandas / NumPy", level: 70 },
      { name: "TensorFlow", level: 60 },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Git", level: 92 },
      { name: "Docker", level: 78 },
      { name: "AWS", level: 70 },
      { name: "Figma", level: 88 },
      { name: "Zustand", level: 82 },
    ],
  },
  {
    name: "Mobile",
    items: [
      { name: "React Native", level: 82 },
      { name: "Expo", level: 80 },
    ],
  },
  {
    name: "Languages",
    items: [
      { name: "JavaScript", level: 88 },
      { name: "TypeScript", level: 88 },
      { name: "Python", level: 78 },
      { name: "C++", level: 70 },
      { name: "C", level: 70 },
      { name: "C#", level: 68 },
      { name: "Java", level: 60 },
      { name: "Dart", level: 55 },
    ],
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  category: string;
  github?: string;
  live?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Sentrix",
    description: "Full-stack Web Security Assessment Platform for automated website vulnerability scanning, attack surface discovery, security analysis, and detailed security reports. Features include multiple security scanners, scan management, and user dashboards.",
    tags: ["React", "TypeScript", "Express.js", "MongoDB", "Redis", "BullMQ", "Docker", "CI/CD"],
    category: "Full-Stack",
    live: "https://syntrix-kxx4.onrender.com/",
  },

  {
    title: "ReviewX",
    description: "Full-stack Automated Code Review Platform that analyzes source code for security vulnerabilities, bugs, code quality, and performance issues. Features include AI-powered explanations, suggested code fixes, security analysis, and PDF/JSON reports.",
    tags: ["React", "TypeScript", "TanStack Start", "Express.js", "MongoDB", "Redis", "Tailwind CSS", "Docker", "CI/CD"],
    category: "Full-Stack",
    live: "https://review-x-u6mr.vercel.app/",
  },
    {
    title: "Exam Web Design",
    description: "Designed entirely in Figma, utilizing Auto Layout, components, and interactive prototyping to simulate real-world user behavior.",
    tags: ["Figma"],
    category: "UX/UI Design",
    live: "https://www.figma.com/proto/dq7fWLBP58xlv00jWWMuoW/FreashmanEXAM?node-id=1-111&t=CnsnS3bt0CboCWLA-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=162%3A2065&show-proto-sidebar=1",
  },
    {
    title: "MovieHub",
    description:
      "Mobile app for browsing & booking — built with React Native, TypeScript and Expo. Full UI/UX design + implementation.",
    tags: ["React Native", "TypeScript", "Expo", "Bootstrap"],
    category: "Mobile",
    featured: true,
  },
  {
    title: "Hotel Menu",
    description: "Full-stack Hotel Menu solution with React, Node.js, Tailwind CSS and Mongodb. Features include user Order , admin dashboard.",
    tags: ["React", "Node.js", "Express.js", "Mongodb", "Bootstrap", "Zustand"],
    category: "Full-Stack",
    live: "https://hotel-menu-32.onrender.com",
  },
    {
    title: "E-Commerce Website",
    description: "Full-stack E-Commerce Website solution with Next.JS, RESTful API, Clerk, inngest and MongoDB. Features include Borrow Book ,dashboard and admin dashboard.",
    tags: ["Next.JS", "RESTful-API", "MongoDB", "Clerk"],
    category: "Full-Stack",
    live: "https://queck-chart-next.vercel.app/",
  },
  {
    title: "Car Rental System",
    description:
      "Full stack car-rental platform with authentication, booking flow, user and admin dashboards.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Docker"],
    category: "Full-Stack",
    featured: true,
  },
];

export const experience = [
  {
    role: "Full-Stack Developer",
    company: "Freelance & Client Work",
    period: "2024 — Present",
    description:
      "Built production web and mobile apps for startups and small businesses, focusing on React, Node.js, Express.js and clean user experience.",
  },
  {
    role: "UI/UX Designer",
    company: "Self-initiated projects",
    period: "2024 — Present",
    description:
      "Designed interfaces in Figma using auto-layout, components, and interactive prototypes before development.",
  },
  {
    role: "Cybersecurity Enthusiast",
    company: "INSA Training & Self-Directed Learning",
    period: "2026 — Present",
    description:
      "Developing practical cybersecurity skills through INSA training and independent hands-on labs, focusing on ethical hacking, network security, vulnerability assessment, and penetration testing.",
  },
];

export const education = [
  {
    school: "Debre Brhan University",
    degree: "B.Sc., Information System",
    period: "2023 — 2027",
    description:
      "Studied information systems with a focus on full-stack web development and modern design systems.",
  },
];