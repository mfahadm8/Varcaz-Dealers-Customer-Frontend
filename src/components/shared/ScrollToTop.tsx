import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const previousLocationKey = useRef(key);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const isNewNavigation = previousLocationKey.current !== key;
    previousLocationKey.current = key;

    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({
          block: "start",
          behavior: "auto",
        });
      });
      return;
    }

    if (!isNewNavigation) return;

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    };

    // The destination's shared chrome mounts after navigation. Reset once
    // immediately and once after that layout frame so focus restoration or a
    // late compact-header measurement cannot leave the new page at its old
    // scroll offset.
    resetScroll();
    const firstFrame = window.requestAnimationFrame(() => {
      resetScroll();
      window.requestAnimationFrame(resetScroll);
    });

    return () => window.cancelAnimationFrame(firstFrame);
  }, [hash, key, pathname]);

  return null;
}

export default ScrollToTop;
