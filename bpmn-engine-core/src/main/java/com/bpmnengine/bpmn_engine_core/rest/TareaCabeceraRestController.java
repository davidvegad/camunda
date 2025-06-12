package com.bpmnengine.bpmn_engine_core.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bpmnengine.negocio.dto.formulario.TareaCabeceraDto;
import com.bpmnengine.negocio.servicio.TareaCabeceraService;

@RestController
@RequestMapping("/api/tarea-cabecera")
@CrossOrigin(origins = "http://localhost:4200")
public class TareaCabeceraRestController {
    @Autowired
    private TareaCabeceraService service;

    @GetMapping
    public List<TareaCabeceraDto> getCabecera(
            @RequestParam String procesoKey,
            @RequestParam String taskDefinitionKey
    ) {
        return service.getCabecera(procesoKey, taskDefinitionKey);
    }
}
