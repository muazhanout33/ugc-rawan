export const SITE_META = {
  name: "Rewan Abdrabou",
  title: "Rewan Abdrabou | Professional UGC Creator & Videographer — Egypt",
  description:
    "Rewan Abdrabou is Egypt's premier UGC creator, videographer, and video editor. Specializing in high-converting cinematic content for medical clinics, healthcare centers, beauty brands, and lifestyle businesses in Shebeen El-Kom.",
  keywords:
    "UGC Creator Egypt, Rewan Abdrabou, Reel Creator Egypt, Video Editor Shebeen El-Kom, Content Creator Egypt, Medical Content Creator, Healthcare Videographer",
  url: "https://rewanabdrabou.com",
  email: "rewan@example.com",
  whatsapp: "+201000000000",
  instagram: "https://www.instagram.com/rewan__reel__ugc_creator?igsh=b2xndXJuMnlrdHVs",
  tiktok: "https://tiktok.com/@rewan",
  youtube: "https://youtube.com/@rewan",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "/about" },
  { label: "Client", href: "#clients" },
];

export const HERO_TITLES = [
  "UGC Creator",
  "Videographer",
  "Video Editor",
  "Short-form Content Creator",
];

export const SERVICES = [
  {
    id: "ugc",
    icon: "Video",
    title: "UGC Content Creation",
    description:
      "Authentic, high-converting user-generated content tailored to your brand voice and target audience. Made to stop the scroll.",
    tags: ["TikTok", "Instagram", "YouTube"],
  },
  {
    id: "reels",
    icon: "Film",
    title: "Reel Creation",
    description:
      "Cinematic short-form reels that captivate audiences and drive engagement. Trend-aware, brand-aligned, results-driven.",
    tags: ["Reels", "Short-form", "Viral"],
  },
  {
    id: "videography",
    icon: "Camera",
    title: "Videography",
    description:
      "Professional on-location video production for beauty centers, clinics, and lifestyle brands. Studio-quality storytelling.",
    tags: ["On-location", "Beauty", "Lifestyle"],
  },
  {
    id: "editing",
    icon: "Scissors",
    title: "Video Editing",
    description:
      "Expert post-production — color grading, motion graphics, sound design, and subtitles that elevate your raw footage.",
    tags: ["Premiere Pro", "CapCut", "Color Grade"],
  },
];

export const TRUSTED_MEDICAL_CENTERS = [
  {
    id: "elqaser",
    name: "ElQaser Center",
    logo: "/assets/elqaser-center.png",
    industry: "Beauty & Laser",
  },
  {
    id: "aroma",
    name: "Aroma Center",
    logo: "/assets/aroma-center.jpg",
    industry: "Beauty & Dermatology",
  },

  {
    id: "sky",
    name: "Sky Medical Center",
    logo: "/assets/sky-center.png",
    industry: "Dermatology & Laser",
  },
  {
    id: "queen",
    name: "Queen Clinic",
    logo: "/assets/queen-clinic.jpeg",
    industry: "Specialty — TBD",
  },
];

export const TRUSTED_DOCTORS = [
  { id: "d1", name: "Dr. Maha Helal", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d2", name: "Dr. Dina Ragab", specialty: "Consultant of Dermatology, Aesthetics & Laser" },
  { id: "d3", name: "Dr. Shaimaa Attia", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d4", name: "Dr. Shaimaa Bassiouny", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d5", name: "Dr. Esraa Gamal", specialty: "Consultant of Dermatology, Aesthetics & Laser" },
  { id: "d6", name: "Dr. Aya El Khatib", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d7", name: "Dr. Yasmin Abdo", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d8", name: "Dr. Hasnaa Hassan", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d9", name: "Dr. Asmaa El Habashy", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d10", name: "Dr. Dalia Nasef", specialty: "Dermatology, Aesthetics & Laser Specialist" },
  { id: "d11", name: "Dr. Safe Swelam", specialty: "" },
  { id: "d12", name: "Hager Alaa", specialty: "Skin Care Specialist" },
  { id: "d13", name: "Meena Fared", specialty: "Skin Care Specialist" },
];

export const TRUSTED_BRANDS = [
  {
    id: "scalaryx",
    name: "ScalaryX",
    logo: "/assets/scalaryx.jpeg",
    industry: "AI Automation & Marketing Services",
  },
];

export const CLIENTS = [
  ...TRUSTED_MEDICAL_CENTERS,
  ...TRUSTED_BRANDS,
];

export const SKILLS = {
  creative: [
    { name: "UGC Strategy", icon: "Target" },
    { name: "Storytelling", icon: "BookOpen" },
    { name: "Scripting", icon: "FileText" },
    { name: "Content Strategy", icon: "TrendingUp" },
  ],
  production: [
    { name: "Videography", icon: "Camera" },
    { name: "Lighting", icon: "Lightbulb" },
    { name: "Editing", icon: "Scissors" },
    { name: "Color Grading", icon: "Palette" },
    { name: "Motion Graphics", icon: "Sparkles" },
  ],
};

export const TOOLS = ["Adobe Premiere Pro", "CapCut"];

export type PortfolioItem = (typeof PORTFOLIO_ITEMS)[number];

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Aroma Beauty — Skincare Reel",
    client: "Aroma Center",
    category: "Medical Reels",
    thumbnail:
      "https://res.cloudinary.com/dvpnxbxkl/video/upload/so_1/v1784565667/aroma_wwxxzy.jpg",
    video:
      "https://res.cloudinary.com/dvpnxbxkl/video/upload/v1784565667/aroma_wwxxzy.mp4",
  },
  {
    id: 2,
    title: "Royal Palace — Brand Reveal",
    client: "Royal Palace Center",
    category: "Medical Reels",
    thumbnail:
      "https://res.cloudinary.com/dvpnxbxkl/video/upload/so_0/v1785017257/%D8%A7%D9%84%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D9%85%D9%84%D9%83%D9%8A1_n2vdr0.jpg",
    video:
      "https://res.cloudinary.com/dvpnxbxkl/video/upload/v1785017257/%D8%A7%D9%84%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D9%85%D9%84%D9%83%D9%8A1_n2vdr0.mp4",
  },
  {
    id: 3,
    title: "ScalaryX — Agency Promo",
    client: "ScalaryX",
    category: "Business Content",
    thumbnail:
      "https://res.cloudinary.com/dvpnxbxkl/video/upload/so_0/v1785017214/scalaryx_sqfeqb.jpg",
    video:
      "https://res.cloudinary.com/dvpnxbxkl/video/upload/v1785017214/scalaryx_sqfeqb.mp4",
  },
  {
    id: 4,
    title: "Sky Center — Laser Treatment",
    client: "Sky Center",
    category: "Medical Reels",
    thumbnail: "/assets/sky-center.png",
    video: "",
  },
  {
    id: 5,
    title: "Queen Clinic — Skincare Reel",
    client: "Queen Clinic",
    category: "Medical Reels",
    thumbnail: "/assets/queen-clinic.jpeg",
    video: "",
  },
];

export const PORTFOLIO_FILTERS = ["All", "Medical Reels", "Business Content"];
