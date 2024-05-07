import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Actividad } from '../../modelos/FormularioEjecucion';
import { RespuestaActividad } from '../../modelos/RespuestaActividad';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { bindNodeCallback } from 'rxjs';

@Component({
  selector: 'app-actividad-form-ejec',
  templateUrl: './actividad-form-ejec.component.html',
  styleUrls: ['./actividad-form-ejec.component.css']
})
export class ActividadFormEjecComponent implements OnInit{
  @Output() nuevaActividad: EventEmitter<RespuestaActividad>
  @Input() actividad!: Actividad
  @Input() idVigilado!: string
  @Input() invalida: boolean = false
  @Input() soloLectura: boolean = false

  respuesta: string = ""
  evidencia: File | null = null;

  respuestaActividad?: RespuestaActividad

  constructor(private servicioArchivo: ServicioArchivos){
    this.nuevaActividad = new EventEmitter<RespuestaActividad>();
  }

  ngOnInit(): void {
    this.respuesta = this.actividad.respuesta
    this.respuestaActividad = {
      preguntaId: this.actividad.datoId,
      documento: "",
      nombreArchivo: "",
      ruta: "",
      valor: ""
    }
  }

  descargarEvidencia(){
    this.servicioArchivo.descargarArchivo(this.actividad.documento, this.actividad.ruta, this.actividad.nombreOriginal)
  }

  manejarCambioRespuesta(respuesta: string){
    this.setRespuesta(respuesta)
  }

  manejarCambioArchivo(archivo: File | null){
    this.setEvidencia(archivo)
  }

  obtenerPorcentajeDeCumplimiento(): string{
    const ejecutadas = this.respuesta !== "" ? Number(this.respuesta) : 0;
    const planeadas = this.actividad.planeado as any !== "" ? this.actividad.planeado : 0;
    if(planeadas == 0) return "Sin actividades planeadas";
    const porcentaje = (ejecutadas * 100 / planeadas)
    const residuo = (ejecutadas * 100 % planeadas)
    return residuo !== 0 ? `${porcentaje.toFixed(2)} %`  : `${porcentaje.toString()} %` 
  }

  setRespuesta(valor: string, emitir: boolean = true){
    this.respuesta = valor
    if(this.respuestaActividad) this.respuestaActividad.valor = valor;
    if(emitir) this.nuevaActividad.emit(this.respuestaActividad);
  }

  setEvidencia(archivo: File | null, emitir: boolean = true){
    this.evidencia = archivo
    if(archivo){
      this.servicioArchivo.guardarArchivo(archivo, 'peccit', this.idVigilado).subscribe({
        next: (respuesta)=>{
          this.respuestaActividad = {
            preguntaId: this.actividad.datoId,
            documento: respuesta.nombreAlmacenado,
            nombreArchivo: respuesta.nombreOriginalArchivo,
            ruta: respuesta.ruta,
            valor: this.respuesta
          }
          if(emitir){
            this.nuevaActividad.emit(this.respuestaActividad);
            console.log('actividad emitida', this.respuestaActividad)
          } 
          
        }
      })
    }else{
      this.respuestaActividad = {
        preguntaId: this.actividad.datoId,
        documento: "",
        nombreArchivo: "",
        ruta: "",
        valor: this.respuesta
      }
      if(emitir){
        this.nuevaActividad.emit(this.respuestaActividad);
        console.log('actividad emitida', this.respuestaActividad)
      }
    }
  }
}
