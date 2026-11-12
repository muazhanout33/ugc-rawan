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
  { label: "Contact", href: "#contact" },
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
    instagram: "https://www.instagram.com/elqaser.center/",
  },
  {
    id: "aroma",
    name: "Aroma Center",
    logo: "/assets/aroma-center.jpg",
    industry: "Beauty & Dermatology",
    instagram: "https://www.instagram.com/aroma.center1/",
  },

  {
    id: "sky",
    name: "Sky Medical Center",
    logo: "/assets/sky-center.png",
    industry: "Dermatology & Laser",
    instagram: "https://www.instagram.com/sky_center2025/",
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
    instagram: "https://www.instagram.com/scalary_x/",
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

export const TOOLS = [
  "Adobe Premiere Pro",
  "CapCut",
];

export interface PortfolioVideo {
  id: string;
  playbackId: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  aspectRatio: string;
}

export const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  {
    id: "01",
    playbackId: "eM6gIk022AsNrz1Im7KBbKcC7X02DNDr3FHzzW6GDrjPo",
    videoUrl: "https://player.mux.com/eM6gIk022AsNrz1Im7KBbKcC7X02DNDr3FHzzW6GDrjPo",
    thumbnailUrl: "https://image.mux.com/eM6gIk022AsNrz1Im7KBbKcC7X02DNDr3FHzzW6GDrjPo/thumbnail.jpg?time=2&width=600",
    title: "Project 01",
    aspectRatio: "9:16",
  },
  {
    id: "02",
    playbackId: "n9uRJLxajkCxyeustRq4L02YAiuOHhDsK8RuhmTLFTxk",
    videoUrl: "https://player.mux.com/n9uRJLxajkCxyeustRq4L02YAiuOHhDsK8RuhmTLFTxk",
    thumbnailUrl: "https://image.mux.com/n9uRJLxajkCxyeustRq4L02YAiuOHhDsK8RuhmTLFTxk/thumbnail.jpg?time=2&width=600",
    title: "Project 02",
    aspectRatio: "9:16",
  },
  {
    id: "03",
    playbackId: "AcNIFwCzyypzm8SrDdrhYFVHMKdu1ihfeleSSDiQOSg",
    videoUrl: "https://player.mux.com/AcNIFwCzyypzm8SrDdrhYFVHMKdu1ihfeleSSDiQOSg",
    thumbnailUrl: "https://image.mux.com/AcNIFwCzyypzm8SrDdrhYFVHMKdu1ihfeleSSDiQOSg/thumbnail.jpg?time=3&width=600",
    title: "Project 03",
    aspectRatio: "9:16",
  },
  {
    id: "04",
    playbackId: "U02vcDKD2TVWU7Oq4PLEsHoDiRPeLx401AjktEMBnBnM00",
    videoUrl: "https://player.mux.com/U02vcDKD2TVWU7Oq4PLEsHoDiRPeLx401AjktEMBnBnM00",
    thumbnailUrl: "https://image.mux.com/U02vcDKD2TVWU7Oq4PLEsHoDiRPeLx401AjktEMBnBnM00/thumbnail.jpg?time=1&width=600",
    title: "Project 04",
    aspectRatio: "9:16",
  },
  {
    id: "05",
    playbackId: "p1yqMcHR00w01VgL1to613yZrVt01ylwzso1bV6RVxI56Y",
    videoUrl: "https://player.mux.com/p1yqMcHR00w01VgL1to613yZrVt01ylwzso1bV6RVxI56Y",
    thumbnailUrl: "https://image.mux.com/p1yqMcHR00w01VgL1to613yZrVt01ylwzso1bV6RVxI56Y/thumbnail.jpg?time=2&width=600",
    title: "Project 05",
    aspectRatio: "9:16",
  },
  {
    id: "06",
    playbackId: "olmMwM9mZMhnYTUVt1uCuqPQ7saIfIty7ekZT7XxDGI",
    videoUrl: "https://player.mux.com/olmMwM9mZMhnYTUVt1uCuqPQ7saIfIty7ekZT7XxDGI",
    thumbnailUrl: "https://image.mux.com/olmMwM9mZMhnYTUVt1uCuqPQ7saIfIty7ekZT7XxDGI/thumbnail.jpg?time=2&width=600",
    title: "Project 06",
    aspectRatio: "9:16",
  },
  {
    id: "07",
    playbackId: "mhF6NEHe2waWxvwUwFa6CuLNEKxRqt5004eonChn3nYw",
    videoUrl: "https://player.mux.com/mhF6NEHe2waWxvwUwFa6CuLNEKxRqt5004eonChn3nYw",
    thumbnailUrl: "https://image.mux.com/mhF6NEHe2waWxvwUwFa6CuLNEKxRqt5004eonChn3nYw/thumbnail.jpg?time=2&width=600",
    title: "Project 07",
    aspectRatio: "9:16",
  },
  {
    id: "08",
    playbackId: "uA4xhBhmNqKa6Zu7S8BjvB9m7E013WoQcfkVKwMNaguY",
    videoUrl: "https://player.mux.com/uA4xhBhmNqKa6Zu7S8BjvB9m7E013WoQcfkVKwMNaguY",
    thumbnailUrl: "https://image.mux.com/uA4xhBhmNqKa6Zu7S8BjvB9m7E013WoQcfkVKwMNaguY/thumbnail.jpg?time=2&width=600",
    title: "Project 08",
    aspectRatio: "9:16",
  },
  {
    id: "09",
    playbackId: "b6MYG5DYlLD8uyhuYGJsEJ8fo8Gxdb01B9sHUly01zhxw",
    videoUrl: "https://player.mux.com/b6MYG5DYlLD8uyhuYGJsEJ8fo8Gxdb01B9sHUly01zhxw",
    thumbnailUrl: "https://image.mux.com/b6MYG5DYlLD8uyhuYGJsEJ8fo8Gxdb01B9sHUly01zhxw/thumbnail.jpg?time=2&width=600",
    title: "Project 09",
    aspectRatio: "9:16",
  },
];

export const PORTFOLIO_ITEMS = PORTFOLIO_VIDEOS;
export type PortfolioItem = PortfolioVideo;

export const PORTFOLIO_FILTERS = ["All", "Medical Reels", "Business Content"];
