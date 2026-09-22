import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Usá estos en lugar de los de next/link y next/navigation
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
