package com.bpmnengine.negocio.rest.formulario;

import com.bpmnengine.negocio.dto.formulario.CampoDto;
import com.bpmnengine.negocio.servicio.formulario.CampoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campos")
public class CampoRestController {

    @Autowired
    private CampoService campoService;

    /** Listar todos los campos */
    @GetMapping
    public List<CampoDto> listarCampos() {
        return campoService.findAll();
    }

    /** Obtener un campo por ID */
    @GetMapping("/{id}")
    public CampoDto obtenerCampo(@PathVariable Long id) {
        return campoService.findById(id);
    }

    /** Crear un nuevo campo */
    @PostMapping
    public CampoDto crearCampo(@RequestBody CampoDto dto) {
        return campoService.save(dto);
    }

    /** Actualizar un campo existente */
    @PutMapping("/{id}")
    public CampoDto actualizarCampo(@PathVariable Long id, @RequestBody CampoDto dto) {
        dto.setId(id); // Aseguramos que el ID coincida
        return campoService.save(dto);
    }

    /** Eliminar un campo */
    @DeleteMapping("/{id}")
    public void eliminarCampo(@PathVariable Long id) {
        campoService.delete(id);
    }
}
