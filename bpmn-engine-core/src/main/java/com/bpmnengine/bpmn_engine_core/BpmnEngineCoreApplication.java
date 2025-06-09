package com.bpmnengine.bpmn_engine_core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@ComponentScan(basePackages = {
    "com.bpmnengine.bpmn_engine_core",     // tus controladores, listeners, delegates
    "com.bpmnengine.negocio"               // el nuevo schema: entidad, repositorio, servicio
})


@SpringBootApplication
public class BpmnEngineCoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(BpmnEngineCoreApplication.class, args);
	}

}
