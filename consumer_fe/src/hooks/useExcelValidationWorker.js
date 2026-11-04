import { useCallback, useEffect, useRef } from 'react';

function createRequestId() {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useExcelValidationWorker() {
  const workerRef = useRef(null);
  const pendingRef = useRef(new Map());

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;

    const worker = new Worker(
      new URL('../workers/excelValidation.worker.js', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = (event) => {
      const data = event.data || {};
      const { requestId, type } = data;
      if (!requestId) return;

      const pending = pendingRef.current.get(requestId);
      if (!pending) return;

      if (type === 'PROGRESS') {
        pending.onProgress?.(data);
        return;
      }

      if (type === 'ERROR') {
        pendingRef.current.delete(requestId);
        pending.reject(new Error(data.message || 'Worker failed.'));
        return;
      }

      pendingRef.current.delete(requestId);
      pending.resolve(data);
    };

    worker.onerror = (error) => {
      pendingRef.current.forEach((pending) => {
        pending.reject(new Error(error?.message || 'Excel worker crashed.'));
      });
      pendingRef.current.clear();
      workerRef.current = null;
    };

    workerRef.current = worker;
    return worker;
  }, []);

  const callWorker = useCallback(
    (type, payload = {}, { onProgress } = {}) => {
      const worker = ensureWorker();
      const requestId = createRequestId();

      return new Promise((resolve, reject) => {
        pendingRef.current.set(requestId, { resolve, reject, onProgress });
        if (payload?.arrayBuffer) {
          worker.postMessage({ type, requestId, payload }, [payload.arrayBuffer]);
        } else {
          worker.postMessage({ type, requestId, payload });
        }
      });
    },
    [ensureWorker],
  );

  const terminate = useCallback(() => {
    pendingRef.current.forEach((pending) => {
      pending.reject(new Error('Validation cancelled.'));
    });
    pendingRef.current.clear();
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const reset = useCallback(async () => {
    if (!workerRef.current) return;
    try {
      await callWorker('RESET');
    } catch {
      terminate();
    }
  }, [callWorker, terminate]);

  useEffect(() => () => terminate(), [terminate]);

  return {
    callWorker,
    reset,
    terminate,
  };
}
