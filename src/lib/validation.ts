import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const partnershipInquirySchema = z.object({
  organisationName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(120),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  message: z.string().min(10).max(4000),
});
export type PartnershipInquiryInput = z.infer<typeof partnershipInquirySchema>;

export const applicationSchema = z.object({
  cohortId: z.string().min(1, "Select a cohort"),
  personalInfo: z.object({
    fullName: z.string().min(2, "Required"),
    dateOfBirth: z.string().min(1, "Required"),
    gender: z.string().min(1, "Required"),
    stateOfOrigin: z.string().min(1, "Required"),
    stateOfResidence: z.string().min(1, "Required"),
    phone: z.string().min(6, "Required"),
  }),
  education: z.object({
    institution: z.string().min(2, "Required"),
    fieldOfStudy: z.string().min(2, "Required"),
    level: z.string().min(1, "Required"),
    graduationYear: z.string().min(4, "Required"),
  }),
  professionalBackground: z.object({
    currentStatus: z.string().min(1, "Required"),
    organisation: z.string().optional(),
    role: z.string().optional(),
  }),
  leadershipExperience: z.string().min(30, "Please share at least a few sentences"),
  communityInvolvement: z.string().min(30, "Please share at least a few sentences"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  motivation: z.string().min(50, "Please share at least a few sentences"),
  careerAspirations: z.string().min(30, "Please share at least a few sentences"),
  challenges: z.string().min(30, "Please share at least a few sentences"),
  programmeExpectations: z.string().min(30, "Please share at least a few sentences"),
  portfolioLinks: z.object({
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
    twitter: z.string().optional(),
  }),
  referenceContacts: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    contact: z.string().optional(),
  }),
  essayResponses: z.object({
    biggestAchievement: z.string().optional(),
    changeYouWantToSee: z.string().optional(),
  }),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const draftApplicationSchema = applicationSchema.partial().extend({
  cohortId: z.string().min(1, "Select a cohort"),
});
export type DraftApplicationInput = z.infer<typeof draftApplicationSchema>;
