package com.bpmnengine.negocio.servicio.formulario;

import com.bpmnengine.negocio.dto.formulario.TareaFormularioDto;
import com.bpmnengine.negocio.entidad.formulario.TareaFormulario;
import com.bpmnengine.negocio.entidad.formulario.Formulario;
import com.bpmnengine.negocio.repositorio.formulario.TareaFormularioRepository;
import com.bpmnengine.negocio.repositorio.formulario.FormularioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TareaFormularioService {

    @Autowired
    private TareaFormularioRepository tareaFormularioRepository;

    @Autowired
    private FormularioRepository formularioRepository;

    public List<TareaFormularioDto> findByFormularioId(Long formularioId) {
        Formulario formulario = formularioRepository.findById(formularioId)
            .orElseThrow(() -> new IllegalArgumentException("Formulario no encontrado: " + formularioId));
        return tareaFormularioRepository.findByFormulario(formulario).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public TareaFormularioDto save(TareaFormularioDto dto) {
        TareaFormulario entidad = new TareaFormulario();
        if (dto.getId() != null) {
            entidad = tareaFormularioRepository.findById(dto.getId())
                .orElse(new TareaFormulario());
        }
        entidad.setProcesoKey(dto.getProcesoKey());
        entidad.setTaskDefinitionKey(dto.getTaskDefinitionKey());
        entidad.setOrdenTab(dto.getOrdenTab());
        Formulario formulario = formularioRepository.findById(dto.getFormularioId())
            .orElseThrow(() -> new IllegalArgumentException("Formulario no encontrado: " + dto.getFormularioId()));
        entidad.setFormulario(formulario);
        TareaFormulario guardado = tareaFormularioRepository.save(entidad);
        return toDto(guardado);
    }

    public void delete(Long id) {
        if (!tareaFormularioRepository.existsById(id)) {
            throw new IllegalArgumentException("No existe la asociación tarea-formulario: " + id);
        }
        tareaFormularioRepository.deleteById(id);
    }

    private TareaFormularioDto toDto(TareaFormulario entidad) {
        TareaFormularioDto dto = new TareaFormularioDto();
        dto.setId(entidad.getId());
        dto.setProcesoKey(entidad.getProcesoKey());
        dto.setTaskDefinitionKey(entidad.getTaskDefinitionKey());
        dto.setOrdenTab(entidad.getOrdenTab());
        dto.setFormularioId(entidad.getFormulario().getId());
        return dto;
    }
}
