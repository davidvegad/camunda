package com.bpmnengine.bpmn_engine_core.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.*;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.*;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.boot.jdbc.DataSourceBuilder;


import java.util.HashMap;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "com.bpmnengine.negocio.repositorio",
    entityManagerFactoryRef = "businessEntityManager",
    transactionManagerRef = "businessTransactionManager"
)
@EntityScan(basePackages = "com.bpmnengine.negocio.entidad")
public class BusinessDataSourceConfig {

    @Bean(name = "businessDataSource")
    @ConfigurationProperties(prefix = "business.datasource")
    public DataSource businessDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "businessEntityManager")
    public LocalContainerEntityManagerFactoryBean businessEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("businessDataSource") DataSource dataSource) {

        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.show_sql", true);

        return builder
                .dataSource(dataSource)
                .packages("com.bpmnengine.negocio.entidad")
                .persistenceUnit("business")
                .properties(properties)
                .build();
    }

    @Bean(name = "businessTransactionManager")
    public PlatformTransactionManager businessTransactionManager(
            @Qualifier("businessEntityManager") LocalContainerEntityManagerFactoryBean businessEntityManagerFactory) {
        return new JpaTransactionManager(businessEntityManagerFactory.getObject());
    }
}
