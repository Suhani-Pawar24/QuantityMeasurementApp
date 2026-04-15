package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.app.model.QuantityMeasurementEntity;
import com.app.repository.QuantityMeasurementRepository;
import java.util.List;

@RestController
@RequestMapping("/api/quantities")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QuantityHistoryController {

    @Autowired
    private QuantityMeasurementRepository repository;

    // ================= HISTORY (Non-versioned API) =================

    @GetMapping("/history")
    public List<QuantityMeasurementEntity> getHistory() {
        return repository.findAll();
    }

    @GetMapping("/history/{operation}")
    public List<QuantityMeasurementEntity> getHistoryByOperation(@PathVariable String operation) {
        return repository.findByOperation(operation);
    }
}
