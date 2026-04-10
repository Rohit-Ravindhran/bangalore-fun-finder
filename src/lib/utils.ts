import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

/** Builds the URL slug for an activity: "{title-slug}-{id}" */
export function activitySlug(title: string, id: string | number): string {
  const s = slugify(title)
  return s ? `${s}-${id}` : String(id)
}

/** Extracts the numeric DB id from an activity slug */
export function idFromSlug(slug: string): string {
  const parts = slug.split('-')
  return parts[parts.length - 1]
}
