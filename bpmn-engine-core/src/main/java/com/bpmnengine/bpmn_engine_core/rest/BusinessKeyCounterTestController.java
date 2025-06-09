package com.bpmnengine.bpmn_engine_core.rest;

import com.bpmnengine.negocio.entidad.BusinessKeyCounter;
import com.bpmnengine.negocio.entidad.BusinessKeyCounterId;
import com.bpmnengine.negocio.repositorio.BusinessKeyCounterRepository;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/test-business-db")
public class BusinessKeyCounterTestController {

    private final BusinessKeyCounterRepository repository;

    public BusinessKeyCounterTestController(BusinessKeyCounterRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/ping")
    public String probarConexion() {
        long total = repository.count();
        return "Conexión a business_db OK. Registros totales: " + total;
    }

   /* @PostMapping("/insertar-prueba")
    public String insertarRegistroDePrueba() {
        BusinessKeyCounterId id = new BusinessKeyCounterId("TEST_PROCESS", LocalDate.now());
        BusinessKeyCounter counter = new BusinessKeyCounter(id, 1);
        repository.save(counter);
        return "Registro de prueba insertado correctamente";
    }
*/
    @GetMapping("/consultar-prueba")
    public String consultarRegistroDePrueba() {
        BusinessKeyCounterId id = new BusinessKeyCounterId("TEST_PROCESS", LocalDate.now());
        Optional<BusinessKeyCounter> encontrado = repository.findById(id);
        return encontrado.map(c -> "Encontrado: " + c.getContador())
                         .orElse("No se encontró registro de prueba");
    }
}
