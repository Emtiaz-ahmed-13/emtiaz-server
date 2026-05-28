import { z } from "zod";
import { optionalUrlField } from "../../shared/urlSchema";

const updateProfile = z.object({
  body: z.object({
    headline: z.string().min(2).optional(),
    bio: z.string().min(10).optional(),
    location: z.string().optional().nullable(),
    resumeUrl: optionalUrlField,
    avatarUrl: optionalUrlField,
    githubUrl: optionalUrlField,
    linkedinUrl: optionalUrlField,
    twitterUrl: optionalUrlField,
    websiteUrl: optionalUrlField,
    email: z.string().email().optional(),
    phone: z.string().optional().nullable(),
    available: z.boolean().optional(),
  }),
});

export const ProfileValidation = {
  updateProfile,
};
