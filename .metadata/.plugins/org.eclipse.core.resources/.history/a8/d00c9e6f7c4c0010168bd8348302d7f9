package com.bpmnengine.negocio.entidad.reglaproceso;


import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "proceso")
@Data
public class Proceso {
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

	public String getProcessKey() {
		return processKey;
	}

	public void setProcessKey(String processKey) {
		this.processKey = processKey;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public List<String> getPalabrasClave() {
		return palabrasClave;
	}

	public void setPalabrasClave(List<String> palabrasClave) {
		this.palabrasClave = palabrasClave;
	}

	public List<CampoObligatorio> getCampos() {
		return campos;
	}

	public void setCampos(List<CampoObligatorio> campos) {
		this.campos = campos;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    @Column(name = "process_key")
    private String processKey;
    private String descripcion;

    // Si prefieres, puedes poner las palabras en otra tabla (recomendado)
    @ElementCollection
    @CollectionTable(name = "proceso_palabra_clave", joinColumns = @JoinColumn(name = "proceso_id"))
    @Column(name = "palabra")
    private List<String> palabrasClave;

    // Relación con campos obligatorios
    @OneToMany(mappedBy = "proceso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CampoObligatorio> campos;
}
