package com.bpmnengine.bpmn_engine_core.config; // O el paquete donde tengas esta clase

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmqpConfig { // O RabbitMqConfig, el nombre que estés usando

    // --- ASEGÚRATE DE QUE ESTAS CONSTANTES SEAN public static final ---
    public static final String EXCHANGE_NAME = "mi.topic.exchange";
    public static final String QUEUE_NAME = "mi.cola.de.procesamiento";
    public static final String ROUTING_KEY = "evento.procesado";
    // --- FIN DE LA VERIFICACIÓN DE CONSTANTES ---

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    Queue queue() {
        // durable: true (la cola sobrevive a reinicios del broker)
        return new Queue(QUEUE_NAME, true); // Usa la constante
    }

    @Bean
    TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME); // Usa la constante
    }

    @Bean
    Binding binding(Queue queue, TopicExchange exchange) {
        // Usa las constantes
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
    }
}