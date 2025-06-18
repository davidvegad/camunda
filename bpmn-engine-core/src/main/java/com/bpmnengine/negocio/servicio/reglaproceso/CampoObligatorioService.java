package com.bpmnengine.negocio.servicio.reglaproceso;

import com.bpmnengine.negocio.entidad.reglaproceso.CampoObligatorio;
import com.bpmnengine.negocio.repositorio.reglaproceso.CampoObligatorioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampoObligatorioService {

    private final CampoObligatorioRepository repository;

    public CampoObligatorioService(CampoObligatorioRepository repository) {
        this.repository = repository;
    }

    public List<CampoObligatorio> obtenerPorProcesoId(Long procesoId) {
        return repository.findByProcesoId(procesoId);
    }

    public CampoObligatorio guardar(CampoObligatorio campo) {
        return repository.save(campo);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
