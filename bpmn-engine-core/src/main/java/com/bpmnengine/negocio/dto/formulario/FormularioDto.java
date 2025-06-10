package com.bpmnengine.negocio.dto.formulario;

import java.util.List;

public class FormularioDto {
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
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public List<FormularioCampoDto> getCampos() {
		return campos;
	}
	public void setCampos(List<FormularioCampoDto> campos) {
		this.campos = campos;
	}
	private Long id;
    private String nombre;
    private String descripcion;
    private List<FormularioCampoDto> campos;
}