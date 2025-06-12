package com.bpmnengine.negocio.repositorio.formulario;

import com.bpmnengine.negocio.entidad.formulario.TareaCabecera;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface TareaCabeceraRepository extends JpaRepository<TareaCabecera, Long> {
    List<TareaCabecera> findByProcesoKeyAndTaskDefinitionKeyOrderByOrdenAsc(String procesoKey, String taskDefinitionKey);
}
