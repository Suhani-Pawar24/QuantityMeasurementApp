import { useContext, useEffect } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';

// Unit labels matching backend enum names EXACTLY
const UNITS = {
  LengthUnit: [
    { id: 1, symbol: 'FEET', label: 'Feet (ft)' },
    { id: 2, symbol: 'INCHES', label: 'Inches (in)' },
    { id: 3, symbol: 'YARDS', label: 'Yards (yd)' },
    { id: 4, symbol: 'CENTIMETERS', label: 'Centimeters (cm)' },
  ],
  WeightUnit: [
    { id: 5, symbol: 'GRAM', label: 'Gram (g)' },
    { id: 6, symbol: 'KILOGRAM', label: 'Kilogram (kg)' },
    { id: 7, symbol: 'TONNE', label: 'Tonne (t)' },
  ],
  TemperatureUnit: [
    { id: 8, symbol: 'CELSIUS', label: 'Celsius (°C)' },
    { id: 9, symbol: 'FAHRENHEIT', label: 'Fahrenheit (°F)' },
    { id: 10, symbol: 'KELVIN', label: 'Kelvin (K)' },
  ],
  VolumeUnit: [
    { id: 11, symbol: 'LITRE', label: 'Litre (L)' },
    { id: 12, symbol: 'GALLON', label: 'Gallon (gal)' },
    { id: 13, symbol: 'MILLILITRE', label: 'Millilitre (mL)' },
  ],
};

export function useUnits() {
  const { state, setUnits, setLoading } = useContext(MeasurementContext);

  useEffect(() => {
    setLoading(true);
    const units = UNITS[state.selectedType] || [];
    setUnits(units);
    setLoading(false);
  }, [state.selectedType, setUnits, setLoading]);

  return {
    units: state.units,
    isLoading: state.isLoading,
    error: state.error,
  };
}
