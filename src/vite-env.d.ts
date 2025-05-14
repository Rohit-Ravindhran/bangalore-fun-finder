
/// <reference types="vite/client" />

import { Activity as BaseActivity } from "@/components/ActivityCard";

declare module "@/components/ActivityCard" {
  interface Activity extends BaseActivity {
    url?: string;
  }
}
