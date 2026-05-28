import { z } from "zod";

/** Extract plain URL from markdown links like [text](https://...) */
export const normalizeUrlString = (value: string): string => {
  const trimmed = value.trim();
  const markdown = trimmed.match(/\[([^\]]*)\]\(([^)]+)\)/);
  if (markdown) return markdown[2].trim();
  return trimmed;
};

export const optionalUrlField = z.preprocess(
  (val) => {
    if (val === undefined) return undefined;
    if (val === null || val === "") return null;
    if (typeof val !== "string") return val;
    return normalizeUrlString(val);
  },
  z.union([z.string().url(), z.null()]).optional()
);
