"use client";

import { useEffect, useState } from "react";

/** True once document.fonts.ready resolves (or after a short timeout). */
export function useFontsReady(timeoutMs = 1500) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    const t = setTimeout(finish, timeoutMs);
    if (typeof document !== "undefined" && "fonts" in document) document.fonts.ready.then(finish);
    else finish();
    return () => clearTimeout(t);
  }, [timeoutMs]);
  return ready;
}
