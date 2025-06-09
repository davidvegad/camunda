package com.bpmnengine.bpmn_engine_core.delegates; // Asegúrate que el paquete sea correcto

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("procesarInformacionDelegate") // El nombre del bean es opcional, pero puede ser útil
public class ProcesarInformacionDelegate implements JavaDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProcesarInformacionDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        LOGGER.info("¡Ejecutando el delegate 'Procesar Información'!");

        // Ejemplo: Obtener una variable de proceso
        String algunaVariable = (String) execution.getVariable("nombreVariableEntrada");
        if (algunaVariable != null) {
            LOGGER.info("Valor de 'nombreVariableEntrada': {}", algunaVariable);
        } else {
            LOGGER.info("'nombreVariableEntrada' no encontrada.");
        }

        // Ejemplo: Establecer una nueva variable de proceso
        String resultadoProcesamiento = "Información procesada exitosamente el " + new java.util.Date();
        execution.setVariable("resultadoDelProceso", resultadoProcesamiento);
        LOGGER.info("Variable 'resultadoDelProceso' establecida: {}", resultadoProcesamiento);

        // Aquí podrías llamar a otros servicios, realizar cálculos, etc.
    }
}