package com.bpmnengine.negocio.rest.reglaproceso;

import com.bpmnengine.negocio.dto.reglaproceso.CampoObligatorioDto;
import com.bpmnengine.negocio.entidad.reglaproceso.CampoObligatorio;
import com.bpmnengine.negocio.mapper.reglaproceso.CampoObligatorioMapper;
import com.bpmnengine.negocio.servicio.reglaproceso.CampoObligatorioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/campos-obligatorios")
@CrossOrigin(origins = "http://localhost:4200")
public class CampoObligatorioRestController {

    private final CampoObligatorioService service;

    public CampoObligatorioRestController(CampoObligatorioService service) {
        this.service = service;
    }

    @GetMapping
    public List<CampoObligatorioDto> listarPorProceso(@RequestParam Long procesoId) {
        return service.obtenerPorProcesoId(procesoId).stream()
                .map(CampoObligatorioMapper::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public CampoObligatorioDto crear(@RequestBody CampoObligatorioDto dto) {
        CampoObligatorio campo = CampoObligatorioMapper.toEntity(dto);
        return CampoObligatorioMapper.toDto(service.guardar(campo));
    }

    @PutMapping("/{id}")
    public CampoObligatorioDto actualizar(@PathVariable Long id, @RequestBody CampoObligatorioDto dto) {
        CampoObligatorio campo = CampoObligatorioMapper.toEntity(dto);
        campo.setId(id);
        return CampoObligatorioMapper.toDto(service.guardar(campo));
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
