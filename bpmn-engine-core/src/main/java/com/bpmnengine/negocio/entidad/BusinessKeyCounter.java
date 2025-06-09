package com.bpmnengine.negocio.entidad;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "business_key_counter")
@IdClass(BusinessKeyCounterId.class)
public class BusinessKeyCounter {

    @Id
    private String processKey;

    @Id
    private LocalDate fecha;

    private int contador;

    public BusinessKeyCounter() {}

    public BusinessKeyCounter(String processKey, LocalDate fecha, int contador) {
        this.processKey = processKey;
        this.fecha = fecha;
        this.contador = contador;
    }

    // Getters y setters
    public int getContador() {
        return contador;
    }

    public void setContador(int contador) {
        this.contador = contador;
    }

}
