package com.bpmnengine.negocio.rest.formulario;

import com.bpmnengine.negocio.dto.formulario.FormularioDto;
import com.bpmnengine.negocio.dto.formulario.RegistroFormularioRequest;
import com.bpmnengine.negocio.servicio.formulario.FormularioService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/formularios")
@CrossOrigin(origins = "http://localhost:4200")
public class FormularioRestController {

	@Autowired
	private final FormularioService formularioService;

	public FormularioRestController(FormularioService formularioService) {
		this.formularioService = formularioService;
	}

	@GetMapping("/tarea/{processKey}/{taskDefinitionKey}")
	public List<FormularioDto> obtenerFormulariosDeTarea(@PathVariable String processKey,
			@PathVariable String taskDefinitionKey) {
		return formularioService.obtenerDtosFormulariosDeTarea(processKey, taskDefinitionKey);
	}

	@PostMapping("/registro")
	public ResponseEntity<?> registrarFormulario(@RequestBody RegistroFormularioRequest request) {
		formularioService.guardarRegistro(request);
		return ResponseEntity.ok().build();
	}

	// Listar todos los formularios
	@GetMapping
	public List<FormularioDto> listarFormularios() {
		return formularioService.findAll();
	}

	// Obtener un formulario por su ID
	@GetMapping("/{id}")
	public FormularioDto obtenerFormulario(@PathVariable Long id) {
		return formularioService.findById(id);
	}

	// Crear un nuevo formulario
	@PostMapping
	public FormularioDto crearFormulario(@RequestBody FormularioDto dto) {
		return formularioService.save(dto);
	}

	// Actualizar un formulario existente
	@PutMapping("/{id}")
	public FormularioDto actualizarFormulario(@PathVariable Long id, @RequestBody FormularioDto dto) {
		dto.setId(id); // aseguramos que el id viene correcto
		return formularioService.save(dto);
	}

	// Eliminar un formulario
	@DeleteMapping("/{id}")
	public void eliminarFormulario(@PathVariable Long id) {
		formularioService.delete(id);
	}
	

}
