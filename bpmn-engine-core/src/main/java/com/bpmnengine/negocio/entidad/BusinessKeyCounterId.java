package com.bpmnengine.negocio.entidad;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class BusinessKeyCounterId implements Serializable {
    private String processKey;
    private LocalDate fecha;

    public BusinessKeyCounterId() {}

    public BusinessKeyCounterId(String processKey, LocalDate fecha) {
        this.processKey = processKey;
        this.fecha = fecha;
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BusinessKeyCounterId)) return false;
        BusinessKeyCounterId that = (BusinessKeyCounterId) o;
        return Objects.equals(processKey, that.processKey) && Objects.equals(fecha, that.fecha);
    }

    @Override public int hashCode() {
        return Objects.hash(processKey, fecha);
    }
}
