import { create } from "zustand";

type Milestone = {
  date: string;
  title: string;
  description: string;
};

type AboutState = {
  milestones: Milestone[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  journeyInView: boolean;
  setJourneyInView: (v: boolean) => void;
};

export const useAbout = create<AboutState>((set) => ({
  milestones: [
    {
      date: "October 2024",
      title: "First Project: SOS",
      description:
        "We began our journey with the launch of Sankatmochan Outreach Service (SOS), a social-impact platform connecting NGOs, businesses, and communities.",
    },
    {
      date: "March 2025",
      title: "First Fintech Research Publication",
      description:
        "Our team published its first fintech research paper, exploring innovative models for digital finance and global monetary systems.",
    },
    {
      date: "July 2025",
      title: "First Subsidiary: Webstitch",
      description:
        "We established Webstitch, focused on web development and digital services to support businesses and individuals.",
    },
    {
      date: "August 2025",
      title: "Birth of Trinix Private Limited",
      description:
        "Recognizing the growing scale of our initiatives, we founded Trinix Private Limited as the parent company unifying projects and subsidiaries under one vision.",
    },
    {
      date: "September 2025",
      title: "Second Fintech Research Publication",
      description:
        "We released our second fintech research paper, furthering our contributions to innovative financial technologies and research-driven solutions.",
    },
  ],
  activeIndex: 0,
  setActiveIndex: (i) => set({ activeIndex: i }),
  journeyInView: false,
  setJourneyInView: (v) => set({ journeyInView: v }),
}));

