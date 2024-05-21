import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Encuesta } from '../../modelos/Encuesta';
import { ClasificacionEncuestaComponent } from '../clasificacion-encuesta/clasificacion-encuesta.component';
import { Respuesta } from '../../modelos/Respuesta';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RespuestaInvalida } from '../../modelos/RespuestaInvalida';
import { RespuestaVerificacion } from '../../modelos/RespuestaVerificacion';
import { ServicioVerificaciones } from 'src/app/verificaciones/servicios/verificaciones.service';
import { Maestra } from 'src/app/verificaciones/modelos/Maestra';
import { DialogosEncuestas } from '../../dialogos-encuestas';
import { Sede } from 'src/app/informacion-general/modelos/Sede';
import { TablaSedesComponent } from 'src/app/informacion-general/componentes/tabla-sedes/tabla-sedes.component';
import { PatioACrear } from 'src/app/informacion-general/modelos/PatioACrear';
import { TablaPatiosComponent } from 'src/app/informacion-general/componentes/tabla-patios/tabla-patios.component';
import { EmpresaJurisdiccionACrear } from 'src/app/informacion-general/modelos/EmpresaJurisdiccionACrear';
import { TablaEmpresasJurisdiccionComponent } from 'src/app/informacion-general/componentes/tabla-empresas-jurisdiccion/tabla-empresas-jurisdiccion.component';
import { ServicioTarifas } from 'src/app/tarifas/servicios/tarifas.service';
import { Tarifa } from 'src/app/tarifas/modelos/Tarifa';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  @Input('encuesta') encuesta!: Encuesta
  @Input('idReporte') idReporte!: number
  @Input('idEncuesta') idEncuesta!: number
  @Input('idVigilado') idVigilado!: string
  @Input('soloLectura') soloLectura: boolean = true
  @Input('justificable') justificable: boolean = false
  @Input('camposDeVerificacion') camposDeVerificacion: boolean = false
  @Input('camposDeVerificacionVisibles') camposDeVerificacionVisibles: boolean = true

  @Output() hanHabidoCambios: EventEmitter<boolean>
  @Output() encuestaGuardada: EventEmitter<void> 

  @ViewChildren('clasificacion') clasificaciones!: QueryList<ClasificacionEncuestaComponent>
  @ViewChild('tablaSedes') tablaSedes!: TablaSedesComponent
  @ViewChild('tablaPatios') tablaPatios!: TablaPatiosComponent
  @ViewChild('tablaEmpresas') tablaEmpresas!: TablaEmpresasJurisdiccionComponent
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('contenedorEncuesta') contenedorEncuesta!: ElementRef
  
  respuestas: Respuesta[] = []
  sedes: Sede[] = []
  patiosACrear: PatioACrear[] = []
  patiosAEliminar: number[] = []
  empresasACrear: EmpresaJurisdiccionACrear[] = []
  empresasAEliminar: number[] = []
  verificaciones: RespuestaVerificacion[] = []
  hayCambios: boolean = false
  opcionesCumplimiento: Maestra[] = []
  opcionesCorrespondencia: Maestra[] = []
  sedeRequerida: boolean = false
  patioRequerido: boolean = false
  empresaRequerida: boolean = false
  tarifas: Tarifa[] = []
  
  constructor(
    private servicioEncuestas: ServicioEncuestas,
    private servicioVerificacion: ServicioVerificaciones,
  ){
    this.hanHabidoCambios = new EventEmitter<boolean>();
    this.encuestaGuardada = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.obtenerOpcionesCumplimientoYCorrespondencia()
    this.sedes = [ ...this.encuesta.sedes ]
  }

  //Obtener recursos
  obtenerRespuestas(): Respuesta[]{
    this.respuestas = []
    this.clasificaciones.forEach(clasificacion => {
      this.respuestas = [ ...this.respuestas, ...clasificacion.obtenerRespuestas()]
    })
    return this.respuestas
  }

  obtenerVerificaciones(): RespuestaVerificacion[]{
    this.verificaciones = []
    this.clasificaciones.forEach(clasificacion => {
      this.verificaciones = [ ...this.verificaciones, ...clasificacion.obtenerVerificaciones()]
    })
    return this.verificaciones
  }

  obtenerOpcionesCumplimientoYCorrespondencia(){
    this.servicioVerificacion.obtenerOpcionesCumplimiento().subscribe({
      next: (opciones)=>{
        this.opcionesCumplimiento = opciones
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_TITULO, 
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_DESCRIPCION
        )
      }
    })
    this.servicioVerificacion.obtenerOpcionesCorrespondencia().subscribe({
      next: (opciones)=>{
        this.opcionesCorrespondencia = opciones
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_TITULO,
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_DESCRIPCION
        )
      }
    })
  }
  
  //Manejadores de eventos
  alResponderPreguntas(respuestas: any){
    this.setHayCambios(true)
  }

  manejarNuevasSedes(nuevasSedes: Sede[]){
    this.sedes = nuevasSedes
    this.setHayCambios(true)
  }

  manejarPatiosACrear(patiosACrear: PatioACrear[]){
    this.patiosACrear = patiosACrear
    this.setHayCambios(true)
  }

  manejarPatiosAEliminar(patiosAEliminar: number[]){
    this.patiosAEliminar = patiosAEliminar
    this.setHayCambios(true)
  }

  manejarEmpresasACrear(empresasACrear: EmpresaJurisdiccionACrear[]){
    this.empresasACrear = empresasACrear
    this.setHayCambios(true)
  }

  manejarEmpresasAEliminar(empresasAEliminar: number[]){
    this.empresasAEliminar = empresasAEliminar
    this.setHayCambios(true)
  }

  alResponderVerificaciones(verificacion: any){
    this.setHayCambios(true)
  }

  manejarErrorCargaArchivo(error: HttpErrorResponse){
    this.popup.abrirPopupFallido('Error al cargar el archivo', 'Intentalo más tarde.')
  }

  manejarArchivoExcedeTamano(tamano: number){
    this.popup.abrirPopupFallido('Limite de tamaño excedido.', `El archivo debe pesar como máximo ${tamano} megabytes.`)
  }

  //Acciones
  guardarRespuestas(){
    this.servicioEncuestas.guardarRespuesta(this.idReporte, { 
      respuestas: this.obtenerRespuestas(), 
      sedes: this.sedes,
      guardarPatios: this.patiosACrear,
      eliminarPatios: this.patiosAEliminar,
      guardarEmpresas: this.empresasACrear,
      eliminarEmpresas: this.empresasAEliminar
    }).subscribe({
      next: ( respuesta ) =>{
        this.popup.abrirPopupExitoso(respuesta.mensaje)
        this.sedeRequerida = false
        this.empresaRequerida = false
        this.patiosACrear = []
        this.patiosAEliminar = []
        this.empresasACrear = []
        this.empresasAEliminar = []
        this.tablaSedes.limpiarRegistrosEnRam()
        this.tablaPatios.limpiarRegistrosEnRam()
        this.tablaEmpresas.limpiarRegistrosEnRam()
        this.setHayCambios(false)
        this.encuestaGuardada.emit()
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })

  }

  guardarVerificaciones(){
    this.servicioVerificacion.guardarVerificaciones(this.idReporte, this.obtenerVerificaciones()).subscribe({
      next: ( respuesta: any ) =>{
        this.popup.abrirPopupExitoso('Se han guardado las verificaciones')
        this.setHayCambios(false)
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })
  }

  resaltarRespuestasInvalidas(invalidas: RespuestaInvalida[]){ //reemplazar esto por un observable
    this.clasificaciones.forEach( clasificacion =>{
      clasificacion.resaltarRespuestasInvalidas(invalidas)
    })
  }

  exportarPDF(){
    window.print()
  }

  setHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
    this.hanHabidoCambios.emit(hayCambios)
  }
}
