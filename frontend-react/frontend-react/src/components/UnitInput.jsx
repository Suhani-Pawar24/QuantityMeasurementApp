import React, { useContext } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import { useUnits } from '../hooks/useUnits';
import '../styles/UnitInput.css';

export function UnitInput({ label, position }) {
  const { state, setFromValue, setToValue, setFromUnit, setToUnit } = useContext(MeasurementContext);
  const { units } = useUnits();

  const isFromInput = position === 'from';
  const value = isFromInput ? state.fromValue : state.toValue;
  const unit = isFromInput ? state.fromUnit : state.toUnit;

  const handleValueChange = (e) => {
    if (isFromInput) {
      setFromValue(e.target.value);
    } else {
      setToValue(e.target.value);
    }
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    if (newUnit) {
      if (isFromInput) {
        setFromUnit(newUnit);
      } else {
        setToUnit(newUnit);
      }
    }
  };

  return (
    <div className="unit-input-container">
      <label className="input-label">{label}</label>
      <div className="input-group">
        <input
          type="number"
          className="value-input"
          value={value}
          onChange={handleValueChange}
          placeholder="Enter value"
          step="any"
        />
        <select
          className="unit-select"
          value={unit}
          onChange={handleUnitChange}
        >
          <option value="">-- Select unit --</option>
          {units && units.length > 0 ? (
            units.map((u) => (
              <option key={u.id} value={u.symbol}>
                {u.label}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>
      </div>
    </div>
  );
}
