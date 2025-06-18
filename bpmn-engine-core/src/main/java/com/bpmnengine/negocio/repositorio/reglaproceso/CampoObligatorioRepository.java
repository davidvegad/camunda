package com.bpmnengine.negocio.repositorio.reglaproceso;

import com.bpmnengine.negocio.entidad.reglaproceso.CampoObligatorio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampoObligatorioRepository extends JpaRepository<CampoObligatorio, Long> {
    List<CampoObligatorio> findByProcesoId(Long procesoId);
}
