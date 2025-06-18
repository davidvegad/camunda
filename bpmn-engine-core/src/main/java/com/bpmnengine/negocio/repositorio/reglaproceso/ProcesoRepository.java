package com.bpmnengine.negocio.repositorio.reglaproceso;


import com.bpmnengine.negocio.entidad.reglaproceso.Proceso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcesoRepository extends JpaRepository<Proceso, Long> {
    Proceso findByProcessKey(String processKey);
}
