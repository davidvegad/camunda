package com.bpmnengine.negocio.mapper.reglaproceso;


import com.bpmnengine.negocio.entidad.reglaproceso.Proceso;
import com.bpmnengine.negocio.dto.reglaproceso.ProcesoDto;
import com.bpmnengine.negocio.entidad.reglaproceso.CampoObligatorio;
import com.bpmnengine.negocio.dto.reglaproceso.CampoObligatorioDto;

import java.util.List;
import java.util.stream.Collectors;

public class ProcesoMapper {
    public static ProcesoDto toDto(Proceso entity) {
        ProcesoDto dto = new ProcesoDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setProcessKey(entity.getProcessKey());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPalabrasClave(entity.getPalabrasClave());
        if (entity.getCampos() != null) {
            dto.setCampos(entity.getCampos().stream().map(ProcesoMapper::toDtoCampo).collect(Collectors.toList()));
        }
        return dto;
    }
    public static CampoObligatorioDto toDtoCampo(CampoObligatorio entity) {
        CampoObligatorioDto dto = new CampoObligatorioDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setTipo(entity.getTipo());
        dto.setRegexValidacion(entity.getRegexValidacion());
        dto.setEtiqueta(entity.getEtiqueta());
        dto.setEsDocumento(entity.getEsDocumento());
        dto.setDocExtensiones(entity.getDocExtensiones());
        return dto;
    }
    
    public static Proceso toEntity(ProcesoDto dto) {
        Proceso entity = new Proceso();
        entity.setId(dto.getId());
        entity.setNombre(dto.getNombre());
        entity.setProcessKey(dto.getProcessKey());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPalabrasClave(dto.getPalabrasClave());
        if (dto.getCampos() != null) {
            List<CampoObligatorio> campos = dto.getCampos().stream()
                    .map(ProcesoMapper::toEntityCampo)
                    .collect(Collectors.toList());
            campos.forEach(c -> c.setProceso(entity)); // setea la relación inversa
            entity.setCampos(campos);
        }
        return entity;
    }

    public static CampoObligatorio toEntityCampo(CampoObligatorioDto dto) {
        CampoObligatorio entity = new CampoObligatorio();
        entity.setId(dto.getId());
        entity.setNombre(dto.getNombre());
        entity.setTipo(dto.getTipo());
        entity.setRegexValidacion(dto.getRegexValidacion());
        entity.setEtiqueta(dto.getEtiqueta());
        entity.setEsDocumento(dto.getEsDocumento());
        entity.setDocExtensiones(dto.getDocExtensiones());
        return entity;
    }

    public static Proceso updateEntity(Proceso existente, ProcesoDto dto) {
        existente.setNombre(dto.getNombre());
        existente.setProcessKey(dto.getProcessKey());
        existente.setDescripcion(dto.getDescripcion());
        existente.setPalabrasClave(dto.getPalabrasClave());
        // Puedes actualizar la lista de campos también si lo deseas
        // ...
        return existente;
    }

}
