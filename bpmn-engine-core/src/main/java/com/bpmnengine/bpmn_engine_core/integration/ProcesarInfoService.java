package com.bpmnengine.bpmn_engine_core.integration; // O donde la tengas ahora

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

@Service("procesarInfoService")
public class ProcesarInfoService implements JavaDelegate { // <--- IMPLEMENTA JavaDelegate

    private static final Logger LOGGER = LoggerFactory.getLogger(ProcesarInfoService.class);

    @Autowired
    private MessageChannel inputChannel; // Este es el inputChannel de tu IntegrationConfig

    @Override // <--- ESTE ES EL MÉTODO QUE CAMUNDA LLAMARÁ
    public void execute(DelegateExecution execution) throws Exception {
        LOGGER.info("ProcesarInfoService (JavaDelegate): Iniciando procesamiento para la instancia de proceso {}", execution.getProcessInstanceId());

        String nombreVariable = (String) execution.getVariable("nombreVariableEntrada");
        if (nombreVariable != null) {
            LOGGER.info("Valor de 'nombreVariableEntrada' recibido: {}", nombreVariable);
        } else {
            LOGGER.info("'nombreVariableEntrada' no encontrada.");
        }

        // Obtener todas las variables para enviarlas al flujo de integración
        // Es importante clonarlas si el mapa de variables de Camunda no es directamente serializable
        // o si quieres evitar modificaciones accidentales. Por ahora, directo.
        Map<String, Object> processVariables = new HashMap<>(execution.getVariables());


        boolean sent = inputChannel.send(MessageBuilder.withPayload(processVariables) // Enviar todas las variables
                               .setHeader("processInstanceId", execution.getProcessInstanceId())
                               .setHeader("activityId", execution.getCurrentActivityId())
                               .build());
        if (sent) {
            LOGGER.info("Mensaje enviado exitosamente al inputChannel desde ProcesarInfoService.");
        } else {
            LOGGER.error("Error al enviar mensaje al inputChannel desde ProcesarInfoService.");
        }

        // Aquí ya no se devuelve nada porque el método execute de JavaDelegate es void.
        // La lógica principal está en enviar el mensaje al flujo de Spring Integration.
    }
}