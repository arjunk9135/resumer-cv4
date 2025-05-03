import { Candidate, TopCandidate, AnalyticsData } from '@/lib/types';

// Mock candidates data
export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    score: 92,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experience: 5,
    status: "For Interview",
    resumeUrl: "/resumes/john-doe.pdf",
    createdAt: "2023-04-12T09:30:00Z",
    updatedAt: "2023-04-12T09:30:00Z"
  },
  {
    id: 2,
    name: "Amanda Smith",
    email: "amanda.smith@example.com",
    phone: "+1 (555) 987-6543",
    score: 88,
    skills: ["Angular", "JavaScript", "MongoDB", "Express"],
    experience: 3,
    status: "New",
    resumeUrl: "/resumes/amanda-smith.pdf",
    createdAt: "2023-04-11T14:20:00Z",
    updatedAt: "2023-04-11T14:20:00Z"
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 456-7890",
    score: 65,
    skills: ["PHP", "MySQL", "WordPress", "jQuery"],
    experience: 2,
    status: "Rejected",
    rejectionReason: "Skill mismatch",
    rejectionNotes: "Candidate lacks experience in required technologies.",
    resumeUrl: "/resumes/michael-johnson.pdf",
    createdAt: "2023-04-10T11:15:00Z",
    updatedAt: "2023-04-13T10:45:00Z"
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 789-0123",
    score: 78,
    skills: ["Vue.js", "Python", "Django", "Docker"],
    experience: 4,
    status: "On Hold",
    resumeUrl: "/resumes/sarah-williams.pdf",
    createdAt: "2023-04-09T16:40:00Z",
    updatedAt: "2023-04-09T16:40:00Z"
  }
];

// Mock top candidates data
export const mockTopCandidates: TopCandidate[] = [
  {
    id: 2,
    name: "Amanda Smith",
    email: "amanda.smith@example.com",
    experience: 3,
    score: 88,
    skills: ["Angular", "JavaScript", "MongoDB", "Express"],
    highlights: ["Led a team of 5 developers", "Developed API integrations"],
    resumeUrl: "/resumes/amanda-smith.pdf"
  },
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    experience: 5,
    score: 92,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    highlights: ["Fullstack developer", "CI/CD expert"],
    resumeUrl: "/resumes/john-doe.pdf"
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    experience: 4,
    score: 78,
    skills: ["Vue.js", "Python", "Django", "Docker"],
    highlights: ["DevOps specialist", "Test-driven development"],
    resumeUrl: "/resumes/sarah-williams.pdf"
  }
];

// Mock analytics data
export const mockAnalyticsData: AnalyticsData = {
  totalCandidates: 4,
  skillsDistribution: [
    { name: "JavaScript", count: 3 },
    { name: "React", count: 2 },
    { name: "TypeScript", count: 2 },
    { name: "Node.js", count: 2 },
    { name: "MongoDB", count: 1 },
    { name: "Express", count: 1 },
    { name: "Angular", count: 1 },
    { name: "Vue.js", count: 1 },
    { name: "Python", count: 1 },
    { name: "PHP", count: 1 }
  ],
  scoreDistribution: [
    { range: "excellent", count: 1 },
    { range: "good", count: 2 },
    { range: "average", count: 1 },
    { range: "poor", count: 0 }
  ],
  experienceLevels: [
    { level: "junior", count: 1 },
    { level: "mid", count: 1 },
    { level: "senior", count: 2 },
    { level: "expert", count: 0 }
  ],
  statusDistribution: [
    { status: "New", count: 1 },
    { status: "For Interview", count: 1 },
    { status: "Rejected", count: 1 },
    { status: "On Hold", count: 1 }
  ]
};

// Mock user data
export const mockUser = {
  id: 1,
  username: "admin"
};