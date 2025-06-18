package com.bpmnengine.negocio.dto.reglaproceso;

import lombok.Data;
import java.util.List;

@Data
public class ProcesoDto {
    private Long id;
    private String nombre;
    private String processKey;
    private String descripcion;
    private List<String> palabrasClave;
    private List<CampoObligatorioDto> campos;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getProcessKey() {
		return processKey;
	}
	public void setProcessKey(String processKey) {
		this.processKey = processKey;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public List<String> getPalabrasClave() {
		return palabrasClave;
	}
	public void setPalabrasClave(List<String> palabrasClave) {
		this.palabrasClave = palabrasClave;
	}
	public List<CampoObligatorioDto> getCampos() {
		return campos;
	}
	public void setCampos(List<CampoObligatorioDto> campos) {
		this.campos = campos;
	}
}
