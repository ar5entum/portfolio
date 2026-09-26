"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, startTransition, useContext, useEffect, useRef, type ComponentProps, type MouseEvent } from "react";

type Resolver = { resolve: () => void } | null;
const Ctx = createContext<{ nav: (href: string) => void }>({ nav: () => {} });

/**
 * Wraps client navigations in document.startViewTransition so shared elements
 * (viewTransitionName) morph between routes. Falls back to a plain push.
 */
export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<Resolver>(null);

  // the new route has rendered: let the transition finish
  useEffect(() => {
    pending.current?.resolve();
    pending.current = null;
  }, [pathname]);

  const nav = (href: string) => {
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      router.push(href);
      return;
    }
    try {
      doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pending.current = { resolve };
            startTransition(() => router.push(href));
            // safety valve: never hang the document if the route stalls
            setTimeout(resolve, 1200);
          }),
      );
    } catch {
      router.push(href);
    }
  };

  return <Ctx.Provider value={{ nav }}>{children}</Ctx.Provider>;
}

export function TransitionLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const { nav } = useContext(Ctx);
  const h = typeof href === "string" ? href : href.pathname ?? "/";
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (/^https?:\/\//.test(h)) return;
    e.preventDefault();
    nav(h);
  };
  return <Link href={href} onClick={handle} {...rest} />;
}
