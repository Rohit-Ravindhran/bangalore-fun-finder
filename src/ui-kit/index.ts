/**
 * ui-kit — the single import surface for basic UI atoms.
 *
 * Re-exports the shadcn/ui primitives (source of truth stays in
 * `@/components/ui/*`) alongside a few app-wide atoms. Prefer importing from
 * `@/ui-kit` in application code:
 *
 *   import { Button, Card, EmptyState, Pill } from '@/ui-kit';
 */

// ── shadcn primitives (re-exported) ───────────────────────────────
export { Button, buttonVariants, type ButtonProps } from '@/components/ui/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
export { Badge, badgeVariants, type BadgeProps } from '@/components/ui/badge';
export { Input } from '@/components/ui/input';
export { Textarea, type TextareaProps } from '@/components/ui/textarea';
export { Label } from '@/components/ui/label';
export { Separator } from '@/components/ui/separator';
export { Skeleton } from '@/components/ui/skeleton';

// ── app-wide atoms ────────────────────────────────────────────────
export { default as LoadingSpinner } from './atoms/LoadingSpinner';
export { default as EmptyState } from './atoms/EmptyState';
export { default as Pill } from './atoms/Pill';
export { default as SectionHeading } from './atoms/SectionHeading';
