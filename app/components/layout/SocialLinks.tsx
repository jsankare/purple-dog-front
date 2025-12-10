// app/components/layout/SocialLinks.tsx
"use client";

import Link from "next/link";
import { SOCIAL_MEDIA_LIST } from "@/lib/social-media";
import { JSX } from "react";

interface SocialLinksProps {
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export default function SocialLinks({ variant = "horizontal", size = "md" }: SocialLinksProps) {
  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const containerClasses = {
    horizontal: "flex items-center gap-4",
    vertical: "flex flex-col gap-3",
  };

  return (
    <div className={containerClasses[variant]}>
      {SOCIAL_MEDIA_LIST.map((social) => (
        <Link
          key={social.platform}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Suivez-nous sur ${social.label}`}
          className="group inline-flex items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95"
          style={{
            color: "var(--text)",
            opacity: 0.7,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
            (e.currentTarget as HTMLElement).style.color = "var(--brand)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.7";
            (e.currentTarget as HTMLElement).style.color = "var(--text)";
          }}
        >
          <SocialIcon platform={social.platform} className={iconSizeClasses[size]} />
        </Link>
      ))}
    </div>
  );
}

interface SocialIconProps {
  platform: string;
  className?: string;
}

function SocialIcon({ platform, className = "w-5 h-5" }: SocialIconProps) {
  const iconProps = { viewBox: "0 0 24 24", fill: "currentColor", className };

  const icons: Record<string, JSX.Element> = {
    instagram: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
      </svg>
    ),
    facebook: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    linkedin: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
    tiktok: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.66 1.94 2.89 2.89 0 0 1 5.66-1.93V9.4a6.84 6.84 0 0 0-5.66-2.82v-3.77a10.61 10.61 0 0 0 10.61 10.6 10.52 10.52 0 0 0 1.54-20.91z" />
      </svg>
    ),
    pinterest: (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z" />
        <path d="M12 8v8m-4-4h8" strokeWidth="1.5" stroke="currentColor" fill="none" />
      </svg>
    ),
  };

  return icons[platform] || null;
}
