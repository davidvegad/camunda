package com.bpmnengine.negocio.entidad.formulario;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "formulario_campo")
@Data
public class FormularioCampo {
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Formulario getFormulario() {
		return formulario;
	}

	public void setFormulario(Formulario formulario) {
		this.formulario = formulario;
	}

	public Campo getCampo() {
		return campo;
	}

	public void setCampo(Campo campo) {
		this.campo = campo;
	}

	public Boolean getRequerido() {
		return requerido;
	}

	public void setRequerido(Boolean requerido) {
		this.requerido = requerido;
	}

	public Boolean getVisible() {
		return visible;
	}

	public void setVisible(Boolean visible) {
		this.visible = visible;
	}

	public String getValorPorDefecto() {
		return valorPorDefecto;
	}

	public void setValorPorDefecto(String valorPorDefecto) {
		this.valorPorDefecto = valorPorDefecto;
	}

	public Integer getOrden() {
		return orden;
	}

	public void setOrden(Integer orden) {
		this.orden = orden;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "formulario_id", nullable = false)
    private Formulario formulario;

    @ManyToOne
    @JoinColumn(name = "campo_id", nullable = false)
    private Campo campo;

    private Boolean requerido = false;
    private Boolean visible = true;

    @Column(name = "valor_por_defecto")
    private String valorPorDefecto;

    private Integer orden = 1;
}
