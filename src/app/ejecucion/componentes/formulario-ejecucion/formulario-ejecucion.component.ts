import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { Portuarias } from '../../modelos/Portuarias';
import Swal from 'sweetalert2';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { Pregunta } from '../../modelos/Preguntas';

@Component({
  selector: 'app-formulario-ejecucion',
  templateUrl: './formulario-ejecucion.component.html',
  styleUrls: ['./formulario-ejecucion.component.css']
})
export class FormularioEjecucionComponent implements OnInit, OnChanges{
  @ViewChild('popup') popup!: PopupComponent
  hayCambios: boolean = false
  usuario: Usuario

  soloLectura: boolean = false
  aprobado: boolean = false
  faltantes: number[] = []
  editable: boolean= true

  //Variables select tabla 1
  selectL1: string = "";selectL2: string = "";selectL3: string = "";selectL4: string = "";selectL5: string = "";selectL6: string = "";
  selectL7: string = "";numberL8: string = "";selectL9: string = "";selectL10: string = "";selectL11: string = "";selectL12: string = "";
  selectL13: string = "";selectL14: string = "";selectL15: string = "";selectL16: string = ""
  //Variables select tabla 2
  selectL17: string = "";selectL18: string = "";selectL19: string = "";
  //Variables select tabla 3
  selectL20: string = "";selectL21: string = "";selectL22: string = "";selectL23: string = "";selectL24: string = "";selectL25: string = "";
  selectL26: string = "";selectL27: string = "";selectL28: string = "";
  //Variables select tabla 4
  selectL29: string = "";textArea30: string = "";selectL31: string = "";selectL32: string = "";selectL33: string = "";
  //Variables select tabla 5
  selectL34: string = "";selectL35: string = "";selectL36: string = "";selectL37: string = "";

  //Variables habilitar/deshabilitar/cambiar/mostrar
  cambioRespuesta?: boolean//T1L5
  cambioT1L7?: boolean
  numerico: boolean = true//T1L8
  cambioT3L3: boolean = true
  cambioT3L5?: boolean
  cambioT3L7?: boolean
  cambioT3L8: boolean = true
  cambioT4L1?: boolean
  textArea: boolean = true //T4L2
  cambioT4L3?: boolean
  cambioT4L4?: boolean
  cambioT5L3?: boolean
  cambioT5L4?: boolean

  //Variables archivos tabla 1
  archivoL5: File | null | string = null;resArchivoL5?: ArchivoGuardado
  archivoL8: File | null | string = null;resArchivoL8?: ArchivoGuardado
  //Variables archivos tabla 3
  archivoL5T3: File | null | string = null;resArchivoL5T3?: ArchivoGuardado
  archivoL7T3: File | null | string = null;resArchivoL7T3?: ArchivoGuardado
  //Variables archivos tabla 4
  archivoL1T4: File | null | string = null;resArchivoL1T4?: ArchivoGuardado
  archivoL3T4: File | null | string = null;resArchivoL3T4?: ArchivoGuardado
  archivoL4T4: File | null | string = null;resArchivoL4T4?: ArchivoGuardado
  //Variables archivos tabla 5
  archivoL3T5: File | null | string = null;resArchivoL3T5?: ArchivoGuardado
  archivoL4T5: File | null | string = null;resArchivoL4T5?: ArchivoGuardado

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

  portuarias: Portuarias[] = []

  constructor(private servicio: ServicioEjecucion, private router: Router, private servicioLocalStorage: ServicioLocalStorage){
    this.obtenerPortuarias()

    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario) throw new ErrorAutorizacion();
    this.usuario = usuario
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    //this.enviarST()
    this.maestraFusiones()
    this.maestraSiNo()
    this.maestraSiNoAplica()
    this.maestraInversiones()
    this.maestraFinancieros()
    this.maestraFinancierosN()
    this.maestraEquipos()
    this.maestraPorcentajes()
    this.maestraPeriodos()
  }

  detectarCambios(){
    this.hayCambios = true
  }
  esNumero(valor: any): boolean {
    return typeof valor === 'number' && !isNaN(valor);
  }
  esString(valor: any): boolean {
    return typeof valor === 'string';
  }

  cambioRespuestaSelect(event:any,pregunta:number){
    let respuesta: string
    if(this.esString(event) || event == null || event == undefined || event == ""){
      respuesta = event
    }else{
      respuesta = event.target.value
    }

    if(pregunta == 5){//T1L5
      if(respuesta == '1'){this.cambioRespuesta = true; this.archivoL5 = null; this.resArchivoL5 = undefined}
      if(respuesta == '2'){this.cambioRespuesta = false; this.archivoL5 = null; this.resArchivoL5 = undefined}
      if(!respuesta || respuesta == null){this.cambioRespuesta = undefined; this.archivoL5 = null; this.resArchivoL5 = undefined}
    }
    if(pregunta == 7){
      if(respuesta == '1'){this.cambioT1L7 = false; this.archivoL8 = null; this.resArchivoL8 = undefined; this.numerico = false;this.numberL8 = ""}
      if(respuesta == '2' || respuesta == '3' || respuesta == '4'){this.cambioT1L7 = true; this.numerico = true;this.numberL8 = ""; this.archivoL8 = null;}
      if(!respuesta || respuesta == null){this.cambioT1L7 = undefined; this.numerico = false; this.archivoL8 = null; this.resArchivoL8 = undefined;this.numberL8 = ""}
    }
    if(pregunta == 22){
      if(respuesta == '1'){this.cambioT3L3 = false;}
      if(respuesta == '2'){this.cambioT3L3 = true;this.selectL23 = ""}
      if(!respuesta || respuesta == null){this.cambioT3L3 = true;this.selectL23 = ""}
    }
    if(pregunta == 24){
      if(respuesta == '1'){this.cambioT3L5 = true; this.archivoL5T3 = null; this.resArchivoL5T3 = undefined}
      if(respuesta == '2'){this.cambioT3L5 = false; this.archivoL5T3 = null; this.resArchivoL5T3 = undefined}
      if(!respuesta || respuesta == null){this.cambioT3L5 = undefined; this.archivoL5T3 = null; this.resArchivoL5T3 = undefined}
    }
    if(pregunta == 26){
      if(respuesta == '1' || respuesta == '2' || respuesta == '3'){this.cambioT3L7 = true; this.archivoL7T3 = null; this.resArchivoL7T3 = undefined}
      if(respuesta == '4'){this.cambioT3L7 = false; this.archivoL7T3 = null; this.resArchivoL7T3 = undefined}
      if(!respuesta || respuesta == null){this.cambioT3L7 = undefined; this.archivoL7T3 = null; this.resArchivoL7T3 = undefined}
    }
    if(pregunta == 27){
      if(respuesta == '1'){this.cambioT3L8 = false}
      if(respuesta == '2'){this.cambioT3L8 = true;this.selectL28 = ""}
      if(!respuesta || respuesta == null){this.cambioT3L8 = true;this.selectL28 = ""}
    }
    if(pregunta == 29){
      if(respuesta == '1'){this.cambioT4L1 = true;this.archivoL1T4 = null; this.resArchivoL1T4 = undefined; this.textArea = true;this.textArea30 = ""}
      if(respuesta == '2'){this.cambioT4L1 = false; this.textArea = false;this.archivoL1T4 = null; this.resArchivoL1T4 = undefined}
      if(!respuesta || respuesta == null){this.cambioT4L1 = undefined; this.textArea = true;this.archivoL1T4 = null; this.resArchivoL1T4 = undefined;this.textArea30 = ""}
    }
    if(pregunta == 31){
      if(respuesta != null){this.cambioT4L3 = true; this.archivoL3T4 = null; this.resArchivoL3T4 = undefined}
      if(!respuesta || respuesta == null){this.cambioT4L3 = false; this.archivoL3T4 = null; this.resArchivoL3T4 = undefined}
    }
    if(pregunta == 32){
      if(respuesta != null){this.cambioT4L4 = true; this.archivoL4T4 = null; this.resArchivoL4T4 = undefined}
      if(!respuesta || respuesta == null){this.cambioT4L4 = false; this.archivoL4T4 = null; this.resArchivoL4T4 = undefined}
    }
    if(pregunta == 36){
      if(respuesta == '1'){this.cambioT5L3 = true; this.archivoL3T5 = null; this.resArchivoL3T5 = undefined}
      if(respuesta == '2'){this.cambioT5L3 = false; this.archivoL3T5 = null; this.resArchivoL3T5 = undefined}
      if(!respuesta || respuesta == null){this.cambioT5L3 = undefined; this.archivoL3T5 = null; this.resArchivoL3T5 = undefined}
    }
    if(pregunta == 37){
      if(respuesta == '1'){this.cambioT5L4 = true; this.archivoL4T5 = null; this.resArchivoL4T5 = undefined}
      if(respuesta == '2'){this.cambioT5L4 = false; this.archivoL4T5 = null; this.resArchivoL4T5 = undefined}
      if(!respuesta || respuesta == null){this.cambioT5L4 = undefined; this.archivoL4T5 = null; this.resArchivoL4T5 = undefined}
    }

  }

  maestraSiNo(){
    this.servicio.maestraSiNo().subscribe({
      next: (respuesta)=>{
        this.sino = respuesta['siNo']
      }
    })
  }

  maestraSiNoAplica(){
    this.servicio.maestraSiNoAplica().subscribe({
      next: (respuesta)=>{
        this.sinoAplica = respuesta['siNoNoaplica']
      }
    })
  }

  maestraFusiones(){
    this.servicio.maestraFusiones().subscribe({
      next: (respuesta)=>{
        this.fusiones = respuesta['fusiones']
      }
    })
  }

  maestraInversiones(){
    this.servicio.maestraInversiones().subscribe({
      next: (respuesta)=>{
        this.inversiones = respuesta['inversiones']
      }
    })
  }

  maestraFinancieros(){
    this.servicio.maestraFinancieros().subscribe({
      next: (respuesta)=>{
        this.financieros = respuesta['financieros']
      }
    })
  }

  maestraFinancierosN(){
    this.servicio.maestraFinancierosN().subscribe({
      next: (respuesta)=>{
        this.financierosN = respuesta['financierosN']
      }
    })
  }

  maestraEquipos(){
    this.servicio.maestraEquipos().subscribe({
      next: (respuesta)=>{
        this.equipos = respuesta['equipos']
      }
    })
  }

  maestraPorcentajes(){
    this.servicio.maestraPorcentajes().subscribe({
      next: (respuesta)=>{
        this.porcentajes = respuesta['porcentajes']
      }
    })
  }

  maestraPeriodos(){
    this.servicio.maestraPeriodos().subscribe({
      next: (respuesta)=>{
        this.periodos = respuesta['periodos']
      }
    })
  }

  obtenerPortuarias(){
    this.servicio.obtenerPortuarias().subscribe({
      next: (respuesta:any)=>{
        this.portuarias = respuesta['preguntas']
        for(let i = 1; i <= 37; i++){
          this.cambioRespuestaSelect(this.portuarias[i-1].valor,i)
        }
        if(respuesta['editable'] != true){
          this.editable = respuesta['editable']
          this.soloLectura = true
          this.cambioT3L3 = true
          this.cambioT3L8 = true
          this.numerico = false
          this.textArea = true
          this.hayCambios = true
        }
        //Inicializar variables
        this.selectL1 = this.portuarias[0].valor
        this.selectL2 = this.portuarias[1].valor
        this.selectL3 = this.portuarias[2].valor
        this.selectL4 = this.portuarias[3].valor
        this.selectL5 = this.portuarias[4].valor;this.resArchivoL5 = this.portuarias[4]
        this.selectL6 = this.portuarias[5].valor
        this.selectL7 = this.portuarias[6].valor
        this.numberL8 = this.portuarias[7].valor;this.resArchivoL8 = this.portuarias[7]
        this.selectL9 = this.portuarias[8].valor
        this.selectL10 = this.portuarias[9].valor
        this.selectL11 = this.portuarias[10].valor
        this.selectL12 = this.portuarias[11].valor
        this.selectL13 = this.portuarias[12].valor
        this.selectL14 = this.portuarias[13].valor
        this.selectL15 = this.portuarias[14].valor
        this.selectL16 = this.portuarias[15].valor
        this.selectL17 = this.portuarias[16].valor
        this.selectL18 = this.portuarias[17].valor
        this.selectL19 = this.portuarias[18].valor
        this.selectL20 = this.portuarias[19].valor
        this.selectL21 = this.portuarias[20].valor
        this.selectL22 = this.portuarias[21].valor
        this.selectL23 = this.portuarias[22].valor
        this.selectL24 = this.portuarias[23].valor;this.resArchivoL5T3 = this.portuarias[23]
        this.selectL25 = this.portuarias[24].valor
        this.selectL26 = this.portuarias[25].valor;this.resArchivoL7T3 = this.portuarias[25]
        this.selectL27 = this.portuarias[26].valor
        this.selectL28 = this.portuarias[27].valor
        this.selectL29 = this.portuarias[28].valor;this.resArchivoL1T4 = this.portuarias[28]
        this.textArea30 = this.portuarias[29].valor
        this.selectL31 = this.portuarias[30].valor;this.resArchivoL3T4 = this.portuarias[30]
        this.selectL32 = this.portuarias[31].valor;this.resArchivoL4T4 = this.portuarias[31]
        this.selectL33 = this.portuarias[32].valor
        this.selectL34 = this.portuarias[33].valor
        this.selectL35 = this.portuarias[34].valor
        this.selectL36 = this.portuarias[35].valor;this.resArchivoL3T5 = this.portuarias[35]
        this.selectL37 = this.portuarias[36].valor;this.resArchivoL4T5 = this.portuarias[36]
        //console.log(this.portuarias);
      }
    })
  }

  cargarArchivo(event: any | null,extension:string,size:number,input:any){
    const archivo = event.target.files[0]
    //console.log(archivo, extension);
    if(event){
      if(archivo.size<=(1048576*size)){
        //console.log('Tamaño correcto: ',archivo.size);
        Swal.fire({
          icon: 'info',
          allowOutsideClick: false,
          text: 'Espere por favor...',
        });
        Swal.showLoading(null);
        this.servicio.cargarArchivos(archivo,extension).subscribe({
          next: (respuesta) => {
            if(input == 5){this.resArchivoL5 = respuesta}
            if(input == 8){this.resArchivoL8 = respuesta}
            if(input == 24){this.resArchivoL5T3 = respuesta}
            if(input == 26){this.resArchivoL7T3 = respuesta}
            if(input == 29){this.resArchivoL1T4 = respuesta}
            if(input == 31){this.resArchivoL3T4 = respuesta}
            if(input == 32){this.resArchivoL4T4 = respuesta}
            if(input == 36){this.resArchivoL3T5 = respuesta}
            if(input == 37){this.resArchivoL4T5 = respuesta}
            //console.log(respuesta);
            Swal.close()
          },
          error: (error: HttpErrorResponse) => {
            if(error.status == 415){
              Swal.fire({
                titleText:error.error.mensaje,
                icon:'error'
              })
              if(input == 5){this.archivoL5 = null; this.resArchivoL5 = undefined}
              if(input == 8){this.archivoL8 = null; this.resArchivoL8 = undefined}
              if(input == 24){this.archivoL5T3 = null; this.resArchivoL5T3 = undefined}
              if(input == 26){this.archivoL7T3 = null; this.resArchivoL7T3 = undefined}
              if(input == 29){this.archivoL1T4 = null; this.resArchivoL1T4 = undefined}
              if(input == 31){this.archivoL3T4 = null; this.resArchivoL3T4 = undefined}
              if(input == 32){this.archivoL4T4 = null; this.resArchivoL4T4 = undefined}
              if(input == 36){this.archivoL3T5 = null; this.resArchivoL3T5 = undefined}
              if(input == 37){this.archivoL4T5 = null; this.resArchivoL4T5 = undefined}
            }
          }
        })
      }
      else{
        //console.log('Tamaño incorrecto: ',archivo.size);
        if(input == 5){this.archivoL5 = null; this.resArchivoL5 = undefined}
        if(input == 8){this.archivoL8 = null; this.resArchivoL8 = undefined}
        if(input == 24){this.archivoL5T3 = null; this.resArchivoL5T3 = undefined}
        if(input == 26){this.archivoL7T3 = null; this.resArchivoL7T3 = undefined}
        if(input == 29){this.archivoL1T4 = null; this.resArchivoL1T4 = undefined}
        if(input == 31){this.archivoL3T4 = null; this.resArchivoL3T4 = undefined}
        if(input == 32){this.archivoL4T4 = null; this.resArchivoL4T4 = undefined}
        if(input == 36){this.archivoL3T5 = null; this.resArchivoL3T5 = undefined}
        if(input == 37){this.archivoL4T5 = null; this.resArchivoL4T5 = undefined}
        Swal.fire({
          titleText:'El archivo cargado no debe ser mayor a 5MB',
          icon:'warning'
        })
      }

    }
  }

  guardar(){
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
        nombreAlmacenado: this.resArchivoL5?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL5?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL5?.ruta??''
      }
      preguntas.push(pregunta5)
    //--------------------------
    const pregunta6: Pregunta = {
        preguntaId: 6,
        valor: this.selectL6
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
        nombreAlmacenado: this.resArchivoL8?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL8?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL8?.ruta??''
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
        valor: this.selectL20
      }
      preguntas.push(pregunta20)
    //---------------------------
    const pregunta21: Pregunta = {
        preguntaId: 21,
        valor: this.selectL21
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
        valor: this.selectL24,
        nombreAlmacenado: this.resArchivoL5T3?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL5T3?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL5T3?.ruta??''
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
        nombreAlmacenado: this.resArchivoL7T3?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL7T3?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL7T3?.ruta??''
      }
      preguntas.push(pregunta26)
    //---------------------------
    const pregunta27: Pregunta = {
        preguntaId: 27,
        valor: this.selectL27
      }
      preguntas.push(pregunta27)
    //---------------------------
    const pregunta28: Pregunta = {
        preguntaId: 28,
        valor: this.selectL28
      }
      preguntas.push(pregunta28)
    //---------------------------
    const pregunta29: Pregunta = {
        preguntaId: 29,
        valor: this.selectL29,
        nombreAlmacenado: this.resArchivoL1T4?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL1T4?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL1T4?.ruta??''
      }
      preguntas.push(pregunta29)
    //---------------------------
    const pregunta30: Pregunta = {
        preguntaId: 30,
        valor: this.textArea30
      }
      preguntas.push(pregunta30)
    //---------------------------
    const pregunta31: Pregunta = {
        preguntaId: 31,
        valor: this.selectL31,
        nombreAlmacenado: this.resArchivoL3T4?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL3T4?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL3T4?.ruta??''
      }
      preguntas.push(pregunta31)
    //---------------------------
    const pregunta32: Pregunta = {
        preguntaId: 32,
        valor: this.selectL32,
        nombreAlmacenado: this.resArchivoL4T4?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL4T4?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL4T4?.ruta??''
      }
      preguntas.push(pregunta32)
    //---------------------------
    const pregunta33: Pregunta = {
        preguntaId: 33,
        valor: this.selectL33
      }
      preguntas.push(pregunta33)
    //---------------------------
    const pregunta34: Pregunta = {
        preguntaId: 34,
        valor: this.selectL34
      }
      preguntas.push(pregunta34)
    //---------------------------
    const pregunta35: Pregunta = {
        preguntaId: 35,
        valor: this.selectL35
      }
      preguntas.push(pregunta35)
    //---------------------------
    const pregunta36: Pregunta = {
        preguntaId: 36,
        valor: this.selectL36,
        nombreAlmacenado: this.resArchivoL3T5?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL3T5?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL3T5?.ruta??''
      }
      preguntas.push(pregunta36)
    //---------------------------
    const pregunta37: Pregunta = {
        preguntaId: 37,
        valor: this.selectL37,
        nombreAlmacenado: this.resArchivoL4T5?.nombreAlmacenado??'',
        nombreOriginalArchivo: this.resArchivoL4T5?.nombreOriginalArchivo??'',
        ruta: this.resArchivoL4T5?.ruta??''
      }
      preguntas.push(pregunta37)
    //---------------------------

    preguntaJson={preguntas}
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicio.guardar(preguntaJson).subscribe({
      next: (respuesta: any) =>{
        //console.log(respuesta);
        if(respuesta){
          Swal.fire({
            titleText:"¡Guardado exitoso!",
            icon: "success"
          })
          this.detectarCambios()
          this.hayCambios = false
          this.obtenerPortuarias()
          //this.recargarPagina()
        }
      },
      error: (error: HttpErrorResponse) => {
        if(error.status == 400){
          Swal.fire({
            titleText:error.error.mensaje,
            icon:'error'
          })
          this.archivoL5 = null; this.resArchivoL5 = undefined
        }
      }
    })

    //console.log(preguntaJson);
  }

  enviarST(){
    this.servicio.enviarST().subscribe({
      next: (respuesta) => {
        this.aprobado = respuesta['aprobado']
        this.faltantes = respuesta['faltantes']
        this.obtenerPortuarias()
        if(respuesta['aprobado']){
          Swal.fire({
            titleText:"Enviado a ST exitosamente",
            icon: "success"
          })
        }else{
          Swal.fire({
            titleText:"Faltan campos por completar",
            icon: "warning"
          })
        }
        //console.log(respuesta);
      }
    })
  }

  verificarFaltantes(pregunta: number): boolean{
    if(this.faltantes.length === 37){return false}
    else if(pregunta){
      for(const valor of this.faltantes){
        if(valor == pregunta){return true}
      }
    }
    return false
  }

  recargarPagina(){
    window.location.reload()
  }

  manejarCambioArchivos(){
    this.hayCambios = true
  }
}
