package com.bpmnengine.negocio.dto.formulario;

public class CampoDto {
    private Long id;
    private String etiqueta;
    private String mensajeError;
    private String nombreCampo;
    private String opciones;
    private String placeholder;
    private String tipo;
    private String validacionRegex;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEtiqueta() { return etiqueta; }
    public void setEtiqueta(String etiqueta) { this.etiqueta = etiqueta; }

    public String getMensajeError() { return mensajeError; }
    public void setMensajeError(String mensajeError) { this.mensajeError = mensajeError; }

    public String getNombreCampo() { return nombreCampo; }
    public void setNombreCampo(String nombreCampo) { this.nombreCampo = nombreCampo; }

    public String getOpciones() { return opciones; }
    public void setOpciones(String opciones) { this.opciones = opciones; }

    public String getPlaceholder() { return placeholder; }
    public void setPlaceholder(String placeholder) { this.placeholder = placeholder; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getValidacionRegex() { return validacionRegex; }
    public void setValidacionRegex(String validacionRegex) { this.validacionRegex = validacionRegex; }
}
