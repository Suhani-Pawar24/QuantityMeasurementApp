import { useContext, useCallback } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import { measurementAPI } from '../services/api';

export function useConversion() {
  const context = useContext(MeasurementContext);
  const { state, setResult, setLoading, setError, clearError } = context;

  const calculate = useCallback(async () => {
    try {
      if (!state.fromValue || !state.fromUnit) {
        setError('Please enter a value and select a unit');
        return;
      }

      if (state.selectedAction !== 'Conversion' && !state.toValue) {
        setError('Please fill in all required fields');
        return;
      }

      if (!state.toUnit) {
        setError('Please select the target unit');
        return;
      }

      setLoading(true);
      clearError();

      let resultText = '';

      if (state.selectedAction === 'Conversion') {
        // Backend: POST /api/v1/quantities/convert/{targetUnit}
        const res = await measurementAPI.convert(
          parseFloat(state.fromValue),
          state.fromUnit,  // symbol = backend enum name
          state.toUnit     // symbol = backend enum name
        );
        resultText = `${res.value} ${state.toUnit}`;

      } else if (state.selectedAction === 'Comparison') {
        // Backend: POST /api/v1/quantities/compare — returns boolean
        const isEqual = await measurementAPI.compare(
          parseFloat(state.fromValue), state.fromUnit,
          parseFloat(state.toValue), state.toUnit
        );
        resultText = isEqual
          ? `${state.fromValue} ${state.fromUnit} equals ${state.toValue} ${state.toUnit}`
          : `${state.fromValue} ${state.fromUnit} does not equal ${state.toValue} ${state.toUnit}`;

      } else if (state.selectedAction === 'Arithmetic') {
        const v1 = parseFloat(state.fromValue);
        const v2 = parseFloat(state.toValue);

        if (state.operator === '+') {
          const res = await measurementAPI.add(v1, state.fromUnit, v2, state.toUnit);
          resultText = `${res.value} ${res.unit}`;
        } else if (state.operator === '-') {
          const res = await measurementAPI.subtract(v1, state.fromUnit, v2, state.toUnit);
          resultText = `${res.value} ${res.unit}`;
        } else if (state.operator === '/') {
          const res = await measurementAPI.divide(v1, state.fromUnit, v2, state.toUnit);
          resultText = String(res);
        }
      }

      if (resultText) {
        setResult(resultText);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message
        || (typeof error.response?.data === 'string' ? error.response.data : null)
        || error.message
        || 'Calculation failed';
      setError(errorMsg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [state, setResult, setLoading, setError, clearError]);

  return {
    calculate,
    isCalculating: state.isLoading,
    result: state.result,
  };
}
