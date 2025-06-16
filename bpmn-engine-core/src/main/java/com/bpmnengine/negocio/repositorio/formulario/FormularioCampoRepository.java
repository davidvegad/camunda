package com.bpmnengine.negocio.repositorio.formulario;

import com.bpmnengine.negocio.entidad.formulario.FormularioCampo;
import com.bpmnengine.negocio.entidad.formulario.Formulario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;


public interface FormularioCampoRepository extends JpaRepository<FormularioCampo, Long> {
    // Todos los campos de un formulario (ordenados)
    List<FormularioCampo> findByFormularioOrderByOrdenAsc(Formulario formulario);

    // Buscar un campo específico en un formulario (para edición/eliminación)
    Optional<FormularioCampo> findByFormularioIdAndCampoId(Long formularioId, Long campoId);

    // Listar todos los campos requeridos de un formulario
    List<FormularioCampo> findByFormularioIdAndRequeridoTrueOrderByOrdenAsc(Long formularioId);
    
 // NUEVO: Devuelve los IDs de los campos asociados a un formulario
    @Query("select fc.campo.id from FormularioCampo fc where fc.formulario.id = :formularioId")
    List<Long> findIdsCamposByFormulario(@Param("formularioId") Long formularioId);
}
