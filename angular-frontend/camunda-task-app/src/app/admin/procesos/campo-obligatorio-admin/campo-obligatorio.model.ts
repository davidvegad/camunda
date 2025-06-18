export interface CampoObligatorio {
  id?: number;
  docExtensiones?: string;
  esDocumento: boolean;
  etiqueta: string;
  nombre: string;
  regexValidacion?: string;
  tipo: string;
  procesoId: number;
}
