export type NowContent = {
  focus: string[];
  reading: string[];
  studying: string[];
  building: string[];
  updatedAt: string;
};

export type ServiceItem = {
  title: string;
  summary: string;
  deliverables: string[];
  timeline: string;
  engagementModel: string;
};

export type ToolkitEntry = {
  name: string;
  description: string;
  link?: string;
};

export type ToolkitSection = {
  title: string;
  items: ToolkitEntry[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
};
