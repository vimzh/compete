import { useEffect, useState } from 'react';

/**
 * Fakes a fetch so the skeleton states are exercised. Replace the timer with
 * the real request state once there is an API behind the feed.
 */
export default function useMockLoad(delay = 900) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
}
