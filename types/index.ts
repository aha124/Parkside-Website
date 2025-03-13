export interface NavLink {
  href: string;
  label: string;
}

export interface FooterLinkGroups {
  quickLinks: NavLink[];
  resources: NavLink[];
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
  icon?: React.ReactNode;
}

export interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
} 