package com.bpmnengine.negocio.dto.formulario;

import java.util.Map;

public class RegistroFormularioRequest {
    public Long getFormularioId() {
		return formularioId;
	}
	public void setFormularioId(Long formularioId) {
		this.formularioId = formularioId;
	}
	public String getTareaIdCamunda() {
		return tareaIdCamunda;
	}
	public void setTareaIdCamunda(String tareaIdCamunda) {
		this.tareaIdCamunda = tareaIdCamunda;
	}
	public String getUsuario() {
		return usuario;
	}
	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}
	public Map<String, Object> getValores() {
		return valores;
	}
	public void setValores(Map<String, Object> valores) {
		this.valores = valores;
	}
	private Long formularioId;
    private String tareaIdCamunda;
    private String usuario;
    private Map<String, Object> valores; // o String valoresJson si prefieres parsear manual
    // getters y setters
}
