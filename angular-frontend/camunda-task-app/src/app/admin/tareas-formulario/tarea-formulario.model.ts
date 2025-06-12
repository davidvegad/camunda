export interface TareaFormulario {
  id?: number;
  procesoKey: string;
  taskDefinitionKey: string;
  ordenTab: number;
  formularioId: number;
  nombreFormulario?: string; // Info para mostrar
}
