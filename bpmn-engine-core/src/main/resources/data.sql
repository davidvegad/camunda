USE business_db;

-- Elimina tablas si existen (solo para pruebas/desarrollo)
DROP TABLE IF EXISTS tarea_cabecera;
DROP TABLE IF EXISTS tarea_formulario;
DROP TABLE IF EXISTS formulario_registro;
DROP TABLE IF EXISTS formulario_campo;
DROP TABLE IF EXISTS campo;
DROP TABLE IF EXISTS formulario;

-- Tabla principal de formularios
CREATE TABLE formulario (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE campo (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_campo VARCHAR(255) NOT NULL,
    etiqueta VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    placeholder VARCHAR(255),
    mensajeError VARCHAR(255),
    opciones VARCHAR(255),
    validacionRegex VARCHAR(255)
);

CREATE TABLE formulario_campo (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    formulario_id BIGINT NOT NULL,
    campo_id BIGINT NOT NULL,
    orden INT,
    requerido BIT,
    valor_por_defecto VARCHAR(255),
    visible BIT,
    FOREIGN KEY (formulario_id) REFERENCES formulario(id),
    FOREIGN KEY (campo_id) REFERENCES campo(id)
);

CREATE TABLE formulario_registro (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fecha_creacion DATETIME(6),
    tarea_id_camunda VARCHAR(255) NOT NULL,
    usuario VARCHAR(255),
    valores_json TINYTEXT,
    formulario_id BIGINT,
    FOREIGN KEY (formulario_id) REFERENCES formulario(id)
);

CREATE TABLE tarea_formulario (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    proceso_key VARCHAR(255) NOT NULL,
    task_definition_key VARCHAR(255) NOT NULL,
    formulario_id BIGINT NOT NULL,
    orden_tab INT NOT NULL,
    FOREIGN KEY (formulario_id) REFERENCES formulario(id)
);

CREATE TABLE tarea_cabecera (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    procesoKey VARCHAR(255),
    taskDefinitionKey VARCHAR(255),
    nombreVariable VARCHAR(255),
    etiqueta VARCHAR(255),
    orden INT
);

-- ========== Formulario 1: Solicitud de Vacaciones ==========

INSERT INTO formulario (nombre, descripcion)
VALUES ('Solicitud de Vacaciones', 'Formulario de vacaciones');

INSERT INTO campo (id, nombre_campo, etiqueta, tipo, placeholder, mensajeError, opciones, validacionRegex)
VALUES
  (1, 'usuario', 'Usuario', 'text', 'Usuario', 'Requerido', NULL, NULL),
  (2, 'fechaInicio', 'Fecha de Inicio', 'date', NULL, 'Fecha requerida', NULL, NULL),
  (3, 'dias', 'Días de Vacaciones', 'number', 'Días', 'Cantidad requerida', NULL, '^[0-9]{1,2}$');

INSERT INTO formulario_campo (id, formulario_id, campo_id, orden, requerido, valor_por_defecto, visible)
VALUES
  (1, 1, 1, 1, 1, NULL, 1),
  (2, 1, 2, 2, 1, NULL, 1),
  (3, 1, 3, 3, 1, NULL, 1);

INSERT INTO tarea_formulario (id, proceso_key, task_definition_key, formulario_id, orden_tab)
VALUES (1, 'Process_1euowey', 'Activity_1lnrdkf', 1, 1);

-- ========== Formulario 2: Solicitud de Permiso ==========

INSERT INTO formulario (nombre, descripcion)
VALUES ('Solicitud de Permiso', 'Formulario para pedir permiso personal');

INSERT INTO campo (id, nombre_campo, etiqueta, tipo, placeholder, mensajeError, opciones, validacionRegex)
VALUES
  (4, 'usuario', 'Usuario', 'text', 'Usuario', 'Requerido', NULL, NULL),
  (5, 'motivo', 'Motivo', 'textarea', 'Motivo del permiso', 'Motivo requerido', NULL, NULL),
  (6, 'fechaInicio', 'Fecha de Inicio', 'date', NULL, 'Fecha requerida', NULL, NULL);

INSERT INTO formulario_campo (id, formulario_id, campo_id, orden, requerido, valor_por_defecto, visible)
VALUES
  (4, 2, 4, 1, 1, NULL, 1),
  (5, 2, 5, 2, 1, NULL, 1),
  (6, 2, 6, 3, 1, NULL, 1);

INSERT INTO tarea_formulario (id, proceso_key, task_definition_key, formulario_id, orden_tab)
VALUES (2, 'Process_0v8e7t4', 'Activity_1lmlacj', 2, 1);

-- ========== Formulario 3: Solicitud de Equipo (select) ==========

INSERT INTO formulario (nombre, descripcion)
VALUES ('Solicitud de Equipo', 'Formulario para solicitar equipo');

INSERT INTO campo (id, nombre_campo, etiqueta, tipo, placeholder, mensajeError, opciones, validacionRegex)
VALUES
  (7, 'usuario', 'Usuario', 'text', 'Usuario', 'Requerido', NULL, NULL),
  (8, 'tipo_equipo', 'Tipo de equipo', 'select', NULL, 'Tipo requerido', 'Laptop,Desktop,Monitor,Teclado,Mouse', NULL),
  (9, 'motivo', 'Motivo', 'textarea', 'Motivo', 'Motivo requerido', NULL, NULL);

INSERT INTO formulario_campo (id, formulario_id, campo_id, orden, requerido, valor_por_defecto, visible)
VALUES
  (7, 3, 7, 1, 1, NULL, 1),
  (8, 3, 8, 2, 1, 'Laptop', 1),
  (9, 3, 9, 3, 1, NULL, 1);

INSERT INTO tarea_formulario (id, proceso_key, task_definition_key, formulario_id, orden_tab)
VALUES (3, 'Process_1euowey', 'Activity_1lnrdkf', 3, 2);

-- ========== Formulario 4: Justificación de Gasto (valida regex) ==========

INSERT INTO formulario (nombre, descripcion)
VALUES ('Justificación de Gasto', 'Formulario para justificar gastos extraordinarios');

INSERT INTO campo (id, nombre_campo, etiqueta, tipo, placeholder, mensajeError, opciones, validacionRegex)
VALUES
  (10, 'usuario', 'Usuario', 'text', 'Usuario', 'Requerido', NULL, NULL),
  (11, 'monto', 'Monto (USD)', 'number', 'Monto en USD', 'Monto requerido', NULL, '^[0-9]+(\\.[0-9]{1,2})?$'),
  (12, 'fecha', 'Fecha del gasto', 'date', NULL, 'Fecha requerida', NULL, NULL),
  (13, 'descripcion', 'Descripción', 'textarea', 'Detalle', 'Detalle requerido', NULL, NULL),
  (14, 'aprobador', 'Aprobador', 'text', NULL, NULL, NULL, NULL);

INSERT INTO formulario_campo (id, formulario_id, campo_id, orden, requerido, valor_por_defecto, visible)
VALUES
  (10, 4, 10, 1, 1, NULL, 1),
  (11, 4, 11, 2, 1, NULL, 1),
  (12, 4, 12, 3, 1, NULL, 1),
  (13, 4, 13, 4, 1, NULL, 1),
  (14, 4, 14, 5, 0, 'admin', 0); -- campo oculto

INSERT INTO tarea_formulario (id, proceso_key, task_definition_key, formulario_id, orden_tab)
VALUES (4, 'Process_0v8e7t4', 'Activity_1lmlacj', 4, 2);

-- ========== Ejemplo de cabeceras por tarea/proceso ==========

INSERT INTO tarea_cabecera (id, procesoKey, taskDefinitionKey, nombreVariable, etiqueta, orden)
VALUES
  (1, 'Process_1euowey', 'Activity_1lnrdkf', 'usuario', 'Usuario', 1),
  (2, 'Process_1euowey', 'Activity_1lnrdkf', 'fechaInicio', 'Fecha de inicio', 2),
  (3, 'Process_1euowey', 'Activity_1lnrdkf', 'dias', 'Días', 3),
  (4, 'Process_0v8e7t4', 'Activity_1lmlacj', 'usuario', 'Usuario', 1),
  (5, 'Process_0v8e7t4', 'Activity_1lmlacj', 'motivo', 'Motivo', 2);

-- ========== Registros de prueba ==========

INSERT INTO formulario_registro (fecha_creacion, tarea_id_camunda, usuario, valores_json, formulario_id)
VALUES
  (NOW(), 'Task_12345', 'usuario1', '{"usuario":"usuario1","fechaInicio":"2025-07-10","dias":5}', 1),
  (NOW(), 'Task_54321', 'usuario2', '{"usuario":"usuario2","motivo":"Motivo personal","fechaInicio":"2025-07-15"}', 2),
  (NOW(), 'Task_99999', 'usuario1', '{"usuario":"usuario1","tipo_equipo":"Laptop","motivo":"Nuevo proyecto"}', 3);