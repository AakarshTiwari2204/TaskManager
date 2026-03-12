"use client";

import { usePathname } from "next/navigation";
import PageTransition from "./PageTransition";

interface ConditionalPageTransitionProps {
  children: React.ReactNode;
}

export default function ConditionalPageTransition({ children }: ConditionalPageTransitionProps) {
  const pathname = usePathname();
  
  // Don't apply transitions to auth pages to prevent black screen issues
  const authPages = ['/signin', '/signup'];
  const shouldTransition = !authPages.includes(pathname);

  if (shouldTransition) {
    return <PageTransition>{children}</PageTransition>;
  }

  return <>{children}</>;
}