package com.bpmnengine.bpmn_engine_core.dto;
import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TareaSimpleDto {
    public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}

	public String getNombreProceso() {
		return nombreProceso;
	}

	public void setNombreProceso(String nombreProceso) {
		this.nombreProceso = nombreProceso;
	}

	public TareaSimpleDto() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	public boolean isAsignada() {
		return asignada;
	}

	public void setAsignada(boolean asignada) {
		this.asignada = asignada;
	}

	public String getProcessDefinitionKey() {
		return processDefinitionKey;
	}

	public void setProcessDefinitionKey(String processDefinitionKey) {
		this.processDefinitionKey = processDefinitionKey;
	}

	public String getTaskDefinitionKey() {
		return taskDefinitionKey;
	}

	public void setTaskDefinitionKey(String taskDefinitionKey) {
		this.taskDefinitionKey = taskDefinitionKey;
	}

	private String id;
    private String name;
    private String assignee;
    private Date createTime;
    private String processInstanceId;
    private boolean asignada;
    private String processDefinitionKey;   // NUEVO
    private String taskDefinitionKey;      // NUEVO
    private String businessKey;      // <--- nuevo
    private String nombreProceso;    // <--- nuevo

    // constructor completo
    public TareaSimpleDto(String id, String name, String assignee, Date createTime, String processInstanceId,
                          boolean asignada, String processDefinitionKey, String taskDefinitionKey, String businessKey, String nombreProceso ) {
        this.id = id;
        this.name = name;
        this.assignee = assignee;
        this.createTime = createTime;
        this.processInstanceId = processInstanceId;
        this.asignada = asignada;
        this.processDefinitionKey = processDefinitionKey;
        this.taskDefinitionKey = taskDefinitionKey;
        this.nombreProceso = nombreProceso;
        this.businessKey = businessKey;
    }
}