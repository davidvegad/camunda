package com.bpmnengine.negocio.dto.reglaproceso;

import lombok.Data;

@Data
public class CampoObligatorioDto {
    private Long id;
    private String nombre;
    private String tipo;
    private String regexValidacion;
    private String etiqueta;
    private Boolean esDocumento;
    private String docExtensiones;
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
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public String getRegexValidacion() {
		return regexValidacion;
	}
	public void setRegexValidacion(String regexValidacion) {
		this.regexValidacion = regexValidacion;
	}
	public String getEtiqueta() {
		return etiqueta;
	}
	public void setEtiqueta(String etiqueta) {
		this.etiqueta = etiqueta;
	}
	public Boolean getEsDocumento() {
		return esDocumento;
	}
	public void setEsDocumento(Boolean esDocumento) {
		this.esDocumento = esDocumento;
	}
	public String getDocExtensiones() {
		return docExtensiones;
	}
	public void setDocExtensiones(String docExtensiones) {
		this.docExtensiones = docExtensiones;
	}
}
