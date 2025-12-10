// lib/social-media.ts

export type SocialMediaPlatform = "instagram" | "facebook" | "linkedin" | "tiktok" | "pinterest";

export interface SocialMedia {
  platform: SocialMediaPlatform;
  label: string;
  url: string;
  icon: React.ReactNode;
}

export const SOCIAL_MEDIA: Record<SocialMediaPlatform, Omit<SocialMedia, "icon">> = {
  instagram: {
    platform: "instagram",
    label: "Instagram",
    url: "https://instagram.com/purpledogfr", 
  },
  facebook: {
    platform: "facebook",
    label: "Facebook",
    url: "https://facebook.com/purpledogfr", 
  },
  linkedin: {
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/company/purpledogfr", 
  },
  tiktok: {
    platform: "tiktok",
    label: "TikTok",
    url: "https://tiktok.com/@purpledogfr", 
  },
  pinterest: {
    platform: "pinterest",
    label: "Pinterest",
    url: "https://pinterest.com/purpledogfr", 
  },
};

export const SOCIAL_MEDIA_LIST = Object.values(SOCIAL_MEDIA);
