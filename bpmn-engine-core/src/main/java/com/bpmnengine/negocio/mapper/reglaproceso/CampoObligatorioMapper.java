package com.bpmnengine.negocio.mapper.reglaproceso;

import com.bpmnengine.negocio.entidad.reglaproceso.CampoObligatorio;
import com.bpmnengine.negocio.dto.reglaproceso.CampoObligatorioDto;

public class CampoObligatorioMapper {

    public static CampoObligatorioDto toDto(CampoObligatorio entity) {
        if (entity == null) return null;
        CampoObligatorioDto dto = new CampoObligatorioDto();
        dto.setId(entity.getId());
        dto.setDocExtensiones(entity.getDocExtensiones());
        dto.setEsDocumento(entity.getEsDocumento());
        dto.setEtiqueta(entity.getEtiqueta());
        dto.setNombre(entity.getNombre());
        dto.setRegexValidacion(entity.getRegexValidacion());
        dto.setTipo(entity.getTipo());
        dto.setProcesoId(entity.getProcesoId());
        return dto;
    }

    public static CampoObligatorio toEntity(CampoObligatorioDto dto) {
        if (dto == null) return null;
        CampoObligatorio entity = new CampoObligatorio();
        entity.setId(dto.getId());
        entity.setDocExtensiones(dto.getDocExtensiones());
        entity.setEsDocumento(dto.getEsDocumento());
        entity.setEtiqueta(dto.getEtiqueta());
        entity.setNombre(dto.getNombre());
        entity.setRegexValidacion(dto.getRegexValidacion());
        entity.setTipo(dto.getTipo());
        entity.setProcesoId(dto.getProcesoId());
        return entity;
    }
}
