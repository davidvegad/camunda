package com.bpmnengine.negocio.servicio.formulario;

import com.bpmnengine.negocio.dto.formulario.FormularioCampoDto;
import com.bpmnengine.negocio.dto.formulario.FormularioDto;
import com.bpmnengine.negocio.dto.formulario.RegistroFormularioRequest;
import com.bpmnengine.negocio.entidad.formulario.*;
import com.bpmnengine.negocio.repositorio.formulario.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;


import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;


@Service
public class FormularioService {
    @Autowired
    private TareaFormularioRepository tareaFormularioRepository;
    @Autowired
    private FormularioRepository formularioRepository;
    @Autowired
    private FormularioCampoRepository formularioCampoRepository;
    @Autowired
    private CampoRepository campoRepository;
    @Autowired
    private FormularioRegistroRepository formularioRegistroRepository;

    // Obtener todos los formularios (y sus campos) asociados a una tarea Camunda
    public List<TareaFormulario> obtenerFormulariosDeTarea(String procesoKey, String taskDefinitionKey) {
        return tareaFormularioRepository.findByProcesoKeyAndTaskDefinitionKeyOrderByOrdenTabAsc(procesoKey, taskDefinitionKey);
    }

    // Guardar registro llenado por usuario
    public FormularioRegistro guardarRegistro(FormularioRegistro registro) {
        return formularioRegistroRepository.save(registro);
    }
    
    public FormularioRegistro guardarRegistro(RegistroFormularioRequest dto) {
        FormularioRegistro registro = new FormularioRegistro();

        // Cambia esta línea:
        // registro.setFormularioId(dto.getFormularioId());
        // Por estas dos:
        Formulario formulario = formularioRepository.findById(dto.getFormularioId())
            .orElseThrow(() -> new IllegalArgumentException("Formulario no encontrado: " + dto.getFormularioId()));
        registro.setFormulario(formulario);

        registro.setTareaIdCamunda(dto.getTareaIdCamunda());
        registro.setUsuario(dto.getUsuario());
        registro.setFechaCreacion(java.time.LocalDateTime.now());

        try {
            ObjectMapper mapper = new ObjectMapper();
            registro.setValoresJson(mapper.writeValueAsString(dto.getValores()));
        } catch (Exception e) {
            throw new RuntimeException("No se pudo serializar valores", e);
        }
        return formularioRegistroRepository.save(registro);
    }


    public List<Campo> listarTodosLosCampos() {
        return campoRepository.findAll();
    }

    public List<FormularioCampo> obtenerCamposDeFormulario(Long formularioId) {
        Optional<Formulario> formularioOpt = formularioRepository.findById(formularioId);
        return formularioOpt
            .map(form -> formularioCampoRepository.findByFormularioOrderByOrdenAsc(form))
            .orElse(Collections.emptyList());
    }

    public List<Formulario> buscarFormulariosPorCampo(Long campoId) {
        return formularioRepository.findFormulariosByCampoId(campoId);
    }

    public List<TareaFormulario> formulariosDeTarea(String procesoKey, String taskDefinitionKey) {
        return tareaFormularioRepository.findByProcesoKeyAndTaskDefinitionKeyOrderByOrdenTabAsc(procesoKey, taskDefinitionKey);
    }

    public boolean formularioYaAsignadoATarea(String procesoKey, String taskKey, Long formularioId) {
        return tareaFormularioRepository.existsByProcesoKeyAndTaskDefinitionKeyAndFormularioId(procesoKey, taskKey, formularioId);
    }

    public Optional<FormularioRegistro> obtenerUltimoRegistro(Long formularioId, String tareaIdCamunda) {
        return formularioRegistroRepository.findTopByFormularioIdAndTareaIdCamundaOrderByFechaCreacionDesc(formularioId, tareaIdCamunda);
    }

    // ...más lógica de negocio según vayas requiriendo.
    
    /** Listar todos los formularios (devuelve lista de DTOs) */
    public List<FormularioDto> findAll() {
        List<Formulario> formularios = formularioRepository.findAll();
        List<FormularioDto> dtos = new ArrayList<>();
        for (Formulario f : formularios) {
            FormularioDto dto = new FormularioDto();
            dto.setId(f.getId());
            dto.setNombre(f.getNombre());
            dto.setDescripcion(f.getDescripcion());
            // Puedes agregar más mapeo según tu necesidad
            dtos.add(dto);
        }
        return dtos;
    }


    /** Buscar un formulario por su ID (devuelve DTO) */
    public FormularioDto findById(Long id) {
        Formulario f = formularioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Formulario no encontrado: " + id));
        FormularioDto dto = new FormularioDto();
        dto.setId(f.getId());
        dto.setNombre(f.getNombre());
        dto.setDescripcion(f.getDescripcion());
        // Puedes mapear los campos si necesitas
        return dto;
    }

    /** Guardar o actualizar un formulario */
    public FormularioDto save(FormularioDto dto) {
        Formulario formulario;
        if (dto.getId() != null) {
            // Editar existente
            formulario = formularioRepository.findById(dto.getId())
                .orElse(new Formulario());
        } else {
            // Nuevo formulario
            formulario = new Formulario();
        }
        formulario.setNombre(dto.getNombre());
        formulario.setDescripcion(dto.getDescripcion());
        // Guarda la entidad
        Formulario guardado = formularioRepository.save(formulario);

        // Retorna DTO actualizado
        FormularioDto resultDto = new FormularioDto();
        resultDto.setId(guardado.getId());
        resultDto.setNombre(guardado.getNombre());
        resultDto.setDescripcion(guardado.getDescripcion());
        return resultDto;
    }

    /** Eliminar formulario por ID */
    public void delete(Long id) {
        if (!formularioRepository.existsById(id)) {
            throw new IllegalArgumentException("Formulario no existe: " + id);
        }
        formularioRepository.deleteById(id);
    }

    
    public List<FormularioDto> obtenerDtosFormulariosDeTarea(String procesoKey, String taskDefinitionKey) {
        List<TareaFormulario> tareasForm = tareaFormularioRepository.findByProcesoKeyAndTaskDefinitionKeyOrderByOrdenTabAsc(procesoKey, taskDefinitionKey);

        List<FormularioDto> resultado = new ArrayList<>();

        for (TareaFormulario tf : tareasForm) {
            Formulario formulario = tf.getFormulario();
            List<FormularioCampo> campos = formularioCampoRepository.findByFormularioOrderByOrdenAsc(formulario);

            FormularioDto fDto = new FormularioDto();
            fDto.setId(formulario.getId());
            fDto.setNombre(formulario.getNombre());
            fDto.setDescripcion(formulario.getDescripcion());

            List<FormularioCampoDto> camposDto = new ArrayList<>();
            for (FormularioCampo fc : campos) {
                Campo c = fc.getCampo();
                FormularioCampoDto cDto = new FormularioCampoDto();
                cDto.setId(c.getId());
                cDto.setNombreCampo(c.getNombreCampo());
                cDto.setEtiqueta(c.getEtiqueta());
                cDto.setTipo(c.getTipo());
                cDto.setPlaceholder(c.getPlaceholder());
                cDto.setValidacionRegex(c.getValidacionRegex());
                cDto.setMensajeError(c.getMensajeError());
                cDto.setOpciones(c.getOpciones());
                cDto.setRequerido(fc.getRequerido());
                cDto.setVisible(fc.getVisible());
                cDto.setValorPorDefecto(fc.getValorPorDefecto());
                cDto.setOrden(fc.getOrden());
                camposDto.add(cDto);
            }
            fDto.setCampos(camposDto);

            resultado.add(fDto);
        }

        return resultado;
    }

}

