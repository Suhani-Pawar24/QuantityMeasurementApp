package com.apps.model;

import com.apps.core.IMeasurable;

public class QuantityModel<U extends IMeasurable> {

    private double value;
    private U unit;

}
