export interface CampoFormulario {
  id?: number;
  formularioId: number;
  campoId: number;
  nombreCampo?: string;    // info para mostrar
  etiquetaCampo?: string;  // info para mostrar
  requerido: boolean;
  visible: boolean;
  valorPorDefecto?: string;
  orden: number;
}
