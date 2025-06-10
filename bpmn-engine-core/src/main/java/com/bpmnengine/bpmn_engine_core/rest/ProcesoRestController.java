package com.bpmnengine.bpmn_engine_core.rest;

import org.camunda.bpm.engine.*;
import org.camunda.bpm.engine.form.FormField;
import org.camunda.bpm.engine.form.TaskFormData;
import org.camunda.bpm.engine.history.HistoricProcessInstance;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.camunda.bpm.engine.identity.Group;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.task.TaskQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.MediaType;

import com.bpmnengine.negocio.servicio.BusinessKeyService;
import org.camunda.bpm.engine.TaskService;

import com.bpmnengine.bpmn_engine_core.dto.TareaDetalleDto;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;

@RestController
@RequestMapping("/api/proceso")
@CrossOrigin(origins = "http://localhost:4200")
public class ProcesoRestController {

	private static final Logger LOGGER = LoggerFactory.getLogger(ProcesoRestController.class);

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private FormService formService;

	@Autowired
	private IdentityService identityService;

	@Autowired
	private RepositoryService repositoryService;

	@Autowired
	private HistoryService historyService;

	@Autowired
	private BusinessKeyService businessKeyService;

	@PostMapping("/iniciar-con-businesskey/{processDefinitionKey}")
	public ResponseEntity<String> iniciarProcesoConBusinessKey(@PathVariable String processDefinitionKey) {
		String businessKey = businessKeyService.generarBusinessKey(processDefinitionKey);

		ProcessInstance instance = runtimeService.startProcessInstanceByKey(processDefinitionKey, businessKey);

		return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(businessKey);
	}

	@GetMapping("/business-key/{processDefinitionKey}")
	public String generarBusinessKey(@PathVariable String processDefinitionKey) {
		return businessKeyService.generarBusinessKey(processDefinitionKey);
	}

	@GetMapping("/procesos")
	public ResponseEntity<List<Map<String, String>>> listarProcesosDisponibles() {
		try {
			LOGGER.info("Consultando procesos disponibles...");
			List<ProcessDefinition> definiciones = repositoryService.createProcessDefinitionQuery().latestVersion()
					.active().orderByProcessDefinitionKey().asc().list();

			LOGGER.info("Cantidad de definiciones encontradas: {}", definiciones.size());

			List<Map<String, String>> procesos = definiciones.stream().map(pd -> {
				LOGGER.info("Incluyendo proceso: {}", pd.getKey());
				Map<String, String> info = new HashMap<>();
				info.put("id", pd.getId());
				info.put("key", pd.getKey());
				info.put("name", pd.getName());
				return info;
			}).collect(Collectors.toList());

			return ResponseEntity.ok(procesos);
		} catch (Exception e) {
			LOGGER.error("Error al listar procesos disponibles: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
		}
	}

	@GetMapping("/historial/procesos")
	public ResponseEntity<List<Map<String, Object>>> listarProcesosHistoricos(
			@RequestParam(required = false) String iniciadoPor) {
		try {
			List<HistoricProcessInstance> instancias = historyService.createHistoricProcessInstanceQuery()
					.startedBy(iniciadoPor).orderByProcessInstanceStartTime().desc().list();

			List<Map<String, Object>> resultado = instancias.stream().map(p -> {
				Map<String, Object> mapa = new HashMap<>();
				mapa.put("id", p.getId());
				mapa.put("processDefinitionKey", p.getProcessDefinitionKey());
				mapa.put("startTime", p.getStartTime());
				mapa.put("endTime", p.getEndTime());
				return mapa;
			}).collect(Collectors.toList());

			return ResponseEntity.ok(resultado);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
		}
	}

	@GetMapping("/historial/tareas")
	public ResponseEntity<List<Map<String, Object>>> listarTareasHistoricas(@RequestParam String instanciaId) {
		try {
			List<HistoricTaskInstance> tareas = historyService.createHistoricTaskInstanceQuery()
					.processInstanceId(instanciaId).orderByHistoricActivityInstanceStartTime().asc().list();

			List<Map<String, Object>> resultado = tareas.stream().map(t -> {
				Map<String, Object> m = new HashMap<>();
				m.put("id", t.getId());
				m.put("name", t.getName());
				m.put("assignee", t.getAssignee());
				m.put("startTime", t.getStartTime());
				m.put("endTime", t.getEndTime());
				m.put("durationInMillis", t.getDurationInMillis());
				return m;
			}).collect(Collectors.toList());

			return ResponseEntity.ok(resultado);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
		}
	}

	@GetMapping("/tareas")
	public ResponseEntity<List<TareaSimpleDto>> obtenerTareas(@RequestParam(required = false) String asignado) {
		try {
			List<Task> tareas;

			if (asignado != null && !asignado.isEmpty()) {
				List<String> grupos = identityService.createGroupQuery().groupMember(asignado).list().stream()
						.map(Group::getId).collect(Collectors.toList());

				TaskQuery query = taskService.createTaskQuery().or().taskAssignee(asignado).taskCandidateUser(asignado);

				for (String grupo : grupos) {
					query = query.taskCandidateGroup(grupo);
				}

				tareas = query.endOr().active().orderByTaskCreateTime().desc().list();
			} else {
				tareas = taskService.createTaskQuery().active().orderByTaskCreateTime().desc().list();
			}

			List<TareaSimpleDto> tareasDto = tareas.stream()
					.map(task -> new TareaSimpleDto(task.getId(), task.getName(), task.getAssignee(),
							task.getCreateTime(), task.getProcessInstanceId(), task.getAssignee() != null))
					.collect(Collectors.toList());

			return ResponseEntity.ok(tareasDto);
		} catch (Exception e) {
			LOGGER.error("Error al obtener tareas: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
		}
	}

	@GetMapping("/tarea/{taskId}")
	public ResponseEntity<TareaSimpleDto> obtenerTareaPorId(@PathVariable String taskId) {
		try {
			LOGGER.info("Obteniendo tarea con ID: {}", taskId);
			Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
			if (task == null) {
				LOGGER.warn("Tarea no encontrada con ID: {}", taskId);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}
			TareaSimpleDto tareaDto = new TareaSimpleDto(task.getId(), task.getName(), task.getAssignee(),
					task.getCreateTime(), task.getProcessInstanceId(), task.getAssignee() != null);
			return ResponseEntity.ok(tareaDto);
		} catch (Exception e) {
			LOGGER.error("Error al obtener la tarea {}: {}", taskId, e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@PostMapping("/tarea/{taskId}/reclamar")
	public ResponseEntity<String> reclamarTarea(@PathVariable String taskId, @RequestBody UserIdDto userIdDto) {
		try {
			Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
			if (task == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarea no encontrada");
			if (task.getAssignee() != null)
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya asignada");
			taskService.claim(taskId, userIdDto.getUserId());
			return ResponseEntity.ok("Reclamada correctamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
		}
	}

	@PostMapping("/tarea/{taskId}/liberar")
	public ResponseEntity<String> liberarTarea(@PathVariable String taskId) {
		try {
			Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
			if (task == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarea no encontrada");
			taskService.setAssignee(taskId, null);
			return ResponseEntity.ok("Tarea liberada correctamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
		}
	}

	@GetMapping("/tarea/{taskId}/campos-formulario")
	public ResponseEntity<List<FormFieldDto>> obtenerCamposFormularioTarea(@PathVariable String taskId) {
		try {
			Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
			if (task == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
			}

			TaskFormData taskFormData = formService.getTaskFormData(taskId);
			if (taskFormData == null || taskFormData.getFormFields() == null) {
				return ResponseEntity.ok(Collections.emptyList());
			}

			List<FormFieldDto> formFieldsDto = new ArrayList<>();
			for (FormField formField : taskFormData.getFormFields()) {
				Object fieldValue = taskService.getVariable(taskId, formField.getId());
				formFieldsDto.add(new FormFieldDto(formField.getId(), formField.getLabel(),
						formField.getTypeName().toLowerCase(), fieldValue, formField.getProperties()));
			}

			return ResponseEntity.ok(formFieldsDto);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
		}
	}

	@PostMapping("/tarea/{taskId}/completar")
	public ResponseEntity<String> completarTarea(@PathVariable String taskId,
			@RequestBody(required = false) Map<String, Object> variables) {
		try {
			LOGGER.info("Completando tarea {} con variables: {}", taskId, variables);
			Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
			if (task == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarea no encontrada con ID: " + taskId);
			}
			if (variables != null && !variables.isEmpty()) {
				taskService.complete(taskId, variables);
			} else {
				taskService.complete(taskId);
			}
			return ResponseEntity.ok("Tarea completada exitosamente.");
		} catch (Exception e) {
			LOGGER.error("Error al completar la tarea {}: {}", taskId, e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al completar la tarea: " + e.getMessage());
		}
	}

	/*
	 * @GetMapping("/tareas-detalladas") public Map<String, Object>
	 * obtenerTareasDetalladas(
	 * 
	 * @RequestParam(defaultValue = "1") int page,
	 * 
	 * @RequestParam(defaultValue = "10") int size) {
	 * 
	 * // Spring y Camunda son 1-based para paginación, Angular normalmente es
	 * 1-based // pero Camunda TaskQuery usa 0-based para firstResult. int
	 * firstResult = (page - 1) * size;
	 * 
	 * long totalElements = taskService.createTaskQuery().active().count();
	 * 
	 * List<Task> tareas = taskService.createTaskQuery() .active()
	 * .orderByTaskCreateTime().desc() .listPage(firstResult, size);
	 * 
	 * List<TareaDetalleDto> tareaDtos = tareas.stream().map(task -> { String
	 * businessKey = runtimeService.createProcessInstanceQuery()
	 * .processInstanceId(task.getProcessInstanceId()) .singleResult()
	 * .getBusinessKey();
	 * 
	 * return new TareaDetalleDto( task.getId(), task.getName(), task.getAssignee(),
	 * task.getCreateTime(), task.getProcessInstanceId(), businessKey );
	 * }).collect(Collectors.toList());
	 * 
	 * int totalPages = (int) Math.ceil((double) totalElements / size);
	 * 
	 * Map<String, Object> response = new HashMap<>(); response.put("content",
	 * tareaDtos); response.put("totalPages", totalPages);
	 * response.put("totalElements", totalElements); response.put("page", page);
	 * response.put("size", size);
	 * 
	 * return response; }
	 */
	@GetMapping("/tareas-detalladas")
	public Map<String, Object> obtenerTareasDetalladas(@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String procesoNombre,
			@RequestParam(required = false) String businessKey,
			@RequestParam(required = false) String fechaDesdeProceso,
			@RequestParam(required = false) String fechaHastaProceso,
			@RequestParam(required = false) String fechaDesdeTarea,
			@RequestParam(required = false) String fechaHastaTarea, @RequestParam(required = false) String usuario,
			@RequestParam(required = false) String tareaNombre, @RequestParam(required = false) String estado,
			@RequestParam(required = false) String periodo, @RequestParam(required = false) String usuarioAceptado) {

		TaskQuery query = taskService.createTaskQuery().active();

		// -- Filtros básicos
		if (usuario != null && !usuario.isEmpty()) {
			query = query.or().taskAssignee(usuario).taskCandidateUser(usuario);
			List<String> grupos = identityService.createGroupQuery().groupMember(usuario).list().stream()
					.map(Group::getId).collect(Collectors.toList());
			for (String grupo : grupos) {
				query = query.taskCandidateGroup(grupo);
			}
			query = query.endOr();
		}

		if (businessKey != null && !businessKey.isEmpty()) {
			List<String> procIds = runtimeService.createProcessInstanceQuery().processInstanceBusinessKey(businessKey)
					.list().stream().map(ProcessInstance::getId).collect(Collectors.toList());
			if (!procIds.isEmpty())
				query = query.processInstanceIdIn(procIds.toArray(new String[0]));
			else
				query = query.processInstanceId("NO_EXISTE");
		}

		List<Task> tareas = query.orderByTaskCreateTime().desc().list();

		// -- Filtro por nombre de proceso (en memoria)
		if (procesoNombre != null && !procesoNombre.isEmpty()) {
			final List<String> idsDefinicionFiltrar = repositoryService.createProcessDefinitionQuery()
					.processDefinitionNameLike("%" + procesoNombre + "%").list().stream().map(ProcessDefinition::getId)
					.collect(Collectors.toList());
			tareas = tareas.stream().filter(t -> idsDefinicionFiltrar.contains(t.getProcessDefinitionId()))
					.collect(Collectors.toList());
		}

		// -- Filtro por fecha de creación del proceso
		if ((fechaDesdeProceso != null && !fechaDesdeProceso.isEmpty())
				|| (fechaHastaProceso != null && !fechaHastaProceso.isEmpty())) {
			tareas = tareas.stream().filter(t -> {
				HistoricProcessInstance historicPi = historyService.createHistoricProcessInstanceQuery()
						.processInstanceId(t.getProcessInstanceId()).singleResult();
				Date fechaCreacionProceso = historicPi != null ? historicPi.getStartTime() : null;
				boolean match = true;
				if (fechaDesdeProceso != null && !fechaDesdeProceso.isEmpty()) {
					match &= fechaCreacionProceso != null
							&& fechaCreacionProceso.after(fechaStringToDate(fechaDesdeProceso, true));
				}
				if (fechaHastaProceso != null && !fechaHastaProceso.isEmpty()) {
					match &= fechaCreacionProceso != null
							&& fechaCreacionProceso.before(fechaStringToDate(fechaHastaProceso, false));
				}
				return match;
			}).collect(Collectors.toList());
		}

		// -- Filtro por fecha de creación de la tarea
		if ((fechaDesdeTarea != null && !fechaDesdeTarea.isEmpty())
				|| (fechaHastaTarea != null && !fechaHastaTarea.isEmpty())) {
			tareas = tareas.stream().filter(t -> {
				boolean match = true;
				if (fechaDesdeTarea != null && !fechaDesdeTarea.isEmpty()) {
					match &= t.getCreateTime().after(fechaStringToDate(fechaDesdeTarea, true));
				}
				if (fechaHastaTarea != null && !fechaHastaTarea.isEmpty()) {
					match &= t.getCreateTime().before(fechaStringToDate(fechaHastaTarea, false));
				}
				return match;
			}).collect(Collectors.toList());
		}

		// -- Filtro por nombre de tarea
		if (tareaNombre != null && !tareaNombre.isEmpty()) {
			tareas = tareas.stream().filter(t -> t.getName() != null && t.getName().equalsIgnoreCase(tareaNombre))
					.collect(Collectors.toList());
		}

		// -- Filtro por estado (reservada = solo asignadas al usuario)
		if (estado != null && estado.equalsIgnoreCase("reservada") && usuarioAceptado != null
				&& !usuarioAceptado.isEmpty()) {
			tareas = tareas.stream().filter(t -> usuarioAceptado.equals(t.getAssignee())).collect(Collectors.toList());
		}
		// Si estado="todos", no se filtra nada adicional

		// -- Filtro por periodo (hoy, ayer, semana, mes)
		if (periodo != null && !periodo.isEmpty()) {
			Date[] rango = getRangoFechasPorPeriodo(periodo);
			if (rango[0] != null)
				tareas = tareas.stream().filter(t -> t.getCreateTime().after(rango[0])).collect(Collectors.toList());
			if (rango[1] != null)
				tareas = tareas.stream().filter(t -> t.getCreateTime().before(rango[1])).collect(Collectors.toList());
		}

		// -- Paginación y mapeo igual que antes --
		int totalElements = tareas.size();
		int totalPages = (int) Math.ceil((double) totalElements / size);

		int fromIndex = Math.max((page - 1) * size, 0);
		int toIndex = Math.min(fromIndex + size, totalElements);
		List<Task> tareasPagina = (fromIndex < toIndex) ? tareas.subList(fromIndex, toIndex) : Collections.emptyList();

		List<TareaDetalleDto> tareaDtos = tareasPagina.stream().map(task -> {
			String businessKeyTask = runtimeService.createProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId()).singleResult().getBusinessKey();

			ProcessDefinition def = repositoryService.createProcessDefinitionQuery()
					.processDefinitionId(task.getProcessDefinitionId()).singleResult();
			String nombreProcesoDto = def != null ? def.getName() : "";

			return new TareaDetalleDto(task.getId(), task.getName(), task.getAssignee(), task.getCreateTime(),
					task.getProcessInstanceId(), businessKeyTask, nombreProcesoDto);
		}).collect(Collectors.toList());

		Map<String, Object> response = new HashMap<>();
		response.put("content", tareaDtos);
		response.put("totalPages", totalPages);
		response.put("totalElements", totalElements);
		response.put("page", page);
		response.put("size", size);

		return response;
	}

	// --- Utilidades ---
	private Date fechaStringToDate(String fecha, boolean inicioDia) {
		try {
			String[] partes = fecha.split("-");
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.YEAR, Integer.parseInt(partes[0]));
			cal.set(Calendar.MONTH, Integer.parseInt(partes[1]) - 1);
			cal.set(Calendar.DAY_OF_MONTH, Integer.parseInt(partes[2]));
			if (inicioDia) {
				cal.set(Calendar.HOUR_OF_DAY, 0);
				cal.set(Calendar.MINUTE, 0);
				cal.set(Calendar.SECOND, 0);
				cal.set(Calendar.MILLISECOND, 0);
			} else {
				cal.set(Calendar.HOUR_OF_DAY, 23);
				cal.set(Calendar.MINUTE, 59);
				cal.set(Calendar.SECOND, 59);
				cal.set(Calendar.MILLISECOND, 999);
			}
			return cal.getTime();
		} catch (Exception e) {
			return null;
		}
	}

	private Date[] getRangoFechasPorPeriodo(String periodo) {
		LocalDate now = LocalDate.now();
		Calendar cal = Calendar.getInstance();
		Date desde = null, hasta = null;
		switch (periodo) {
		case "hoy":
			cal.set(now.getYear(), now.getMonthValue() - 1, now.getDayOfMonth(), 0, 0, 0);
			desde = cal.getTime();
			cal.set(now.getYear(), now.getMonthValue() - 1, now.getDayOfMonth(), 23, 59, 59);
			hasta = cal.getTime();
			break;
		case "ayer":
			LocalDate ayer = now.minusDays(1);
			cal.set(ayer.getYear(), ayer.getMonthValue() - 1, ayer.getDayOfMonth(), 0, 0, 0);
			desde = cal.getTime();
			cal.set(ayer.getYear(), ayer.getMonthValue() - 1, ayer.getDayOfMonth(), 23, 59, 59);
			hasta = cal.getTime();
			break;
		case "semana":
			LocalDate inicioSemana = now.minusDays(6);
			cal.set(inicioSemana.getYear(), inicioSemana.getMonthValue() - 1, inicioSemana.getDayOfMonth(), 0, 0, 0);
			desde = cal.getTime();
			cal.set(now.getYear(), now.getMonthValue() - 1, now.getDayOfMonth(), 23, 59, 59);
			hasta = cal.getTime();
			break;
		case "mes":
			LocalDate inicioMes = now.minusDays(29);
			cal.set(inicioMes.getYear(), inicioMes.getMonthValue() - 1, inicioMes.getDayOfMonth(), 0, 0, 0);
			desde = cal.getTime();
			cal.set(now.getYear(), now.getMonthValue() - 1, now.getDayOfMonth(), 23, 59, 59);
			hasta = cal.getTime();
			break;
		}
		return new Date[] { desde, hasta };
	}

}

class TareaSimpleDto {
	public String id;
	public String nombre;
	public String asignado;
	public Date fechaCreacion;
	public String processInstanceId;
	public boolean reclamada;

	public TareaSimpleDto(String id, String nombre, String asignado, Date fechaCreacion, String processInstanceId,
			boolean reclamada) {
		this.id = id;
		this.nombre = nombre;
		this.asignado = asignado;
		this.fechaCreacion = fechaCreacion;
		this.processInstanceId = processInstanceId;
		this.reclamada = reclamada;
	}

}

class UserIdDto {
	private String userId;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

}

class FormFieldDto {
	public String id;
	public String label;
	public String type;
	public Object value;
	public Map<String, String> properties;

	public FormFieldDto(String id, String label, String type, Object value, Map<String, String> properties) {
		this.id = id;
		this.label = label;
		this.type = type;
		this.value = value;
		this.properties = properties;
	}
}
