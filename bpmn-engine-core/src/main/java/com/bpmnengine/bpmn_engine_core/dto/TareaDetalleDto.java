package com.bpmnengine.bpmn_engine_core.dto;

import java.util.Date;

/*
public class TareaDetalleDto {
    private String id;
    private String name;
    private String assignee;
    private Date created;
    private String processInstanceId;
    private String businessKey;

    // Constructor
    public TareaDetalleDto(String id, String name, String assignee, Date created, String processInstanceId, String businessKey) {
        this.id = id;
        this.name = name;
        this.assignee = assignee;
        this.created = created;
        this.processInstanceId = processInstanceId;
        this.businessKey = businessKey;
    }

    // Getters y Setters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getAssignee() { return assignee; }
    public Date getCreated() { return created; }
    public String getProcessInstanceId() { return processInstanceId; }
    public String getBusinessKey() { return businessKey; }

    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAssignee(String assignee) { this.assignee = assignee; }
    public void setCreated(Date created) { this.created = created; }
    public void setProcessInstanceId(String processInstanceId) { this.processInstanceId = processInstanceId; }
    public void setBusinessKey(String businessKey) { this.businessKey = businessKey; }
}
*/
public class TareaDetalleDto {
    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getAsignado() {
		return asignado;
	}

	public void setAsignado(String asignado) {
		this.asignado = asignado;
	}

	public Date getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(Date fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

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

	private String id;
    private String nombre;
    private String asignado;
    private Date fechaCreacion;
    private String processInstanceId;
    private String businessKey;
    private String nombreProceso;

    public TareaDetalleDto(String id, String nombre, String asignado, Date fechaCreacion,
                           String processInstanceId, String businessKey, String nombreProceso) {
        this.id = id;
        this.nombre = nombre;
        this.asignado = asignado;
        this.fechaCreacion = fechaCreacion;
        this.processInstanceId = processInstanceId;
        this.businessKey = businessKey;
        this.nombreProceso = nombreProceso;
    }

    // getters y setters aquí
}

