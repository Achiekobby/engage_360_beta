import { useCallback, useEffect, useRef, useState } from 'react';

export const VALIDATION_IDLE = 'idle';
export const VALIDATION_VALIDATING = 'validating';
export const VALIDATION_SUCCESS = 'success';
export const VALIDATION_ERROR = 'error';

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls'];

function hasAcceptedExtension(fileName) {
  const lower = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function useCustomerListValidation() {
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);
  const [status, setStatus] = useState(VALIDATION_IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('./customerListWorker.js', import.meta.url), {
        type: 'module',
      });
    }
    return workerRef.current;
  }, []);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    },
    [],
  );

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setStatus(VALIDATION_IDLE);
    setResult(null);
    setError('');
  }, []);

  const validateFile = useCallback(
    async (file) => {
      if (!file) {
        reset();
        return;
      }

      if (!hasAcceptedExtension(file.name)) {
        requestIdRef.current += 1;
        setStatus(VALIDATION_ERROR);
        setResult(null);
        setError('Only Excel files (.xlsx or .xls) are supported.');
        return;
      }

      const requestId = ++requestIdRef.current;
      setStatus(VALIDATION_VALIDATING);
      setError('');
      setResult(null);

      try {
        const buffer = await file.arrayBuffer();
        const worker = getWorker();

        worker.onmessage = (event) => {
          if (requestId !== requestIdRef.current) return;

          const data = event.data || {};
          if (data.status === 'success') {
            setResult(data);
            setStatus(VALIDATION_SUCCESS);
          } else {
            setError(data.message || 'Could not validate this file.');
            setStatus(VALIDATION_ERROR);
          }
        };

        worker.onerror = () => {
          if (requestId !== requestIdRef.current) return;
          setError('Something went wrong while validating this file on the background thread.');
          setStatus(VALIDATION_ERROR);
        };

        worker.postMessage({ fileName: file.name, buffer }, [buffer]);
      } catch (readError) {
        if (requestId !== requestIdRef.current) return;
        setError(readError?.message || 'Could not read this file.');
        setStatus(VALIDATION_ERROR);
      }
    },
    [getWorker, reset],
  );

  return { status, result, error, validateFile, reset };
}
