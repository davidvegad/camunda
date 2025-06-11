package com.bpmnengine.negocio.rest.formulario;

import com.bpmnengine.negocio.dto.formulario.TareaFormularioDto;
import com.bpmnengine.negocio.servicio.formulario.TareaFormularioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas-formularios")
@CrossOrigin(origins = "http://localhost:4200")
public class TareaFormularioRestController {

    @Autowired
    private TareaFormularioService service;

    // Listar todas las tareas asociadas a un formulario
    @GetMapping
    public List<TareaFormularioDto> listarPorFormulario(@RequestParam Long formularioId) {
        return service.findByFormularioId(formularioId);
    }

    // Crear una nueva asociación
    @PostMapping
    public TareaFormularioDto crear(@RequestBody TareaFormularioDto dto) {
        return service.save(dto);
    }

    // Eliminar una asociación
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}
