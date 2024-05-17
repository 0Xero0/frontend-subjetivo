import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Actividad, FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { TipoImportacion } from '../../TipoImportacion';
import { RespuestaErrorImportacion } from '../../modelos/ErrorImportacion';
import { Observable, catchError, forkJoin, of } from 'rxjs'
import { InputNumericoComponent } from 'src/app/inputs/componentes/input-numerico/input-numerico.component';
import { Portuarias } from '../../modelos/Portuarias';
import { InputArchivoComponent } from 'src/app/inputs/componentes/input-archivo/input-archivo.component';
import Swal from 'sweetalert2';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { Pregunta } from '../../modelos/Preguntas';

@Component({
  selector: 'app-transito',
  templateUrl: './transito.component.html',
  styleUrls: ['./transito.component.css']
})
export class TransitoComponent {

  @ViewChild('popup') popup!: PopupComponent
  hayCambios: boolean = false

  soloLectura: boolean = false
  aprobado: boolean = false
  faltantes: number[] = []

  //Variables tabla 1
  textL1: string = "";selectL2: string = "";numberL3: string = "";numberL4: string = "";selectL5: string = "";selectL6: string = "";
  selectL7: string = ""
  //Variables checkbox tabla 2
  check1: boolean = false;check2: boolean = false;check3: boolean = false;check4: boolean = false;check5: boolean = false;
  check6: boolean = false;check7: boolean = false;check8: boolean = false;check9: boolean = false;
  //Variables grua
  textGrua1: string = "";numeroGrua1: string = "";selectG1: string = "";selectG2: string = "";textGrua2: string = "";textGrua3: string = "";
  textGrua4: string = "";numeroGrua2: string = "";archivoG1: File | null = null;archivoG2: File | null = null;selectG3: string = "";
  textGrua5: string = "";selectG4: string = "";fechaG1: string = "";fechaG2: string = "";selectG5: string = "";numeroGrua3: string = "";
  textGrua6: string = "";numeroG4: string = "";
  //Variables Patios
  textP1: string = "";numeroP1: string = "";selectP1: string = "";selectP2: string = "";textP2: string = "";textP3: string = "";
  textP4: string = "";numeroP2: string = "";archivoP1: File | null = null;archivoP2: File | null = null;selectP3: string = "";
  textP5: string = "";selectP4: string = "";fechaP1: string = "";fechaP2: string = "";selectP5: string = "";numeroP3: string = "";
  textP6: string = "";numeroP4: string = "";
  //Variables Tramites
  textT1: string = "";numeroT1: string = "";selectT1: string = "";selectT2: string = "";textT2: string = "";textT3: string = "";
  textT4: string = "";numeroT2: string = "";archivoT1: File | null = null;archivoT2: File | null = null;selectT3: string = "";
  textT5: string = "";selectT4: string = "";fechaT1: string = "";fechaT2: string = "";selectT5: string = "";numeroT3: string = "";
  textT6: string = "";numeroT4: string = "";
  //Variables Deteccion
  textD1: string = "";numeroD1: string = "";selectD1: string = "";selectD2: string = "";textD2: string = "";textD3: string = "";
  textD4: string = "";numeroD2: string = "";archivoD1: File | null = null;archivoD2: File | null = null;selectD3: string = "";
  textD5: string = "";selectD4: string = "";fechaD1: string = "";fechaD2: string = "";selectD5: string = "";numeroD3: string = "";
  textD6: string = "";numeroD4: string = "";

  //Variables PC
  textPC1: string = "";numeroPC1: string = "";selectPC1: string = "";selectPC2: string = "";textPC2: string = "";textPC3: string = "";
  textPC4: string = "";numeroPC2: string = "";archivoPC1: File | null = null;archivoPC2: File | null = null;selectPC3: string = "";
  textPC5: string = "";selectPC4: string = "";fechaPC1: string = "";fechaPC2: string = "";selectPC5: string = "";numeroPC3: string = "";
  textPC6: string = "";numeroPC4: string = "";
  //Variables PCC
  textPCC1: string = "";numeroPCC1: string = "";selectPCC1: string = "";selectPCC2: string = "";textPCC2: string = "";textPCC3: string = "";
  textPCC4: string = "";numeroPCC2: string = "";archivoPCC1: File | null = null;archivoPCC2: File | null = null;selectPCC3: string = "";
  textPCC5: string = "";selectPCC4: string = "";fechaPCC1: string = "";fechaPCC2: string = "";selectPCC5: string = "";numeroPCC3: string = "";
  textPCC6: string = "";numeroPCC4: string = "";
  //Variables PCP
  textPCP1: string = "";numeroPCP1: string = "";selectPCP1: string = "";selectPCP2: string = "";textPCP2: string = "";textPCP3: string = "";
  textPCP4: string = "";numeroPCP2: string = "";archivoPCP1: File | null = null;archivoPCP2: File | null = null;selectPCP3: string = "";
  textPCP5: string = "";selectPCP4: string = "";fechaPCP1: string = "";fechaPCP2: string = "";selectPCP5: string = "";numeroPCP3: string = "";
  textPCP6: string = "";numeroPCP4: string = "";
  //Variables Recaudo
  textR1: string = "";numeroR1: string = "";selectR1: string = "";selectR2: string = "";textR2: string = "";textR3: string = "";
  textR4: string = "";numeroR2: string = "";archivoR1: File | null = null;archivoR2: File | null = null;selectR3: string = "";
  textR5: string = "";selectR4: string = "";fechaR1: string = "";fechaR2: string = "";selectR5: string = "";numeroR3: string = "";
  textR6: string = "";numeroR4: string = "";

  //Variables Otros
  textO1: string = "";numeroO1: string = "";selectO1: string = "";selectO2: string = "";textO2: string = "";textO3: string = "";
  textO4: string = "";numeroO2: string = "";archivoO1: File | null = null;archivoO2: File | null = null;selectO3: string = "";
  textO5: string = "";selectO4: string = "";fechaO1: string = "";fechaO2: string = "";selectO5: string = "";numeroO3: string = "";
  textO6: string = "";selectO0: string = "";numeroO4: string = "";

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
  nits?: Array<any>
  organizaciones?: Array<any>
  domicilios?: Array<any>
  sociedades?: Array<any>

  portuarias: Portuarias[] = []
  identificacionOrganismo?: any

  constructor(private servicio: ServicioEjecucion, private router: Router, private servicioLocalStorage: ServicioLocalStorage){
    this.obtenerTransitos()
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    /* this.enviarST() */
    this.obtenerMaestras()
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

  }

  obtenerMaestras(){
    this.servicio.maestraSiNo().subscribe({
      next: (respuesta)=>{
        this.sino = respuesta['siNo']
      }
    })
    this.servicio.maestraSiNoAplica().subscribe({
      next: (respuesta)=>{
        this.sinoAplica = respuesta['siNoNoaplica']
      }
    })
    this.servicio.maestraFusiones().subscribe({
      next: (respuesta)=>{
        this.fusiones = respuesta['fusiones']
      }
    })
    this.servicio.maestraInversiones().subscribe({
      next: (respuesta)=>{
        this.inversiones = respuesta['inversiones']
      }
    })
    this.servicio.maestraFinancieros().subscribe({
      next: (respuesta)=>{
        this.financieros = respuesta['financieros']
      }
    })
    this.servicio.maestraFinancierosN().subscribe({
      next: (respuesta)=>{
        this.financierosN = respuesta['financierosN']
      }
    })
    this.servicio.maestraEquipos().subscribe({
      next: (respuesta)=>{
        this.equipos = respuesta['equipos']
      }
    })
    this.servicio.maestraPorcentajes().subscribe({
      next: (respuesta)=>{
        this.porcentajes = respuesta['porcentajes']
      }
    })
    this.servicio.maestraPeriodos().subscribe({
      next: (respuesta)=>{
        this.periodos = respuesta['periodos']
      }
    })
    this.servicio.maestraOrganizaciones().subscribe({
      next: (respuesta)=>{
        this.organizaciones = respuesta['organizaciones']
      }
    })
    this.servicio.maestraNits().subscribe({
      next: (respuesta)=>{
        this.nits = respuesta['nits']
      }
    })
    this.servicio.maestraDomicilios().subscribe({
      next: (respuesta)=>{
        this.domicilios = respuesta['domicilios']
      }
    })
    this.servicio.maestraSociedades().subscribe({
      next: (respuesta)=>{
        this.sociedades = respuesta['sociedades']
      }
    })
  }

  obtenerTransitos(){
    this.servicio.obtenerTransito().subscribe({
      next: (respuesta:any)=>{
        this.identificacionOrganismo = respuesta['identificacionOrganismo']
        console.log(this.identificacionOrganismo.razonSocial);
        
        for(let i = 1; i <= 37; i++){
          //this.cambioRespuestaSelect(this.portuarias[i-1].valor,i)
        }
        if(respuesta['editable'] != true){
          this.soloLectura = true
          this.hayCambios = true
        }
        //Inicializar variables
        this.textL1 = this.identificacionOrganismo.razonSocial
        this.selectL2 = this.identificacionOrganismo.tipoNit
        this.numberL3 = this.identificacionOrganismo.nit
        this.numberL4 = this.identificacionOrganismo.digitoVerificacion
        this.selectL5 = this.identificacionOrganismo.tipoOrganizacion
        this.selectL6 = this.identificacionOrganismo.apoyaTerceros
        this.selectL7 = this.identificacionOrganismo.procesoAdjudicacion
        this.check1 = this.identificacionOrganismo.gruas
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
        valor: this.textL1
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
        valor: this.numberL3
      }
      preguntas.push(pregunta3)
    //--------------------------
    const pregunta4: Pregunta = {
        preguntaId: 4,
        valor: this.numberL4
      }
      preguntas.push(pregunta4)
    //---------------------------
    const pregunta5: Pregunta = {
        preguntaId: 5,
        valor: this.selectL5,
        nombreAlmacenado: this.resArchivoL5?.nombreAlmacenado,
        nombreOriginalArchivo: this.resArchivoL5?.nombreOriginalArchivo,
        ruta: this.resArchivoL5?.ruta
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
    //---------------------------
    const pregunta17: Pregunta = {
        preguntaId: 17,
        valor: ""
      }
      preguntas.push(pregunta17)
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
          this.obtenerTransitos()
          this.detectarCambios()
          this.hayCambios = false
          this.recargarPagina()
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
        this.obtenerTransitos()
        if(respuesta['aprobado']){
          Swal.fire({
            titleText:"Enviado a ST exitosamente",
            icon: "success"
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
