package com.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.core.LengthUnit;
import com.app.core.Quantity;
import com.app.core.TemperatureUnit;
import com.app.core.VolumeUnit;
import com.app.core.WeightUnit;
import com.app.dto.QuantityDTO; // ✅ FIXED IMPORT
import com.app.repository.QuantityMeasurementRepository;

@Service
public class QuantityMeasurementServiceImpl implements IQuantityMeasurementService {

    private Quantity<?> createQuantity(QuantityDTO dto) {

        try {
            return new Quantity<>(dto.getValue(), LengthUnit.valueOf(dto.getUnit()));
        } catch (Exception ignored) {}

        try {
            return new Quantity<>(dto.getValue(), WeightUnit.valueOf(dto.getUnit()));
        } catch (Exception ignored) {}

        try {
            return new Quantity<>(dto.getValue(), VolumeUnit.valueOf(dto.getUnit()));
        } catch (Exception ignored) {}

        try {
            return new Quantity<>(dto.getValue(), TemperatureUnit.valueOf(dto.getUnit()));
        } catch (Exception ignored) {}

        throw new IllegalArgumentException("Unsupported Unit: " + dto.getUnit());
    }

    @Override
    public boolean compare(QuantityDTO q1, QuantityDTO q2) {
        return createQuantity(q1).equals(createQuantity(q2));
    }

    @Override
    public QuantityDTO convert(QuantityDTO input, String targetUnit) {
        Quantity<?> quantity = createQuantity(input);
        return new QuantityDTO(quantity.getValue(), quantity.getUnit().toString());
    }

    @Override
    public QuantityDTO add(QuantityDTO q1, QuantityDTO q2) {
        Quantity<?> result = ((Quantity) createQuantity(q1)).add((Quantity) createQuantity(q2));
        return new QuantityDTO(result.getValue(), result.getUnit().toString());
    }

    @Override
    public QuantityDTO subtract(QuantityDTO q1, QuantityDTO q2) {
        Quantity<?> result = ((Quantity) createQuantity(q1)).subtract((Quantity) createQuantity(q2));
        return new QuantityDTO(result.getValue(), result.getUnit().toString());
    }

    @Override
    public double divide(QuantityDTO q1, QuantityDTO q2) {
        return ((Quantity) createQuantity(q1)).divide((Quantity) createQuantity(q2));
    }
}