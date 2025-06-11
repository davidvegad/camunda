package com.bpmnengine.negocio.servicio.formulario;

import com.bpmnengine.negocio.dto.formulario.CampoDto;
import com.bpmnengine.negocio.entidad.formulario.Campo;
import com.bpmnengine.negocio.repositorio.formulario.CampoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CampoService {

    @Autowired
    private CampoRepository campoRepository;

    /** Listar todos los campos */
    public List<CampoDto> findAll() {
        return campoRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    /** Obtener un campo por ID */
    public CampoDto findById(Long id) {
        Campo campo = campoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Campo no encontrado: " + id));
        return toDto(campo);
    }

    /** Crear o actualizar campo */
    public CampoDto save(CampoDto dto) {
        Campo campo;
        if (dto.getId() != null) {
            campo = campoRepository.findById(dto.getId())
                    .orElse(new Campo());
        } else {
            campo = new Campo();
        }
        campo.setEtiqueta(dto.getEtiqueta());
        campo.setMensajeError(dto.getMensajeError());
        campo.setNombreCampo(dto.getNombreCampo());
        campo.setOpciones(dto.getOpciones());
        campo.setPlaceholder(dto.getPlaceholder());
        campo.setTipo(dto.getTipo());
        campo.setValidacionRegex(dto.getValidacionRegex());

        Campo guardado = campoRepository.save(campo);
        return toDto(guardado);
    }

    /** Eliminar campo */
    public void delete(Long id) {
        if (!campoRepository.existsById(id)) {
            throw new IllegalArgumentException("Campo no existe: " + id);
        }
        campoRepository.deleteById(id);
    }

    /** Utilidad: convierte entidad a DTO */
    private CampoDto toDto(Campo campo) {
        CampoDto dto = new CampoDto();
        dto.setId(campo.getId());
        dto.setEtiqueta(campo.getEtiqueta());
        dto.setMensajeError(campo.getMensajeError());
        dto.setNombreCampo(campo.getNombreCampo());
        dto.setOpciones(campo.getOpciones());
        dto.setPlaceholder(campo.getPlaceholder());
        dto.setTipo(campo.getTipo());
        dto.setValidacionRegex(campo.getValidacionRegex());
        return dto;
    }
}
