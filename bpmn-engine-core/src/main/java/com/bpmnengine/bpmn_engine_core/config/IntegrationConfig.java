package com.bpmnengine.bpmn_engine_core.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate; // Para enviar a RabbitMQ
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.amqp.dsl.Amqp; // Para el outbound adapter de AMQP
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.handler.LoggingHandler;
import org.springframework.messaging.MessageChannel;
import java.util.Map;
import java.util.HashMap; // Para el nuevo Map

// Quita la importación de RuntimeService si ya no la usas aquí directamente
// import org.camunda.bpm.engine.RuntimeService;

@Configuration
public class IntegrationConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(IntegrationConfig.class);

    @Autowired
    private RabbitTemplate rabbitTemplate; // Spring Boot auto-configura esto

    // @Autowired
    // private RuntimeService runtimeService; // Si lo necesitas para actualizar variables Camunda
    
    @Bean
    public MessageChannel inputChannel() {
        return new DirectChannel();
    }

    @Bean
    public IntegrationFlow procesarInformacionFlow() {
        return IntegrationFlow.from(inputChannel())
                .log(LoggingHandler.Level.INFO, "procesarInformacionFlow", m -> "Iniciando flujo de integración. Payload: " + m.getPayload() + " Headers: " + m.getHeaders())
                .handle((payload, headers) -> {
                    LOGGER.info("Procesando información en el flujo de Spring Integration...");
                    String processInstanceId = (String) headers.get("processInstanceId"); // Capturamos el ID
                    LOGGER.info("ID de Instancia de Proceso desde header: {}", processInstanceId);

                    @SuppressWarnings("unchecked")
                    Map<String, Object> variables = (Map<String, Object>) payload;
                    String nombreVariable = (String) variables.get("nombreVariableEntrada");
                    if (nombreVariable != null) {
                        LOGGER.info("Flujo: Valor de 'nombreVariableEntrada': {}", nombreVariable);
                    }

                    String resultadoTexto = "Información procesada por Spring Integration el " + new java.util.Date() + " para " + (nombreVariable != null ? nombreVariable : "N/A");
                    LOGGER.info("Flujo: Resultado del procesamiento: {}", resultadoTexto);

                    // Crear un Map para enviar a RabbitMQ
                    Map<String, Object> mensajeParaRabbit = new HashMap<>();
                    mensajeParaRabbit.put("processInstanceId", processInstanceId);
                    mensajeParaRabbit.put("datosProcesados", resultadoTexto);
                    mensajeParaRabbit.put("variableOriginal", nombreVariable); // Ejemplo de otra variable

                    return mensajeParaRabbit; // Devolvemos el Map
                })
                .log(LoggingHandler.Level.INFO, "procesarInformacionFlow", m -> "Mensaje preparado para RabbitMQ. Payload: " + m.getPayload())
                .handle(Amqp.outboundAdapter(this.rabbitTemplate)
                            .exchangeName(AmqpConfig.EXCHANGE_NAME)
                            .routingKey(AmqpConfig.ROUTING_KEY))
                .log(LoggingHandler.Level.INFO, "procesarInformacionFlow", m -> "Mensaje (Map) enviado a RabbitMQ.")
                .get();
    }
}