package com.bpmnengine.negocio.rest.formulario;

import com.bpmnengine.negocio.dto.formulario.FormularioDto;
import com.bpmnengine.negocio.dto.formulario.RegistroFormularioRequest;
import com.bpmnengine.negocio.servicio.formulario.FormularioService;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;


import java.util.List;

@RestController
@RequestMapping("/api/formularios")
public class FormularioRestController {

    private final FormularioService formularioService;

    public FormularioRestController(FormularioService formularioService) {
        this.formularioService = formularioService;
    }

    @GetMapping("/tarea/{processKey}/{taskDefinitionKey}")
    public List<FormularioDto> obtenerFormulariosDeTarea(
        @PathVariable String processKey,
        @PathVariable String taskDefinitionKey
    ) {
        return formularioService.obtenerDtosFormulariosDeTarea(processKey, taskDefinitionKey);
    }
    @PostMapping("/registro")
    public ResponseEntity<?> registrarFormulario(@RequestBody RegistroFormularioRequest request) {
        formularioService.guardarRegistro(request);
        return ResponseEntity.ok().build();
    }
    
}
