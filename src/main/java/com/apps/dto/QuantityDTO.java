package com.apps.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class QuantityDTO {

    private double value;
    private String unit;

    // No-argument constructor
    public QuantityDTO() {
    }

    // Parameterized constructor
    public QuantityDTO(double value, String unit) {
        this.value = value;
        this.unit = unit;
    }

    // Getter for value
    public double getValue() {
        return value;
    }

    // Setter for value
    public void setValue(double value) {
        this.value = value;
    }

    // Getter for unit
    public String getUnit() {
        return unit;
    }

    // Setter for unit
    public void setUnit(String unit) {
        this.unit = unit;
    }

    @Override
    public String toString() {
        return "QuantityDTO{" +
                "value=" + value +
                ", unit='" + unit + '\'' +
                '}';
    }
}
