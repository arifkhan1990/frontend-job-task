import { useCallback, useEffect, useState } from 'react';
import { apiRequest, formatApiError } from '../api/client.js';

export function useApi(path, { token, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    apiRequest(path, { token })
      .then((payload) => {
        if (!cancelled) {
          setData(payload?.data ?? null);
          setMeta(payload?.meta ?? null);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(formatApiError(requestError));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, token, enabled, version]);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  return { data, meta, loading, error, reload };
}
