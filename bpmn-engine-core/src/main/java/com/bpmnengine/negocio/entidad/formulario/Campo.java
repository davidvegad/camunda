package com.bpmnengine.negocio.entidad.formulario;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "campo")
@Data
public class Campo {
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
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_campo", nullable = false)
    private String nombreCampo;

    @Column(nullable = false)
    private String etiqueta;

    @Column(nullable = false)
    private String tipo;

    private String placeholder;
    private String validacionRegex;
    private String mensajeError;
    private String opciones;
}
