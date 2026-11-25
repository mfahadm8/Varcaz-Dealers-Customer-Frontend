import { useCallback, useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

export interface DraftNavigationControls {
  proceed: () => void;
  reset: () => void;
}

interface DraftNavigationBlockerProps {
  shouldBlock: () => boolean;
  onBlocked: (controls: DraftNavigationControls) => void;
}

/** Mount only for the active dirty/busy draft owner inside the data router. */
export function DraftNavigationBlocker({ shouldBlock, onBlocked }: DraftNavigationBlockerProps) {
  const predicate = useRef(shouldBlock);
  const notify = useRef(onBlocked);
  predicate.current = shouldBlock;
  notify.current = onBlocked;
  const blockedBefore = useRef<(() => void) | undefined>(undefined);
  const check = useCallback(() => predicate.current(), []);
  const blocker = useBlocker(check);

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      blockedBefore.current = undefined;
      return;
    }
    if (blockedBefore.current === blocker.proceed) return;
    blockedBefore.current = blocker.proceed;
    notify.current({ proceed: blocker.proceed, reset: blocker.reset });
  }, [blocker]);

  return null;
}
