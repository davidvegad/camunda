package com.bpmnengine.negocio.entidad.formulario;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tarea_formulario")
@Data
public class TareaFormulario {
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

	public Formulario getFormulario() {
		return formulario;
	}

	public void setFormulario(Formulario formulario) {
		this.formulario = formulario;
	}

	public Integer getOrdenTab() {
		return ordenTab;
	}

	public void setOrdenTab(Integer ordenTab) {
		this.ordenTab = ordenTab;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "proceso_key", nullable = false)
    private String procesoKey;

    @Column(name = "task_definition_key", nullable = false)
    private String taskDefinitionKey;

    @ManyToOne
    @JoinColumn(name = "formulario_id", nullable = false)
    private Formulario formulario;

    @Column(name = "orden_tab", nullable = false)
    private Integer ordenTab = 1;
}
