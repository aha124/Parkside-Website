import { ReactNode } from "react";
import { ChorusType } from "@/data/chorusContent";

export interface NavLink {
  href: string;
  label: string;
}

export interface FooterLinkGroups {
  quickLinks: NavLink[];
  choruses: NavLink[];
  legal: NavLink[];
}

export interface TestimonialType {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface NewsItemType {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image?: string;
}

export interface FeatureType {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  chorus: ChorusType | 'both';
}

export interface LeaderType {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  chorus?: ChorusType | 'both';
}

export interface VideoType {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  date: string;
  chorus: ChorusType | 'both';
}

export interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
} 