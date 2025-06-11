package com.bpmnengine.negocio.repositorio.formulario;

import com.bpmnengine.negocio.entidad.formulario.TareaFormulario;
import com.bpmnengine.negocio.entidad.formulario.Formulario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaFormularioRepository extends JpaRepository<TareaFormulario, Long> {
    // Todos los formularios de una tarea específica, ordenados por pestaña
    List<TareaFormulario> findByProcesoKeyAndTaskDefinitionKeyOrderByOrdenTabAsc(String procesoKey, String taskDefinitionKey);

    // Todas las tareas que usan un formulario (útil para administración)
    List<TareaFormulario> findByFormularioId(Long formularioId);

    // Verificar si un formulario ya está asignado a una tarea
    boolean existsByProcesoKeyAndTaskDefinitionKeyAndFormularioId(String procesoKey, String taskDefinitionKey, Long formularioId);
    
    List<TareaFormulario> findByFormulario(Formulario formulario);
}
