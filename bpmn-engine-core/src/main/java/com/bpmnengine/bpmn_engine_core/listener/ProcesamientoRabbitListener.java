package com.bpmnengine.bpmn_engine_core.listener;

import com.bpmnengine.bpmn_engine_core.config.AmqpConfig;
import org.camunda.bpm.engine.RuntimeService; // Para interactuar con el motor
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Map; // Para recibir el Map

@Component
public class ProcesamientoRabbitListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProcesamientoRabbitListener.class);

    @Autowired
    private RuntimeService runtimeService; // Inyecta el RuntimeService de Camunda

    // Asumimos que el mensaje de RabbitMQ ahora es un Map (Spring AMQP lo deserializará si es JSON)
    @RabbitListener(queues = AmqpConfig.QUEUE_NAME)
    public void recibirMensajeDeProcesamiento(Map<String, Object> mensajePayload) {
        LOGGER.info("¡Mensaje (Map) recibido de RabbitMQ en la cola '{}'!", AmqpConfig.QUEUE_NAME);
        LOGGER.info("Payload del mensaje: {}", mensajePayload);

        String processInstanceId = (String) mensajePayload.get("processInstanceId");
        String datosProcesados = (String) mensajePayload.get("datosProcesados");
        
        LOGGER.info("LISTENER: Intentando correlacionar. Mensaje='{}', ProcessInstanceID='{}', Payload='{}'",
                "MsgConfirmacionProcesamientoRecibida", processInstanceId, mensajePayload);


        if (processInstanceId != null) {
            LOGGER.info("Intentando correlacionar mensaje para processInstanceId: {}", processInstanceId);
            try {
                runtimeService.createMessageCorrelation("MsgConfirmacionProcesamientoRecibida") // Nombre del mensaje definido en el BPMN
                    .processInstanceId(processInstanceId)
                    .setVariable("datosDeConfirmacion", datosProcesados) // Pasar datos del mensaje al proceso
                    .correlateWithResult(); // O .correlate(); si no necesitas el resultado de la correlación

                LOGGER.info("Mensaje correlacionado exitosamente con la instancia de proceso: {}", processInstanceId);
            } catch (Exception e) {
                LOGGER.error("Error al correlacionar el mensaje para processInstanceId: {}. Error: {}", processInstanceId, e.getMessage(), e);
                // Aquí podrías implementar lógica de reintentos o enviar a una cola de error (dead letter queue)
            }
        } else {
            LOGGER.warn("No se encontró 'processInstanceId' en el payload del mensaje de RabbitMQ. No se puede correlacionar.");
        }
    }
}