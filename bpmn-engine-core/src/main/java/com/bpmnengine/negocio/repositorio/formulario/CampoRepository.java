package com.bpmnengine.negocio.repositorio.formulario;

import com.bpmnengine.negocio.entidad.formulario.Campo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;



public interface CampoRepository extends JpaRepository<Campo, Long> {
    // Buscar por nombre técnico (para evitar duplicados)
    Optional<Campo> findByNombreCampo(String nombreCampo);
    
 // Buscar todos los campos que NO estén en una lista de IDs
    List<Campo> findByIdNotIn(List<Long> ids);

    // Buscar todos los campos activos/visibles (si tienes un campo visible global)
    // List<Campo> findByActivoTrue();
}
