package com.bpmnengine.negocio.entidad.reglaproceso;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "campo_obligatorio")
@Data
public class CampoObligatorio {
    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Proceso getProceso() {
		return proceso;
	}
	public void setProceso(Proceso proceso) {
		this.proceso = proceso;
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
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proceso_id")
    private Proceso proceso;

    private String nombre;             // Ej: usuario, fechaInicio
    private String tipo;               // text, date, number, doc, etc.
    private String regexValidacion;    // opcional
    private String etiqueta;           // opcional, para mostrar
    private Boolean esDocumento = false;
    private String docExtensiones;     // Ej: "pdf,jpg,png"
}
