package com.bpmnengine.negocio.entidad.formulario;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "formulario_registro")
@Data
public class FormularioRegistro {




	public Formulario getFormulario() {
		return formulario;
	}

	public void setFormulario(Formulario formulario) {
		this.formulario = formulario;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}



	public String getTareaIdCamunda() {
		return tareaIdCamunda;
	}

	public void setTareaIdCamunda(String tareaIdCamunda) {
		this.tareaIdCamunda = tareaIdCamunda;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public String getUsuario() {
		return usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public String getValoresJson() {
		return valoresJson;
	}

	public void setValoresJson(String valoresJson) {
		this.valoresJson = valoresJson;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@ManyToOne
	@JoinColumn(name="formulario_id")
	private Formulario formulario;


    @Column(name = "tarea_id_camunda", nullable = false)
    private String tareaIdCamunda;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    private String usuario;

    @Lob
    @Column(name = "valores_json")
    private String valoresJson;
}
