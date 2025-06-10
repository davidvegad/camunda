package com.bpmnengine.negocio.repositorio.formulario;

import com.bpmnengine.negocio.entidad.formulario.Formulario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;


public interface FormularioRepository extends JpaRepository<Formulario, Long> {
    // Buscar por nombre
    Optional<Formulario> findByNombre(String nombre);

    // Listar todos los formularios que contienen un campo específico (relación N:M)
    @Query("SELECT fc.formulario FROM FormularioCampo fc WHERE fc.campo.id = :campoId")
    List<Formulario> findFormulariosByCampoId(@Param("campoId") Long campoId);
}
