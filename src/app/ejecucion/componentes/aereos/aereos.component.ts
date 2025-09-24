import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Pregunta } from '../../modelos/Preguntas';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';

@Component({
  selector: 'app-concesiones',
  templateUrl: './aereos.component.html',
  styleUrls: ['./aereos.component.css']
})
export class AereosComponent implements OnInit, OnChanges {
  usuario: Usuario | null = null
  rol: Rol | null = null
  nitVigilado?: string
  nombreVigilado?: string

  @ViewChild('popup') popup!: PopupComponent
  hayCambios: boolean = false

  soloLectura: boolean = false
  aprobado: boolean = false
  editable: boolean = true
  faltantes: number[] = []

  //Variables select tabla 1
  selectL1: string = ""; selectL2: string = ""; selectL3: string = ""; selectL4: string = "";
  selectL5: string = ""; selectL6: string = ""; selectL7: string = ""; numberL8: string = "";
  selectL9: string = ""; selectL10: string = ""; selectL11: string = ""; selectL12: string = "";
  selectL13: string = ""; selectL14: string = ""; selectL15: string = "";
  //Variables select tabla 2
  selectL16: string = "";
  //Variables select tabla 3
  selectL17: string = ""; selectL18: string = ""; selectL19: string = ""; selectL20: string = "";
  selectL21: string = ""; selectL22: string = "";
  //Variables select tabla 4
  selectL23: string = "";
  //Variables select tabla 5
  selectL24: string = ""; selectL25: string = ""; selectL26: string = ""; selectL27: string = "";

  //Variables habilitar/deshabilitar/cambiar/mostrar
  cambioT1L5?: boolean//T1L5
  cambioT1L6?: boolean//T1L6
  cambioT1L7?: boolean
  numerico: boolean = true//T1L8
  cambioT3L4?: boolean
  cambioT3L5?: boolean
  cambioT5L3?: boolean
  cambioT5L4?: boolean

  //Variables archivos tabla 1
  archivoT1L5: File | null | string = null; resArchivoT1L5?: ArchivoGuardado
  archivoT1L6: File | null | string = null; resArchivoT1L6?: ArchivoGuardado
  archivoT1L8: File | null | string = null; resArchivoT1L8?: ArchivoGuardado
  //Variables archivos tabla 3
  archivoT3L4: File | null | string = null; resArchivoT3L4?: ArchivoGuardado
  archivoT3L5: File | null | string = null; resArchivoT3L5?: ArchivoGuardado
  //Variables archivos tabla 5
  archivoT5L3: File | null | string = null; resArchivoT5L3?: ArchivoGuardado
  archivoT5L4: File | null | string = null; resArchivoT5L4?: ArchivoGuardado

  //Variables maestras
  fusiones?: Array<any>
  sino?: Array<any>
  sinoAplica?: Array<any>
  inversiones?: Array<any>
  financierosN?: Array<any>
  financieros?: Array<any>
  equipos?: Array<any>
  porcentajes?: Array<any>
  periodos?: Array<any>

  transporte: any
  vigencia?: number

  constructor(private servicio: ServicioEjecucion, private router: Router, private route: ActivatedRoute, private servicioLocalStorage: ServicioLocalStorage, private servicoArchivos: ServicioArchivos) {
    this.usuario = servicioLocalStorage.obtenerUsuario()
    this.rol = servicioLocalStorage.obtenerRol();
    //this.obtenerTransporte()
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.vigencia = params['vigencia'] || null;
      this.nitVigilado = params['nit'] || null;
      this.nombreVigilado = params['nombre'] || null;
    });
    console.log('Vigencia:', this.vigencia);
    //this.enviarST()
    this.obtenerTransporte()
    this.obtenerMaestras()
  }

  obtenerTransporte() {
    this.servicio.obtenerTransporte(this.vigencia, this.nitVigilado).subscribe({
      next: (respuesta: any) => {
        this.transporte = respuesta['preguntas']
        console.log(this.transporte);
        for (let i = 1; i <= 27; i++) {
          this.cambioRespuestaSelect(this.transporte[i - 1].valor, i)
        }
        if (respuesta['editable'] != true) {
          this.editable = respuesta['editable']
          this.soloLectura = true
          this.numerico = false
          this.hayCambios = true
        }
        //Inicializar variables
        this.selectL1 = this.transporte.find((t: any) => t.preguntaId === 1)?.valor || "";
        this.selectL2 = this.transporte.find((t: any) => t.preguntaId === 2)?.valor || "";
        this.selectL3 = this.transporte.find((t: any) => t.preguntaId === 3)?.valor || "";
        this.selectL4 = this.transporte.find((t: any) => t.preguntaId === 4)?.valor || "";
        this.selectL5 = this.transporte.find((t: any) => t.preguntaId === 5)?.valor || "";
        this.resArchivoT1L5 = this.transporte.find((t: any) => t.preguntaId === 5);
        this.selectL6 = this.transporte.find((t: any) => t.preguntaId === 6)?.valor || "";
        this.resArchivoT1L6 = this.transporte.find((t: any) => t.preguntaId === 6);
        this.selectL7 = this.transporte.find((t: any) => t.preguntaId === 7)?.valor || "";
        this.numberL8 = this.transporte.find((t: any) => t.preguntaId === 8)?.valor || "";
        this.resArchivoT1L8 = this.transporte.find((t: any) => t.preguntaId === 8);
        this.selectL9 = this.transporte.find((t: any) => t.preguntaId === 9)?.valor || "";
        this.selectL10 = this.transporte.find((t: any) => t.preguntaId === 10)?.valor || "";
        this.selectL11 = this.transporte.find((t: any) => t.preguntaId === 11)?.valor || "";
        this.selectL12 = this.transporte.find((t: any) => t.preguntaId === 12)?.valor || "";
        this.selectL13 = this.transporte.find((t: any) => t.preguntaId === 13)?.valor || "";
        this.selectL14 = this.transporte.find((t: any) => t.preguntaId === 14)?.valor || "";
        this.selectL15 = this.transporte.find((t: any) => t.preguntaId === 15)?.valor || "";
        this.selectL16 = this.transporte.find((t: any) => t.preguntaId === 16)?.valor || "";
        this.selectL17 = this.transporte.find((t: any) => t.preguntaId === 17)?.valor || "";
        this.selectL18 = this.transporte.find((t: any) => t.preguntaId === 18)?.valor || "";
        this.selectL19 = this.transporte.find((t: any) => t.preguntaId === 19)?.valor || "";
        this.selectL20 = this.transporte.find((t: any) => t.preguntaId === 20)?.valor || "";
        this.resArchivoT3L4 = this.transporte.find((t: any) => t.preguntaId === 20);
        this.selectL21 = this.transporte.find((t: any) => t.preguntaId === 21)?.valor || "";
        this.resArchivoT3L5 = this.transporte.find((t: any) => t.preguntaId === 21);
        this.selectL22 = this.transporte.find((t: any) => t.preguntaId === 22)?.valor || "";
        this.selectL23 = this.transporte.find((t: any) => t.preguntaId === 23)?.valor || "";
        this.selectL24 = this.transporte.find((t: any) => t.preguntaId === 24)?.valor || "";
        this.selectL25 = this.transporte.find((t: any) => t.preguntaId === 25)?.valor || "";
        this.selectL26 = this.transporte.find((t: any) => t.preguntaId === 26)?.valor || "";
        this.resArchivoT5L3 = this.transporte.find((t: any) => t.preguntaId === 26);
        this.selectL27 = this.transporte.find((t: any) => t.preguntaId === 27)?.valor || "";
        this.resArchivoT5L4 = this.transporte.find((t: any) => t.preguntaId === 27);
        //console.log(this.portuarias);
      }
    })
  }

  cambioRespuestaSelect(event: any, pregunta: number) {
    let respuesta: string
    if (this.esString(event) || event == null || event == undefined || event == "") {
      respuesta = event
    } else {
      respuesta = event.target.value
    }

    if (pregunta == 5) {//T1L5
      if (respuesta == '1') { this.cambioT1L5 = true; this.archivoT1L5 = null; this.resArchivoT1L5 = undefined }
      if (respuesta == '2') { this.cambioT1L5 = false; this.archivoT1L5 = null; this.resArchivoT1L5 = undefined }
      if (!respuesta || respuesta == null) { this.cambioT1L5 = undefined; this.archivoT1L5 = null; this.resArchivoT1L5 = undefined }
    }
    if (pregunta == 6) {//T1L5
      if (respuesta == '1') { this.cambioT1L6 = true; this.archivoT1L6 = null; this.resArchivoT1L6 = undefined }
      if (respuesta == '2') { this.cambioT1L6 = false; this.archivoT1L6 = null; this.resArchivoT1L6 = undefined }
      if (!respuesta || respuesta == null) { this.cambioT1L6 = undefined; this.archivoT1L6 = null; this.resArchivoT1L6 = undefined }
    }
    if (pregunta == 7) {
      if (respuesta == '1') { this.cambioT1L7 = false; this.archivoT1L8 = null; this.resArchivoT1L8 = undefined; this.numerico = false; this.numberL8 = " " }
      if (respuesta == '2' || respuesta == '3' || respuesta == '4') { this.cambioT1L7 = true; this.numerico = true; this.numberL8 = ""; this.archivoT1L8 = null }
      if (!respuesta || respuesta == null) { this.cambioT1L7 = undefined; this.numerico = false; this.archivoT1L8 = null; this.resArchivoT1L8 = undefined; this.numberL8 = " " }
    }
    if (pregunta == 20) {
      if (respuesta == '1') { this.cambioT3L4 = true; this.archivoT3L4 = null; this.resArchivoT3L4 = undefined }
      if (respuesta == '2') { this.cambioT3L4 = false; this.archivoT3L4 = null; this.resArchivoT3L4 = undefined }
      if (!respuesta || respuesta == null) { this.cambioT3L4 = undefined; this.archivoT3L4 = null; this.resArchivoT3L4 = undefined }
    }
    if (pregunta == 21) {
      if (respuesta == '1' || respuesta == '2' || respuesta == '3') { this.cambioT3L5 = true; this.archivoT3L5 = null; this.resArchivoT3L5 = undefined }
      if (respuesta == '4') { this.cambioT3L5 = false; this.archivoT3L5 = null; this.resArchivoT3L5 = undefined }
      if (!respuesta || respuesta == null) { this.cambioT3L5 = undefined; this.archivoT3L5 = null; this.resArchivoT3L5 = undefined }
    }
    if (pregunta == 26) {
      if (respuesta == '1') { this.cambioT5L3 = true; this.archivoT5L3 = null; this.resArchivoT5L3 = undefined }
      if (respuesta == '2') { this.cambioT5L3 = false; this.archivoT5L3 = null; this.resArchivoT5L3 = undefined }
      if (!respuesta || respuesta == null) { this.cambioT5L3 = undefined; this.archivoT5L3 = null; this.resArchivoT5L3 = undefined }
    }
    if (pregunta == 27) {
      if (respuesta == '1') { this.cambioT5L4 = true; this.archivoT5L4 = null; this.resArchivoT5L4 = undefined }
      if (respuesta == '2') { this.cambioT5L4 = false; this.archivoT5L4 = null; this.resArchivoT5L4 = undefined }
      if (!respuesta || respuesta == null) { this.cambioT5L4 = undefined; this.archivoT5L4 = null; this.resArchivoT5L4 = undefined }
    }

  }

  cargarArchivo(event: any | null, extension: string, size: number, input: any) {
    const archivo = event.target.files[0]
    //console.log(archivo, extension);
    if (event) {
      if (archivo.size <= (1048576 * size)) {
        //console.log('Tamaño correcto: ',archivo.size);
        Swal.fire({
          icon: 'info',
          allowOutsideClick: false,
          text: 'Espere por favor...',
        });
        Swal.showLoading(null);
        this.servicio.cargarArchivos(archivo, extension).subscribe({
          next: (respuesta) => {
            if (input == 5) { this.resArchivoT1L5 = respuesta }
            if (input == 6) { this.resArchivoT1L6 = respuesta }
            if (input == 8) { this.resArchivoT1L8 = respuesta }
            if (input == 20) { this.resArchivoT3L4 = respuesta }
            if (input == 21) { this.resArchivoT3L5 = respuesta }
            if (input == 26) { this.resArchivoT5L3 = respuesta }
            if (input == 27) { this.resArchivoT5L4 = respuesta }
            //console.log(respuesta);
            Swal.close()
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 415) {
              Swal.fire({
                titleText: error.error.mensaje,
                icon: 'error'
              })
              if (input == 5) { this.archivoT1L5 = null; this.resArchivoT1L5 = undefined }
              if (input == 6) { this.archivoT1L6 = null; this.resArchivoT1L6 = undefined }
              if (input == 8) { this.archivoT1L8 = null; this.resArchivoT1L8 = undefined }
              if (input == 20) { this.archivoT3L4 = null; this.resArchivoT3L4 = undefined }
              if (input == 21) { this.archivoT3L5 = null; this.resArchivoT3L5 = undefined }
              if (input == 26) { this.archivoT5L3 = null; this.resArchivoT5L3 = undefined }
              if (input == 27) { this.archivoT5L4 = null; this.resArchivoT5L4 = undefined }
            }
          }
        })
      }
      else {
        //console.log('Tamaño incorrecto: ',archivo.size);
        if (input == 5) { this.archivoT1L5 = null; this.resArchivoT1L5 = undefined }
        if (input == 6) { this.archivoT1L6 = null; this.resArchivoT1L6 = undefined }
        if (input == 8) { this.archivoT1L8 = null; this.resArchivoT1L8 = undefined }
        if (input == 20) { this.archivoT3L4 = null; this.resArchivoT3L4 = undefined }
        if (input == 21) { this.archivoT3L5 = null; this.resArchivoT3L5 = undefined }
        if (input == 26) { this.archivoT5L3 = null; this.resArchivoT5L3 = undefined }
        if (input == 27) { this.archivoT5L4 = null; this.resArchivoT5L4 = undefined }
        Swal.fire({
          titleText: 'El archivo cargado no debe ser mayor a 5MB',
          icon: 'warning'
        })
      }

    }
  }

  guardar() {
    let preguntaJson: any;
    const preguntas = []
    //------------------------
    const pregunta1: Pregunta = {
      preguntaId: 1,
      valor: this.selectL1
    }
    preguntas.push(pregunta1)
    //-------------------------
    const pregunta2: Pregunta = {
      preguntaId: 2,
      valor: this.selectL2
    }
    preguntas.push(pregunta2)
    //--------------------------
    const pregunta3: Pregunta = {
      preguntaId: 3,
      valor: this.selectL3
    }
    preguntas.push(pregunta3)
    //--------------------------
    const pregunta4: Pregunta = {
      preguntaId: 4,
      valor: this.selectL4
    }
    preguntas.push(pregunta4)
    //---------------------------
    const pregunta5: Pregunta = {
      preguntaId: 5,
      valor: this.selectL5,
      nombreAlmacenado: this.resArchivoT1L5?.nombreAlmacenado ?? '',
      nombreOriginalArchivo: this.resArchivoT1L5?.nombreOriginalArchivo ?? '',
      ruta: this.resArchivoT1L5?.ruta ?? ''
    }
    preguntas.push(pregunta5)
    //--------------------------
    const pregunta6: Pregunta = {
      preguntaId: 6,
      valor: this.selectL6,
      nombreAlmacenado: this.resArchivoT1L6?.nombreAlmacenado ?? '',
      nombreOriginalArchivo: this.resArchivoT1L6?.nombreOriginalArchivo ?? '',
      ruta: this.resArchivoT1L6?.ruta ?? ''
    }
    preguntas.push(pregunta6)
    //--------------------------
    const pregunta7: Pregunta = {
      preguntaId: 7,
      valor: this.selectL7
    }
    preguntas.push(pregunta7)
    //--------------------------
    const pregunta8: Pregunta = {
      preguntaId: 8,
      valor: this.numberL8,
      nombreAlmacenado: this.resArchivoT1L8?.nombreAlmacenado ?? '',
      nombreOriginalArchivo: this.resArchivoT1L8?.nombreOriginalArchivo ?? '',
      ruta: this.resArchivoT1L8?.ruta ?? ''
    }
    preguntas.push(pregunta8)
    //-------------------------
    const pregunta9: Pregunta = {
      preguntaId: 9,
      valor: this.selectL9
    }
    preguntas.push(pregunta9)
    //--------------------------
    const pregunta10: Pregunta = {
      preguntaId: 10,
      valor: this.selectL10
    }
    preguntas.push(pregunta10)
    //---------------------------
    const pregunta11: Pregunta = {
      preguntaId: 11,
      valor: this.selectL11
    }
    preguntas.push(pregunta11)
    //---------------------------
    const pregunta12: Pregunta = {
      preguntaId: 12,
      valor: this.selectL12
    }
    preguntas.push(pregunta12)
    //---------------------------
    const pregunta13: Pregunta = {
      preguntaId: 13,
      valor: this.selectL13
    }
    preguntas.push(pregunta13)
    //---------------------------
    const pregunta14: Pregunta = {
      preguntaId: 14,
      valor: this.selectL14
    }
    preguntas.push(pregunta14)
    //---------------------------
    const pregunta15: Pregunta = {
      preguntaId: 15,
      valor: this.selectL15
    }
    preguntas.push(pregunta15)
    //---------------------------
    const pregunta16: Pregunta = {
      preguntaId: 16,
      valor: this.selectL16
    }
    preguntas.push(pregunta16)
    //---------------------------
    const pregunta17: Pregunta = {
      preguntaId: 17,
      valor: this.selectL17
    }
    preguntas.push(pregunta17)
    //---------------------------
    const pregunta18: Pregunta = {
      preguntaId: 18,
      valor: this.selectL18
    }
    preguntas.push(pregunta18)
    //---------------------------
    const pregunta19: Pregunta = {
      preguntaId: 19,
      valor: this.selectL19
    }
    preguntas.push(pregunta19)
    //---------------------------
    const pregunta20: Pregunta = {
      preguntaId: 20,
      valor: this.selectL20,
      nombreAlmacenado: this.resArchivoT3L4?.nombreAlmacenado ?? '',
      nombreOriginalArchivo: this.resArchivoT3L4?.nombreOriginalArchivo ?? '',
      ruta: this.resArchivoT3L4?.ruta ?? ''
    }
    preguntas.push(pregunta20)
    //---------------------------
    const pregunta21: Pregunta = {
      preguntaId: 21,
      valor: this.selectL21,
      nombreAlmacenado: this.resArchivoT3L5?.nombreAlmacenado ?? '',
      nombreOriginalArchivo: this.resArchivoT3L5?.nombreOriginalArchivo ?? '',
      ruta: this.resArchivoT3L5?.ruta ?? ''
    }
    preguntas.push(pregunta21)
    //---------------------------
    const pregunta22: Pregunta = {
      preguntaId: 22,
      valor: this.selectL22
    }
    preguntas.push(pregunta22)
    //---------------------------
    const pregunta23: Pregunta = {
      preguntaId: 23,
      valor: this.selectL23
    }
    preguntas.push(pregunta23)
    //---------------------------
    const pregunta24: Pregunta = {
      preguntaId: 24,
      valor: this.selectL24
    }
    preguntas.push(pregunta24)
    //---------------------------
    const pregunta25: Pregunta = {
      preguntaId: 25,
      valor: this.selectL25
    }
    preguntas.push(pregunta25)
    //---------------------------
    const pregunta26: Pregunta = {
      preguntaId: 26,
      valor: this.selectL26,
      nombreAlmacenado: this.resArchivoT5L3?.nombreAlmacenado ?? '',
      nombreOriginalArchivo: this.resArchivoT5L3?.nombreOriginalArchivo ?? '',
      ruta: this.resArchivoT5L3?.ruta ?? ''
    }
    preguntas.push(pregunta26)
    //---------------------------
    const pregunta27: Pregunta = {
      preguntaId: 27,
      valor: this.selectL27,
      nombreAlmacenado: this.resArchivoT5L4?.nombreAlmacenado ?? '',
      nombreOriginalArchivo: this.resArchivoT5L4?.nombreOriginalArchivo ?? '',
      ruta: this.resArchivoT5L4?.ruta ?? ''
    }
    preguntas.push(pregunta27)
    //---------------------------
    preguntaJson = { preguntas, vigencia: this.vigencia }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicio.guardarTransporte(preguntaJson).subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta);
        if (respuesta) {
          Swal.fire({
            titleText: "¡Guardado exitoso!",
            icon: "success"
          })
          this.detectarCambios()
          this.hayCambios = false
          this.obtenerTransporte()
          //this.recargarPagina()
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          Swal.fire({
            titleText: error.error.mensaje,
            icon: 'error'
          })
        }
      }
    })

    //console.log(preguntaJson);
  }

  enviarST() {
    this.servicio.enviarSTTransporte(this.vigencia).subscribe({
      next: (respuesta) => {
        this.aprobado = respuesta['aprobado']
        this.faltantes = respuesta['faltantes']
        this.obtenerTransporte()
        if (respuesta['aprobado']) {
          Swal.fire({
            titleText: "Enviado a ST exitosamente",
            icon: "success"
          })
        } else {
          Swal.fire({
            titleText: "Faltan campos por completar",
            icon: "warning"
          })
        }
        //console.log(respuesta);
      }
    })
  }

  verificarFaltantes(pregunta: number): boolean {
    if (this.faltantes.length === 37) { return false }
    else if (pregunta) {
      for (const valor of this.faltantes) {
        if (valor == pregunta) { return true }
      }
    }
    return false
  }

  obtenerMaestras() {
    this.servicio.maestraSiNo().subscribe({
      next: (respuesta) => {
        this.sino = respuesta['siNo']
      }
    })
    this.servicio.maestraSiNoAplica().subscribe({
      next: (respuesta) => {
        this.sinoAplica = respuesta['siNoNoaplica']
      }
    })
    this.servicio.maestraFusiones().subscribe({
      next: (respuesta) => {
        this.fusiones = respuesta['fusiones']
      }
    })
    this.servicio.maestraInversiones().subscribe({
      next: (respuesta) => {
        this.inversiones = respuesta['inversiones']
      }
    })
    this.servicio.maestraFinancieros().subscribe({
      next: (respuesta) => {
        this.financieros = respuesta['financieros']
      }
    })
    this.servicio.maestraFinancierosN().subscribe({
      next: (respuesta) => {
        this.financierosN = respuesta['financierosN']
      }
    })
    this.servicio.maestraEquipos().subscribe({
      next: (respuesta) => {
        this.equipos = respuesta['equipos']
      }
    })
    this.servicio.maestraPorcentajes().subscribe({
      next: (respuesta) => {
        this.porcentajes = respuesta['porcentajes']
      }
    })
    this.servicio.maestraPeriodos().subscribe({
      next: (respuesta) => {
        this.periodos = respuesta['periodos']
      }
    })
  }

  detectarCambios() {
    this.hayCambios = true
  }

  recargarPagina() {
    window.location.reload()
  }

  manejarCambioArchivos() {
    this.hayCambios = true
  }

  esString(valor: any): boolean {
    return typeof valor === 'string';
  }

  volverAVigencias(): void {
    this.router.navigate(['/administrar/concesiones'], { queryParams: { nit: this.nitVigilado, nombre: this.nombreVigilado } });
  }

  descargarArchivo(archivo: ArchivoGuardado | undefined) {
    if (archivo) {
      this.servicoArchivos.descargarArchivo(archivo.nombreAlmacenado, archivo.ruta, archivo.nombreOriginalArchivo)
    }
  }
}
