import { useState, useEffect, useCallback } from 'react';
import { historyAPI } from '../services/api';

export function useHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await historyAPI.getAll();
      // Backend returns QuantityMeasurementEntity[] with fields:
      // id, userId, operation, operand1, operand2, result, errorMessage
      const data = Array.isArray(response.data) ? response.data : [];
      // Map backend fields to display format
      const mapped = data.map((record) => ({
        id: record.id,
        type: record.operation || 'UNKNOWN',
        action: record.operation || 'UNKNOWN',
        expression: `${record.operand1 || ''} → ${record.operand2 || ''}`,
        result: record.result || '',
        timestamp: new Date().toISOString(), // Backend doesn't have timestamp
      }));
      setHistory(mapped);
      setError(null);
    } catch (err) {
      console.warn('Could not fetch history:', err.message);
      setHistory([]);
      setError(null); // Don't show error — history is non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // History saving is handled automatically by the measurement-service
  // via Feign when calculation endpoints are called.
  const saveHistory = useCallback(async () => {
    // No-op — backend auto-saves
  }, []);

  const deleteRecord = useCallback((id) => {
    // Remove from local display only (no backend DELETE endpoint)
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
  }, []);

  const refresh = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    saveHistory,
    deleteRecord,
    clearAll,
    refresh,
  };
}
