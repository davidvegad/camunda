package com.bpmnengine.negocio.servicio;

import com.bpmnengine.negocio.entidad.BusinessKeyCounter;
import com.bpmnengine.negocio.entidad.BusinessKeyCounterId;
import com.bpmnengine.negocio.repositorio.BusinessKeyCounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class BusinessKeyService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Autowired
    private Environment environment;

    @Autowired
    private BusinessKeyCounterRepository counterRepository;

    /**
     * Genera un businessKey con el formato PREFIJO-yyyyMMdd-00001
     * donde el prefijo se obtiene desde application.properties
     * y el número es incremental por día y proceso.
     */
    @Transactional("businessTransactionManager")
    public String generarBusinessKey(String processDefinitionKey) {
        String prefijo = environment.getProperty(processDefinitionKey);
        if (prefijo == null || prefijo.isBlank()) {
            throw new IllegalArgumentException("No se encontró prefijo para el proceso: " + processDefinitionKey);
        }

        LocalDate hoy = LocalDate.now();
        BusinessKeyCounterId id = new BusinessKeyCounterId(processDefinitionKey, hoy);

        Optional<BusinessKeyCounter> existente = counterRepository.findById(id);
        int nuevoValor = existente.map(BusinessKeyCounter::getContador).orElse(0) + 1;

        BusinessKeyCounter actualizado = new BusinessKeyCounter(processDefinitionKey, hoy, nuevoValor);
        counterRepository.save(actualizado);

        return String.format("%s-%s-%05d", prefijo, hoy.format(DATE_FORMAT), nuevoValor);
        
        
    }
    
    
}


