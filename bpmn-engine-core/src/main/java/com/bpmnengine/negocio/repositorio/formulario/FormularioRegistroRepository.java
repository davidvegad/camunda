package com.bpmnengine.negocio.repositorio.formulario;

import com.bpmnengine.negocio.entidad.formulario.FormularioRegistro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FormularioRegistroRepository extends JpaRepository<FormularioRegistro, Long> {
    // Todos los registros de un formulario en una tarea Camunda específica
    List<FormularioRegistro> findByFormularioIdAndTareaIdCamunda(Long formularioId, String tareaIdCamunda);

    // Último registro llenado (por fecha)
    Optional<FormularioRegistro> findTopByFormularioIdAndTareaIdCamundaOrderByFechaCreacionDesc(Long formularioId, String tareaIdCamunda);

    // Todos los registros de un usuario
    List<FormularioRegistro> findByUsuario(String usuario);
}
