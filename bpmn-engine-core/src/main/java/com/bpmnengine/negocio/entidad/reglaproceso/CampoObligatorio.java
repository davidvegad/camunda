package com.bpmnengine.negocio.entidad.reglaproceso;

import jakarta.persistence.*;

@Entity
@Table(name = "campo_obligatorio", schema = "business_db")
public class CampoObligatorio {
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDocExtensiones() {
		return docExtensiones;
	}

	public void setDocExtensiones(String docExtensiones) {
		this.docExtensiones = docExtensiones;
	}

	public Boolean getEsDocumento() {
		return esDocumento;
	}

	public void setEsDocumento(Boolean esDocumento) {
		this.esDocumento = esDocumento;
	}

	public String getEtiqueta() {
		return etiqueta;
	}

	public void setEtiqueta(String etiqueta) {
		this.etiqueta = etiqueta;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getRegexValidacion() {
		return regexValidacion;
	}

	public void setRegexValidacion(String regexValidacion) {
		this.regexValidacion = regexValidacion;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public Long getProcesoId() {
		return procesoId;
	}

	public void setProcesoId(Long procesoId) {
		this.procesoId = procesoId;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "docExtensiones")
    private String docExtensiones;

    @Column(name = "esDocumento")
    private Boolean esDocumento;

    @Column(name = "etiqueta")
    private String etiqueta;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "regexValidacion")
    private String regexValidacion;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "proceso_id")
    private Long procesoId;

    // Getters and Setters
}
