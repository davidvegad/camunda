package com.bpmnengine.negocio.repositorio;

import com.bpmnengine.negocio.entidad.BusinessKeyCounter;
import com.bpmnengine.negocio.entidad.BusinessKeyCounterId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessKeyCounterRepository extends JpaRepository<BusinessKeyCounter, BusinessKeyCounterId> {}
