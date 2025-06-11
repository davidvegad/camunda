package com.bpmnengine.negocio.dto.formulario;

import lombok.Data;

@Data
public class TareaFormularioDto {
    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getProcesoKey() {
		return procesoKey;
	}
	public void setProcesoKey(String procesoKey) {
		this.procesoKey = procesoKey;
	}
	public String getTaskDefinitionKey() {
		return taskDefinitionKey;
	}
	public void setTaskDefinitionKey(String taskDefinitionKey) {
		this.taskDefinitionKey = taskDefinitionKey;
	}
	public Integer getOrdenTab() {
		return ordenTab;
	}
	public void setOrdenTab(Integer ordenTab) {
		this.ordenTab = ordenTab;
	}
	public Long getFormularioId() {
		return formularioId;
	}
	public void setFormularioId(Long formularioId) {
		this.formularioId = formularioId;
	}
	private Long id;
    private String procesoKey;
    private String taskDefinitionKey;
    private Integer ordenTab;
    private Long formularioId;
}
