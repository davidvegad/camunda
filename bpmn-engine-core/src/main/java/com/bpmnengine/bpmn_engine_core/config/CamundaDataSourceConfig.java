package com.bpmnengine.bpmn_engine_core.config;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class CamundaDataSourceConfig {

    /**
     * Configuración de propiedades para el datasource principal (Camunda).
     */
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties camundaDataSourceProperties() {
        return new DataSourceProperties();
    }

    /**
     * Bean principal de DataSource, usado por Camunda.
     */
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.hikari")
    public DataSource camundaDataSource() {
        return camundaDataSourceProperties().initializeDataSourceBuilder().build();
    }
}
