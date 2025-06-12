package com.bpmnengine.negocio.servicio;

import com.bpmnengine.negocio.repositorio.formulario.TareaCabeceraRepository;
import com.bpmnengine.negocio.dto.formulario.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TareaCabeceraService {
    @Autowired
    private TareaCabeceraRepository repo;

    public List<TareaCabeceraDto> getCabecera(String procesoKey, String taskDefinitionKey) {
        return repo.findByProcesoKeyAndTaskDefinitionKeyOrderByOrdenAsc(procesoKey, taskDefinitionKey)
            .stream()
            .map(c -> {
                TareaCabeceraDto dto = new TareaCabeceraDto();
                dto.setEtiqueta(c.getEtiqueta());
                dto.setNombreVariable(c.getNombreVariable());
                dto.setOrden(c.getOrden());
                return dto;
            })
            .toList();
    }
}
