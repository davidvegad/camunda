package com.bpmnengine.negocio.dto.formulario;

public class FormularioCampoDto {
    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNombreCampo() {
		return nombreCampo;
	}
	public void setNombreCampo(String nombreCampo) {
		this.nombreCampo = nombreCampo;
	}
	public String getEtiqueta() {
		return etiqueta;
	}
	public void setEtiqueta(String etiqueta) {
		this.etiqueta = etiqueta;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public String getPlaceholder() {
		return placeholder;
	}
	public void setPlaceholder(String placeholder) {
		this.placeholder = placeholder;
	}
	public String getValidacionRegex() {
		return validacionRegex;
	}
	public void setValidacionRegex(String validacionRegex) {
		this.validacionRegex = validacionRegex;
	}
	public String getMensajeError() {
		return mensajeError;
	}
	public void setMensajeError(String mensajeError) {
		this.mensajeError = mensajeError;
	}
	public String getOpciones() {
		return opciones;
	}
	public void setOpciones(String opciones) {
		this.opciones = opciones;
	}
	public Boolean getRequerido() {
		return requerido;
	}
	public void setRequerido(Boolean requerido) {
		this.requerido = requerido;
	}
	public Boolean getVisible() {
		return visible;
	}
	public void setVisible(Boolean visible) {
		this.visible = visible;
	}
	public String getValorPorDefecto() {
		return valorPorDefecto;
	}
	public void setValorPorDefecto(String valorPorDefecto) {
		this.valorPorDefecto = valorPorDefecto;
	}
	public Integer getOrden() {
		return orden;
	}
	public void setOrden(Integer orden) {
		this.orden = orden;
	}
	private Long id;
    private String nombreCampo;
    private String etiqueta;
    private String tipo;
    private String placeholder;
    private String validacionRegex;
    private String mensajeError;
    private String opciones;
    private Boolean requerido;
    private Boolean visible;
    private String valorPorDefecto;
    private Integer orden;
}