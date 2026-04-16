import React, { useContext } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import '../styles/TypeSelector.css';

export function TypeSelector() {
  const { state, setType } = useContext(MeasurementContext);

  const types = [
    { id: 'LengthUnit', label: 'Length', icon: '📐' },
    { id: 'WeightUnit', label: 'Weight', icon: '⚖️' },
    { id: 'TemperatureUnit', label: 'Temperature', icon: '🌡️' },
    { id: 'VolumeUnit', label: 'Volume', icon: '🥤' },
  ];

  return (
    <div className="type-selector">
      <label className="selector-label">Choose Type</label>
      <div className="type-buttons">
        {types.map((type) => (
          <button
            key={type.id}
            className={`type-btn ${state.selectedType === type.id ? 'active' : ''}`}
            onClick={() => setType(type.id)}
          >
            <span className="type-icon">{type.icon}</span>
            <span className="type-name">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
