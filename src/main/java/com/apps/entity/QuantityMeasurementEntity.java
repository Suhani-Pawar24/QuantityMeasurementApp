package com.apps.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class QuantityMeasurementEntity {

    private String operation;
    private String input1;
    private String input2;
    private String result;
    private String timestamp;

    // No-argument constructor
    public QuantityMeasurementEntity() {
    }

    // Parameterized constructor
    public QuantityMeasurementEntity(String operation, String input1, String input2, String result, String timestamp) {
        this.operation = operation;
        this.input1 = input1;
        this.input2 = input2;
        this.result = result;
        this.timestamp = timestamp;
    }

    // Getter and Setter for operation
    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    // Getter and Setter for input1
    public String getInput1() {
        return input1;
    }

    public void setInput1(String input1) {
        this.input1 = input1;
    }

    // Getter and Setter for input2
    public String getInput2() {
        return input2;
    }

    public void setInput2(String input2) {
        this.input2 = input2;
    }

    // Getter and Setter for result
    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    // Getter and Setter for timestamp
    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "QuantityMeasurementEntity{" +
                "operation='" + operation + '\'' +
                ", input1='" + input1 + '\'' +
                ", input2='" + input2 + '\'' +
                ", result='" + result + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}