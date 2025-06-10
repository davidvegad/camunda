package com.bpmnengine.negocio.repositorio.formulario;

import com.bpmnengine.negocio.entidad.formulario.FormularioCampo;
import com.bpmnengine.negocio.entidad.formulario.Formulario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface FormularioCampoRepository extends JpaRepository<FormularioCampo, Long> {
    // Todos los campos de un formulario (ordenados)
    List<FormularioCampo> findByFormularioOrderByOrdenAsc(Formulario formulario);

    // Buscar un campo específico en un formulario (para edición/eliminación)
    Optional<FormularioCampo> findByFormularioIdAndCampoId(Long formularioId, Long campoId);

    // Listar todos los campos requeridos de un formulario
    List<FormularioCampo> findByFormularioIdAndRequeridoTrueOrderByOrdenAsc(Long formularioId);
}
