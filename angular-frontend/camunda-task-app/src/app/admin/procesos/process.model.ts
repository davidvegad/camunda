export interface Proceso {
  id?: number;
  nombre: string;
  processKey: string;
  descripcion: string;
  palabrasClave: string[]; // <--- ahora string[]
}
