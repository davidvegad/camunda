export interface Campo {
  id?: number;
  etiqueta: string;
  mensajeError?: string;
  nombreCampo: string;
  opciones?: string;
  placeholder?: string;
  tipo: string;
  validacionRegex?: string;
}
