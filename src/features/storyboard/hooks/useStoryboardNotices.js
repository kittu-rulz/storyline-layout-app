import { useCallback, useEffect, useState } from "react";

export function useStoryboardNotices(initialNotice = null, options = {}) {
  const autoDismissMs = options.autoDismissMs ?? 4500;
  const [appNotice, setAppNotice] = useState(() => initialNotice);

  const pushNotice = useCallback((tone, message) => {
    setAppNotice({
      id: `${tone}-${Date.now()}`,
      tone,
      message,
    });
  }, []);

  const dismissNotice = useCallback(() => {
    setAppNotice(null);
  }, []);

  useEffect(() => {
    if (!appNotice) return undefined;

    const timeoutId = window.setTimeout(() => {
      setAppNotice(null);
    }, autoDismissMs);

    return () => window.clearTimeout(timeoutId);
  }, [appNotice, autoDismissMs]);

  return {
    appNotice,
    pushNotice,
    dismissNotice,
  };
}
