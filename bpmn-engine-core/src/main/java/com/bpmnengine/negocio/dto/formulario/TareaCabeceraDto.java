package com.bpmnengine.negocio.dto.formulario;

public class TareaCabeceraDto {
    public String getEtiqueta() {
		return etiqueta;
	}
	public void setEtiqueta(String etiqueta) {
		this.etiqueta = etiqueta;
	}
	public String getNombreVariable() {
		return nombreVariable;
	}
	public void setNombreVariable(String nombreVariable) {
		this.nombreVariable = nombreVariable;
	}
	public Integer getOrden() {
		return orden;
	}
	public void setOrden(Integer orden) {
		this.orden = orden;
	}
	private String etiqueta;
    private String nombreVariable;
    private Integer orden;
    // Getters y setters
}
