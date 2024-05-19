export interface Faltantes {
  aprobado: boolean,
  faltantesIdentificacion: Array<any>,
  faltantesPreguntas: Preguntas
}

interface Preguntas {
  gruas: Array<any>
  patios: Array<any>
  tramitesTransito: Array<any>
  deteccionInfracciones: Array<any>
  procesosContravencionales: Array<any>
  procesoCobroCoactivo: Array<any>
  procesoCobroPersuasivo: Array<any>
  recaudoMultas: Array<any>
  otros: Array<any>
}
