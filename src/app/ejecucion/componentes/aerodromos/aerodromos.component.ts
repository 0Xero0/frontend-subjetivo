import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { Faltantes } from '../../modelos/faltantes';

@Component({
  selector: 'app-aerodromos',
  templateUrl: './aerodromos.component.html',
  styleUrls: ['./aerodromos.component.css']
})
export class AerodromosComponent {
  @ViewChild('popup') popup!: PopupComponent
  hayCambios: boolean = false

  soloLectura: boolean = false
  aprobado: boolean = false
  faltantes?: Faltantes
  fecha: Date;
  fechaActual: string;
  anioReporte: number;
  selectedYear: number | null = null;
  listaUltimoAnioRM:Array<string> = []

  habilitarSubordinadas: boolean = true; habilitarNombreV: boolean = true; habilitarNitV: boolean = true; habilitarCual:boolean = true;
  noObligadoRF:boolean = true;noObligadoRFS:boolean = true;

  /* DATOS BÁSICOS */
  nit: string = ""; digito: string = ""; nombre: string = ""; codigoCIIU: string = ""; estadoFinanciero: string = ""; vinculacionEconomica: string = ""
  subordinadaSi: string = ""; vinculadosEco: string = ""; nombreVinculado: string = ""; nitVinculado: string = ""; fechaCorteEF?: Date;
  moneda: string = ""; fechaReporte?: Date | string; periodicidad: string = ""; anioActual: string = ""; anioComparativo: string = ""
  /* ACTUALIZACIÓN DE DATOS */
  tipoEmpresa:string=""; naturaleza:string=""; tipoSocietario:string=""; sJuridica:string=""; gtupoNiif:string=""; ultimoAnioRM: string="";
  domicilioPrin:string=""; direccionN:string=""; email:string=""; notElectronica:string="";resCerl?:ArchivoGuardado;
  /* TIPO DE VIGILADO */
  tipoVigilado:string="";fechaInicioPS?:Date; resHabilitacion?:ArchivoGuardado; entidadHabilitante:string=""; vigilada:string="";
  cual:string="";habilitacionPS:string="";tipoVigiladoSelect:string="";fechaInicioPS2?:Date;resHabilitacion2?:ArchivoGuardado;
  entidadHabilitante2:string="";
  /* REPRESENTACIÓN LEGAL */
  tipoDocumento:string="";numeroId:string="";nombreCompleto:string="";resDocumentoId?:ArchivoGuardado;emailRL:string="";numeroActa:string="";
  fechaNombrmiento?:Date; resActaNombramiento?:ArchivoGuardado;fechaInscrip?:Date; resCC?:ArchivoGuardado
  /* CONTADOR */
  tipoDocumentoC:string="";numeroIdC:string="";nombreCompletoC:string="";resDocumentoIdC?:ArchivoGuardado;emailC:string="";tarjetaPro:string="";
  resTarjetaProDoc?:ArchivoGuardado;numeroActaC:string="";fechaNombrmientoC?:Date;resActaNombramientoC?:ArchivoGuardado
  /* REVISOR FISCAL */
  obligadaRF:string="";tipoDocumentoRF:string="";numeroIdRF:string="";nombreCompletoRF:string="";resDocumentoIdRF?:ArchivoGuardado;emailRF:string="";
  tarjetaProRF:string="";resTarjetaProDocRF?:ArchivoGuardado;numeroActaRF:string="";fechaNombrmientoRF?:Date;resActaNombramientoRF?:ArchivoGuardado
  fechaInscripRF?:Date;firmaAuditoriaRF:string="";resCamaraYcomercioRF?:ArchivoGuardado
  /* REVISOR FISCAL SUPLENTE*/
  tipoDocumentoRFS:string="";numeroIdRFS:string="";nombreCompletoRFS:string="";resDocumentoIdRFS?:ArchivoGuardado;emailRFS:string="";
  tarjetaProRFS:string="";resTarjetaProDocRFS?:ArchivoGuardado;numeroActaRFS:string="";fechaNombrmientoRFS?:Date;resActaNombramientoRFS?:ArchivoGuardado
  fechaInscripRFS?:Date;firmaAuditoriaRFS:string="";resCamaraYcomercioRFS?:ArchivoGuardado
  /* DATOS DEL VIGILADO */
  numeroActoAC:string="";fechaActoAC?:Date;tipoEntidadP:string="";categoria:string="";resDocActoAC?:ArchivoGuardado;
  /* ALCALDE, DIRECTOR O SECRETARIO DE LA ENTIDAD */
  tipoDocumentoR:string="";numeroIdR:string="";nombreCompletoR:string="";emailR:string="";resDocumentoIdR?:ArchivoGuardado;actoOficialNR:string="";
  fechaNombrmientoR?:Date;resDocActoNR?:ArchivoGuardado
  /* REVISOR FISCAL Y CONTADOR */
  actoOficialNRF:string="";fechaNombrmientoRFR?:Date;resDocActoNRR?:ArchivoGuardado;actoOficialNCR:string="";fechaNombrmientoCR?:Date;
  resDocActoNCR?:ArchivoGuardado
  /* INGRESOS DE ACTIVIDADES ORDINARIAS */
  IngrsoF1:string="";IngrsoF2:string="";IngrsoA1:string="";IngrsoA2:string="";unidadN1:string="";unidadN2:string="";ingresoFT1:string="";
  ingresoFT2:string="";
  /* PERÍODO A REPORTAR */
  dictamen:string="";opinionDictamen:string="";conSalDictamen:string="";enfasisDictamen:string="";resDocDictamen?:ArchivoGuardado

  /* Archivos */
  cerl?:File; resoHabilitacion?:File; resoHabilitacion2?:File; documentoId?:File; actaNombramiento?:File; camaraYcomercio?:File;
  documentoIdC?:File; tarjetaProDoc?:File;actaNombramientoC?:File; documentoIdRF?:File; tarjetaProDocRF?:File;actaNombramientoRF?:File;
  camaraYcomercioRF?:File;documentoIdRFS?:File; tarjetaProDocRFS?:File;actaNombramientoRFS?:File;camaraYcomercioRFS?:File;docActoAC?:File;
  documentoIdR?:File;docActoNR?:File;docActoNRR?:File;docActoNCR?:File;docDictamen?:File;

  /* Maestras */
  tipoReportes?: Array<any>
  sino?: Array<any>
  sinoAplica?: Array<any>
  tipoEntidadesNs?: Array<any>
  subordinadas?: Array<any>//
  monedaPresentaciones?: Array<any>
  tipoSocietarios?: Array<any>
  tipoOrganizaciones?: Array<any>
  periodos?: Array<any>
  situacionesJuridicas?: Array<any>
  organizaciones?: Array<any>
  domicilios?: Array<any>
  sociedades?: Array<any>
  naturalezasD?: Array<any>
  grupoNiifReportes?: Array<any>
  tipoVigilados?: Array<any>
  tipoDocumentos?: Array<any>
  obligatoriedades?: Array<any>
  tipoDocumentosNa?: Array<any>
  tipoEntidadesPublicas?:Array<any>
  categoriasNs?:Array<any>
  dictamenes?:Array<any>
  opinionDictamenes?:Array<any>
  salvedadDictamenes?:Array<any>
  enfasisDictamenes?:Array<any>

  identificacion:Array<any> = []
  reporte:Array<any> = []
  dictamenj:Array<any> = []
  ingresos:Array<any> = []

  constructor(private servicio: ServicioEjecucion, private router: Router){
    this.obtenerAerodromos()
    this.fecha = new Date();
    this.fechaActual = this.formatearFecha(this.fecha)
    this.anioReporte = this.fecha.getFullYear()-1
    /* UTLIMO AÑO */
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 30; year <= currentYear; year++) {
      this.listaUltimoAnioRM.push(year.toString());
    }

  }

  ngOnInit(): void {
    this.maestras()
    this.fechaReporte = this.fechaActual
    //this.enviarST()
  }

  detectarCambios(){
    this.hayCambios = true
  }

  validateText(event: any) {
    const pattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]/g, '');
    }
  }

  sumatoriaIngresos(anio:number){
    if(anio==1){
      this.ingresoFT1 = (this.IngrsoF1+this.IngrsoA1+this.unidadN1).toString()
    }
    if(anio==2){
      this.ingresoFT2 = (Number(this.IngrsoF2)+Number(this.IngrsoA2)+Number(this.unidadN2)).toString()
    }
  }

  fechaMaxima(event:any,input?:any){
    //console.log(event.target.value)
    const fechaMaxima = '2023-12-31'
    if(input == 'fechaCorteEF'){
      if(event.target.value > fechaMaxima){
        Swal.fire({
          titleText: 'La fecha de corte no puede ser mayor a 31/12/2023',
          icon: 'warning'
        })
        this.fechaCorteEF = undefined
      }
    }
    if(input == 'fechaNombrmiento'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmiento = undefined
      }
    }
    if(input == 'fechaInscrip'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de inscripción a Cámara y Comercio no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaInscrip = undefined
      }
    }
    if(input == 'fechaNombrmientoC'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmiento = undefined
      }
    }
    if(input == 'fechaNombrmientoRF'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmientoRF = undefined
      }
    }
    if(input == 'fechaInscripRF'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de inscripción a Cámara y Comercio no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaInscripRF = undefined
      }
    }
    if(input == 'fechaNombrmientoRFS'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmientoRFS = undefined
      }
    }
    if(input == 'fechaInscripRFS'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de inscripción a Cámara y Comercio no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaInscripRFS = undefined
      }
    }
    if(input == 'fechaActoAC'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha del Acto administrativo de creación no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaActoAC = undefined
      }
    }
    if(input == 'fechaNombrmientoR'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmientoR = undefined
      }
    }
    if(input == 'fechaNombrmientoRFR'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmientoRFR = undefined
      }
    }
    if(input == 'fechaNombrmientoR'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmientoR = undefined
      }
    }
  }
  fechaComparativa(){this.anioComparativo = (Number(this.anioActual)-1).toString()}
  formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
    const anio = fecha.getFullYear();
    this.anioActual = anio.toString()
    this.anioComparativo = (Number(this.anioActual)-1).toString()
    return `${anio}-${mes}-${dia}`;
  }

  habilitarSi(event:any,pregunt:any){
    if(pregunt == 'vinculacionEconomica'){
      if(event.target.value == 2){this.habilitarSubordinadas = false}
      if(event.target.value != 2){this.habilitarSubordinadas = true; this.subordinadaSi = ""}
    }
    if(pregunt == 'vinculadosEco'){
      if(event.target.value == 1){this.habilitarNombreV = false; this.habilitarNitV = false}
      if(event.target.value != 1){
        this.habilitarNombreV = true; this.nombreVinculado = ""
        this.habilitarNitV = true; this.nitVinculado = ""
      }
    }
    if(pregunt == 'vigilada'){
      if(event.target.value == 1){this.habilitarCual = false}
      if(event.target.value != 1){this.habilitarCual = true; this.cual = ""}
    }
    if(pregunt == 'obligadaRF'){
      if(event.target.value != 5){this.noObligadoRF = false}
      if(event.target.value == 5 || event.target.value == ""){this.noObligadoRF = true;this.noObligadoRFS = true;
        this.tipoDocumentoRF="";this.numeroIdRF=" ";this.nombreCompletoRF="";this.resDocumentoIdRF=undefined;this.emailRF="";
        this.tarjetaProRF=" ";this.resTarjetaProDocRF=undefined;this.numeroActaRF=" ";this.fechaNombrmientoRF=undefined;
        this.documentoIdRF=undefined; this.tarjetaProDocRF=undefined;this.tipoDocumentoRFS = ""
        this.numeroIdRFS=" ";this.nombreCompletoRFS="";this.resDocumentoIdRFS=undefined;this.emailRFS="";
        this.tarjetaProRFS=" ";this.resTarjetaProDocRFS=undefined;this.numeroActaRFS=" ";this.fechaNombrmientoRFS=undefined;
        this.documentoIdRFS=undefined; this.tarjetaProDocRFS=undefined;
      }
    }
    if(pregunt == 'fiscalSuplente'){
      if(event.target.value != 4 && event.target.value != ""){this.noObligadoRFS = false}
      if(event.target.value == 4 || event.target.value == ""){this.noObligadoRFS = true;
        this.numeroIdRFS=" ";this.nombreCompletoRFS="";this.resDocumentoIdRFS=undefined;this.emailRFS="";
        this.tarjetaProRFS=" ";this.resTarjetaProDocRFS=undefined;this.numeroActaRFS=" ";this.fechaNombrmientoRFS=undefined;
        this.documentoIdRFS=undefined; this.tarjetaProDocRFS=undefined;
      }
    }
  }

  cargarArchivo(event: any | null,extension:string,size:number,input:any){
    const archivo = event.target.files[0]
    if(event){
      if(archivo.size<=(1048576*size)){
        Swal.fire({
          icon: 'info',
          allowOutsideClick: false,
          text: 'Espere por favor...',
        });
        Swal.showLoading(null);
        this.servicio.cargarArchivos(archivo,extension).subscribe({
          next: (respuesta) => {
            if(input == 'cerl'){this.resCerl = respuesta}
            if(input == 'resoHabilitacion'){this.resHabilitacion = respuesta}
            if(input == 'resoHabilitacion2'){this.resHabilitacion2 = respuesta}
            if(input == 'documentoId'){this.resDocumentoId = respuesta}
            if(input == 'actaNombramiento'){this.resActaNombramiento = respuesta}
            if(input == 'camaraYcomercio'){this.resCC = respuesta}
            if(input == 'documentoIdC'){this.resDocumentoIdC = respuesta}
            if(input == 'tarjetaProDoc'){this.resTarjetaProDoc = respuesta}
            if(input == 'actaNombramientoC'){this.resActaNombramientoC = respuesta}
            if(input == 'documentoIdRF'){this.resDocumentoIdRF = respuesta}
            if(input == 'tarjetaProDocRF'){this.resTarjetaProDocRF = respuesta}
            if(input == 'actaNombramientoRF'){this.resActaNombramientoRF = respuesta}
            if(input == 'camaraYcomercioRF'){this.resCamaraYcomercioRF = respuesta}
            if(input == 'tarjetaProDocRFS'){this.resTarjetaProDocRFS = respuesta}
            if(input == 'actaNombramientoRFS'){this.resActaNombramientoRFS = respuesta}
            if(input == 'camaraYcomercioRFS'){this.resCamaraYcomercioRFS = respuesta}
            if(input == 'docActoAC'){this.resDocActoAC = respuesta}
            if(input == 'documentoIdR'){this.resDocumentoIdR = respuesta}
            if(input == 'docActoNR'){this.resDocActoNR = respuesta}
            if(input == 'docActoNRR'){this.resDocActoNRR = respuesta}
            if(input == 'docActoNCR'){this.resDocActoNCR = respuesta}
            if(input == 'docDictamen'){this.resDocDictamen = respuesta}
            Swal.close()
          },
          error: (error: HttpErrorResponse) => {
            if(error){
              Swal.fire({
                titleText:error.message,
                icon:'error'
              })
              if(input == 'cerl'){this.resCerl = undefined; this.cerl = undefined}
              if(input == 'resoHabilitacion'){this.resHabilitacion = undefined; this.resoHabilitacion = undefined}
              if(input == 'resoHabilitacion2'){this.resHabilitacion2 = undefined; this.resoHabilitacion2 = undefined}
              if(input == 'documentoId'){this.resDocumentoId = undefined; this.documentoId = undefined}
              if(input == 'actaNombramiento'){this.resActaNombramiento = undefined; this.actaNombramiento = undefined}
              if(input == 'camaraYcomercio'){this.resCC = undefined; this.camaraYcomercio = undefined}
              if(input == 'documentoIdC'){this.resDocumentoIdC = undefined; this.documentoIdC = undefined}
              if(input == 'tarjetaProDoc'){this.resTarjetaProDoc = undefined; this.tarjetaProDoc = undefined}
              if(input == 'actaNombramientoC'){this.resActaNombramientoC = undefined; this.actaNombramientoC = undefined}
              if(input == 'documentoIdRF'){this.resDocumentoIdRF = undefined; this.documentoIdRF = undefined}
              if(input == 'tarjetaProDocRF'){this.resTarjetaProDocRF = undefined; this.tarjetaProDocRF = undefined}
              if(input == 'actaNombramientoRF'){this.resActaNombramientoRF = undefined; this.actaNombramientoRF = undefined}
              if(input == 'camaraYcomercioRF'){this.resCamaraYcomercioRF = undefined; this.camaraYcomercioRF = undefined}
              if(input == 'tarjetaProDocRFS'){this.resTarjetaProDocRFS = undefined; this.tarjetaProDocRFS = undefined}
              if(input == 'actaNombramientoRFS'){this.resActaNombramientoRFS = undefined; this.actaNombramientoRFS = undefined}
              if(input == 'camaraYcomercioRFS'){this.resCamaraYcomercioRFS = undefined; this.camaraYcomercioRFS = undefined}
              if(input == 'docActoAC'){this.resDocActoAC = undefined; this.docActoAC = undefined}
              if(input == 'documentoIdR'){this.resDocumentoIdR = undefined; this.documentoIdR = undefined}
              if(input == 'docActoNR'){this.resDocActoNR = undefined; this.docActoNR = undefined}
              if(input == 'docActoNRR'){this.resDocActoNRR = undefined; this.docActoNRR = undefined}
              if(input == 'docActoNCR'){this.resDocActoNCR = undefined; this.docActoNCR = undefined}
              if(input == 'docDictamen'){this.resDocDictamen = undefined; this.docDictamen = undefined}
            }
          }
        })
      }else{
        Swal.fire({
          titleText:'El archivo cargado no debe ser mayor a 5MB',
          icon:'warning'
        })
        if(input == 'cerl'){this.resCerl = undefined; this.cerl = undefined}
        if(input == 'resoHabilitacion'){this.resHabilitacion = undefined; this.resoHabilitacion = undefined}
        if(input == 'resoHabilitacion2'){this.resHabilitacion2 = undefined; this.resoHabilitacion2 = undefined}
        if(input == 'documentoId'){this.resDocumentoId = undefined; this.documentoId = undefined}
        if(input == 'actaNombramiento'){this.resActaNombramiento = undefined; this.actaNombramiento = undefined}
        if(input == 'camaraYcomercio'){this.resCC = undefined; this.camaraYcomercio = undefined}
        if(input == 'documentoIdC'){this.resDocumentoIdC = undefined; this.documentoIdC = undefined}
        if(input == 'tarjetaProDoc'){this.resTarjetaProDoc = undefined; this.tarjetaProDoc = undefined}
        if(input == 'actaNombramientoC'){this.resActaNombramientoC = undefined; this.actaNombramientoC = undefined}
        if(input == 'documentoIdRF'){this.resDocumentoIdRF = undefined; this.documentoIdRF = undefined}
        if(input == 'tarjetaProDocRF'){this.resTarjetaProDocRF = undefined; this.tarjetaProDocRF = undefined}
        if(input == 'actaNombramientoRF'){this.resActaNombramientoRF = undefined; this.actaNombramientoRF = undefined}
        if(input == 'camaraYcomercioRF'){this.resCamaraYcomercioRF = undefined; this.camaraYcomercioRF = undefined}
        if(input == 'tarjetaProDocRFS'){this.resTarjetaProDocRFS = undefined; this.tarjetaProDocRFS = undefined}
        if(input == 'actaNombramientoRFS'){this.resActaNombramientoRFS = undefined; this.actaNombramientoRFS = undefined}
        if(input == 'camaraYcomercioRFS'){this.resCamaraYcomercioRFS = undefined; this.camaraYcomercioRFS = undefined}
        if(input == 'docActoAC'){this.resDocActoAC = undefined; this.docActoAC = undefined}
        if(input == 'documentoIdR'){this.resDocumentoIdR = undefined; this.documentoIdR = undefined}
        if(input == 'docActoNR'){this.resDocActoNR = undefined; this.docActoNR = undefined}
        if(input == 'docActoNRR'){this.resDocActoNRR = undefined; this.docActoNRR = undefined}
        if(input == 'docActoNCR'){this.resDocActoNCR = undefined; this.docActoNCR = undefined}
        if(input == 'docDictamen'){this.resDocDictamen = undefined; this.docDictamen = undefined}
      }
    }
  }

  obtenerAerodromos(){
    this.servicio.obtenerAerodromos().subscribe({
      next: (respuesta)=>{
        console.log(respuesta);
        this.identificacion = respuesta['identificacion']
        this.reporte = respuesta['reporte']
        this.dictamenj = respuesta['digtamen']
        this.ingresos = respuesta['ingresos']
        this.llenaridentificacion
      }
    })
  }

  guardar(){
    const identificacion = this.capturarIdentificacion()
    const reporte = this.capturarReporte()
    const dictamen = this.capturarDictamen()
    const ingresos = this.capturarIngresos()
    //console.log(identificacion)
  }

  maestras(){
    this.servicio.obtenerMaestras2('sino').subscribe({
      next: (respuesta)=>{
        this.sino = respuesta['siNo']
      }
    })
    this.servicio.obtenerMaestras2('tipo_reportes').subscribe({
      next: (respuesta)=>{
        this.tipoReportes = respuesta['tipoReportes']
      }
    })
    this.servicio.obtenerMaestras2('tipo_entidades_ns').subscribe({
      next: (respuesta)=>{
        this.tipoEntidadesNs = respuesta['tipoEntidadesNs']
      }
    })
    this.servicio.obtenerMaestras2('subordinadas').subscribe({
      next: (respuesta)=>{
        this.subordinadas = respuesta['subordinadas']
      }
    })
    this.servicio.obtenerMaestras2('moneda_presentaciones').subscribe({
      next: (respuesta)=>{
        this.monedaPresentaciones = respuesta['monedaPresentaciones']
      }
    })
    this.servicio.obtenerMaestras2('periodos').subscribe({
      next: (respuesta)=>{
        this.periodos = respuesta['periodos']
      }
    })
    this.servicio.obtenerMaestras2('tipo_societarios').subscribe({
      next: (respuesta)=>{
        this.tipoSocietarios = respuesta['tipoSocietarios']
      }
    })
    this.servicio.obtenerMaestras2('tipo_organizaciones').subscribe({
      next: (respuesta)=>{
        this.tipoOrganizaciones = respuesta['tipoOrganizaciones']
      }
    })
    this.servicio.obtenerMaestras2('situaciones_juridicas').subscribe({
      next: (respuesta)=>{
        this.situacionesJuridicas = respuesta['situacionesJuridicas']
      }
    })
    this.servicio.obtenerMaestras2('naturalezasD').subscribe({
      next: (respuesta)=>{
        this.naturalezasD = respuesta['naturalezasD']
      }
    })
    this.servicio.obtenerMaestras2('grupo_niif_reportes').subscribe({
      next: (respuesta)=>{
        this.grupoNiifReportes = respuesta['grupoNiifReportes']
      }
    })
    this.servicio.obtenerMaestras2('domicilios').subscribe({
      next: (respuesta)=>{
        this.domicilios = respuesta['domicilios']
      }
    })
    this.servicio.obtenerMaestras2('tipo_vigilados').subscribe({
      next: (respuesta)=>{
        this.tipoVigilados = respuesta['tipoVigilados']
      }
    })
    this.servicio.obtenerMaestras2('tipo_documentos').subscribe({
      next: (respuesta)=>{
        this.tipoDocumentos = respuesta['tipoDocumentos']
      }
    })
    this.servicio.obtenerMaestras2('obligatoriedades').subscribe({
      next: (respuesta)=>{
        this.obligatoriedades = respuesta['obligatoriedades']
      }
    })
    this.servicio.obtenerMaestras2('tipo_documentos_ns').subscribe({
      next: (respuesta)=>{
        this.tipoDocumentosNa = respuesta['tipoDocumentosNs']
      }
    })
    this.servicio.obtenerMaestras2('tipo_entidades_publicas').subscribe({
      next: (respuesta)=>{
        this.tipoEntidadesPublicas = respuesta['tipoEntidadesPublicas']
      }
    })
    this.servicio.obtenerMaestras2('categorias_ns').subscribe({
      next: (respuesta)=>{
        this.categoriasNs = respuesta['categoriasNs']
      }
    })
    this.servicio.obtenerMaestras2('dictamenes').subscribe({
      next: (respuesta)=>{
        this.dictamenes = respuesta['dictamenes']
      }
    })
    this.servicio.obtenerMaestras2('opinion_dictamenes').subscribe({
      next: (respuesta)=>{
        this.opinionDictamenes = respuesta['opinionDictamenes']
      }
    })
    this.servicio.obtenerMaestras2('salvedad_dictamenes').subscribe({
      next: (respuesta)=>{
        this.salvedadDictamenes = respuesta['salvedadDictamenes']
      }
    })
    this.servicio.obtenerMaestras2('enfasis_dictamenes').subscribe({
      next: (respuesta)=>{
        this.enfasisDictamenes = respuesta['enfasisDictamenes']
      }
    })
  }

  capturarIdentificacion(){
    return [
      {/* "NIT SIN DIGITO DE VERIFICACIÓN" */
        "preguntaId": 1,
        "valor": this.nit,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "DIGITO DE VERIFICACIÓN" */
        "preguntaId": 2,
        "valor": this.digito,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NOMBRE DE LA SOCIEDAD" */
        "preguntaId": 3,
        "valor": this.nombre,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "CODIGO CIIU" */
        "preguntaId": 4,
        "valor": this.codigoCIIU,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TIPO DE ESTADOS FINANCIEROS" */
        "preguntaId": 5,
        "valor": this.estadoFinanciero,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TIPO DE VINCULACIÓN ECONÓMICA" */
        "preguntaId": 6,
        "valor": this.vinculacionEconomica,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "SUBORDINADA SI" */
        "preguntaId": 7,
        "valor": this.subordinadaSi,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "VINCULADOS ECONÓMICOS" */
        "preguntaId": 8,
        "valor": this.vinculadosEco,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NOMBRE VINCULADO ECONÓMICO" */
        "preguntaId": 9,
        "valor": this.nombreVinculado,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NIT VINCULADO ECONÓMICO" */
        "preguntaId": 10,
        "valor": this.nitVinculado,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "FECHA DE CORTE ESTADOS FINANCIEROS" */
        "preguntaId": 11,
        "valor": this.fechaCorteEF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "MONEDA DE PRESENTACIÓN" */
        "preguntaId": 12,
        "valor": this.moneda,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "FECHA DE REPORTE" */
        "preguntaId": 13,
        "valor": this.fechaReporte,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PERIODICIDAD DE PRESENTACIÓN" */
        "preguntaId": 14,
        "valor": this.periodicidad,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "AÑO ACTUAL DEL REPORTE" */
        "preguntaId": 15,
        "valor": this.anioActual,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "AÑO COMPARATIVO" */
        "preguntaId": 16,
        "valor": this.anioComparativo,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TIPO DE EMPRESA" */
        "preguntaId": 17,
        "valor": this.tipoEmpresa,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NATURALEZA" */
        "preguntaId": 18,
        "valor": this.naturaleza,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TIPO SOCIETARIO" */
        "preguntaId": 19,
        "valor": this.tipoSocietario,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "SITUACION JURÍDICA" */
        "preguntaId": 20,
        "valor": this.sJuridica,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "GRUPO NIIF DE REPORTE" */
        "preguntaId": 21,
        "valor": this.gtupoNiif,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "ULTIMO AÑO RENOVACIÓN MATRICULA" */
        "preguntaId": 22,
        "valor": this.ultimoAnioRM,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "DOMICILIO PRINCIPAL" */
        "preguntaId": 23,
        "valor": this.domicilioPrin,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "DIRECCIÓN DE NOTIFICACIÓN" */
        "preguntaId": 24,
        "valor": this.direccionN,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "CORREO ELECTRÓNICO DE NOTIFICACIÓN" */
        "preguntaId": 25,
        "valor": this.email,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NOTIFICACIÓN ELECTRÓNICA" */
        "preguntaId": 26,
        "valor": this.notElectronica,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* PDF CERL */
        "preguntaId": 27,
        "valor": "",
        "nombreAlmacenado": this.resCerl?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resCerl?.nombreOriginalArchivo,
        "ruta": this.resCerl?.ruta,
      },
      {/* "TIPO DE VIGILADO" */
        "preguntaId": 28,
        "valor": this.tipoVigilado,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "FECHA HABILITACIÓN O INICIO DE PRESTACIÓN DE SERVICIO" */
        "preguntaId": 29,
        "valor": this.fechaInicioPS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF RESOLUCIÓN DE HABILITACIÓN" */
        "preguntaId": 30,
        "valor": "",
        "nombreAlmacenado": this.resHabilitacion?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resHabilitacion?.nombreOriginalArchivo,
        "ruta": this.resHabilitacion?.ruta,
      },
      {/* "ENTIDAD HABILITANTE" */
        "preguntaId": 31,
        "valor": this.entidadHabilitante,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* " ¿Es vigilada por otra Superintendencia?" */
        "preguntaId": 32,
        "valor": this.vigilada,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* " Si marcó SI: ¿Cuál?" */
        "preguntaId": 33,
        "valor": this.cual,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "¿Cuenta con habilitación para la prestación del servicio en alguna otra modalidad de transporte?" */
        "preguntaId": 34,
        "valor": this.habilitacionPS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TIPO DE VIGILADO" */
        "preguntaId": 35,
        "valor": this.tipoVigiladoSelect,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "FECHA HABILITACIÓN O INICIO DE PRESTACIÓN DE SERVICIO" */
        "preguntaId": 36,
        "valor": this.fechaInicioPS2,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF RESOLUCIÓN DE HABILITACIÓN Y/O PERMISO" */
        "preguntaId": 37,
        "valor": "",
        "nombreAlmacenado": this.resHabilitacion2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resHabilitacion2?.nombreOriginalArchivo,
        "ruta": this.resHabilitacion2?.ruta,
      },
      {/*  "ENTIDAD HABILITANTE" */
        "preguntaId": 38,
        "valor": this.entidadHabilitante2,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TIPO DE DOCUMENTO REPRESENTANTE" */
        "preguntaId": 39,
        "valor": this.tipoDocumento,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NÚMERO DE DOCUMENTO REPRESENTANTE" */
        "preguntaId": 40,
        "valor": this.numeroId,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NOMBRE COMPLETO REPRESENTANTE" */
        "preguntaId": 41,
        "valor": this.nombreCompleto,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF CEDULA RL" */
        "preguntaId": 42,
        "valor": "",
        "nombreAlmacenado": this.resDocumentoId?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocumentoId?.nombreOriginalArchivo,
        "ruta": this.resDocumentoId?.ruta,
      },
      {/* "CORREO ELECTRÓNICO REPRESENTANTE" */
        "preguntaId": 43,
        "valor": this.emailRL,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NÚMERO DE ACTA  REPRESENTANTE" */
        "preguntaId": 44,
        "valor": this.numeroActa,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "FECHA DE NOMBRAMIENTO REPRESENTANTE" */
        "preguntaId": 45,
        "valor": this.fechaNombrmiento,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF ACTA NOMBRAMIENTO" */
        "preguntaId": 46,
        "valor": "",
        "nombreAlmacenado": this.resActaNombramiento?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resActaNombramiento?.nombreOriginalArchivo,
        "ruta": this.resActaNombramiento?.ruta,
      },
      {/* "FECHA DE INSCRIPCION EN CC REPRESENTANTE" */
        "preguntaId": 47,
        "valor": this.fechaInscrip,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF CAMARA Y COMERCIO" */
        "preguntaId": 48,
        "valor": "",
        "nombreAlmacenado": this.resCC?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resCC?.nombreOriginalArchivo,
        "ruta": this.resCC?.ruta,
      },
      {/* "TIPO DE DOCUMENTO CONTADOR" */
        "preguntaId": 49,
        "valor": this.tipoDocumentoC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NÚMERO DE DOCUMENTO CONTADOR" */
        "preguntaId": 50,
        "valor": this.numeroIdC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NOMBRE COMPLETO CONTADOR" */
        "preguntaId": 51,
        "valor": this.nombreCompletoC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF CEDULA C CONTADOR" */
        "preguntaId": 52,
        "valor": "",
        "nombreAlmacenado": this.resDocumentoIdC?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocumentoIdC?.nombreOriginalArchivo,
        "ruta": this.resDocumentoIdC?.ruta,
      },
      {/* "CORREO ELECTRÓNICO CONTADOR" */
        "preguntaId": 53,
        "valor": this.emailC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TARJETA PROFESIONAL CONTADOR" */
        "preguntaId": 54,
        "valor": this.tarjetaPro,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF TARJETA PROFESIONAL CONTADOR" */
        "preguntaId": 55,
        "valor": "",
        "nombreAlmacenado": this.resTarjetaProDoc?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resTarjetaProDoc?.nombreOriginalArchivo,
        "ruta": this.resTarjetaProDoc?.ruta,
      },
      {/* "NÚMERO DE ACTA  CONTADOR" */
        "preguntaId": 56,
        "valor": this.numeroActaC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "FECHA DE NOMBRAMIENTO CONTADOR" */
        "preguntaId": 57,
        "valor": this.fechaNombrmientoC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "PDF ACTA NOMBRAMIENTO CONTADOR"  */
        "preguntaId": 58,
        "valor": "",
        "nombreAlmacenado": this.resActaNombramientoC?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resActaNombramientoC?.nombreOriginalArchivo,
        "ruta": this.resActaNombramientoC?.ruta,
      },
      {/* "¿La empresa está obligada a tener Revisor fiscal?" */
        "preguntaId": 59,
        "valor": this.obligadaRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "TIPO DE DOCUMENTO REVISOR" */
        "preguntaId": 60,
        "valor": this.tipoDocumentoRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NÚMERO DE DOCUMENTO REVISOR" */
        "preguntaId": 61,
        "valor": this.numeroIdRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/* "NOMBRE COMPLETO REVISOR" */
        "preguntaId": 62,
        "valor": this.nombreCompletoRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
      },
      {/*  "PDF CEDULA RF REVISOR" */
        "preguntaId": 63,
        "valor": "",
        "nombreAlmacenado": this.resDocumentoIdRF?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocumentoIdRF?.nombreOriginalArchivo,
        "ruta": this.resDocumentoIdRF?.ruta,
      },
      {/* "CORREO ELECTRÓNICO REVISOR" */
        "preguntaId": 64,
        "valor": this.emailRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "TARJETA PROFESIONAL REVISOR" */
        "preguntaId": 65,
        "valor": this.tarjetaProRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF TARJETA PROFESIONAL REVISOR" */
        "preguntaId": 66,
        "valor": "",
        "nombreAlmacenado": this.resTarjetaProDocRF?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resTarjetaProDocRF?.nombreOriginalArchivo,
        "ruta": this.resTarjetaProDocRF?.ruta,
    },
    {/* "NÚMERO DE ACTA REVISOR" */
        "preguntaId": 67,
        "valor": this.numeroActaRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "FECHA DE NOMBRAMIENTO REVISOR" */
        "preguntaId": 68,
        "valor": this.fechaNombrmientoRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF ACTA NOMBRAMIENTO REVISOR" */
        "preguntaId": 69,
        "valor": "",
        "nombreAlmacenado": this.resActaNombramientoRF?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resActaNombramientoRF?.nombreOriginalArchivo,
        "ruta": this.resActaNombramientoRF?.ruta,
    },
    {/* "FECHA DE INSCRIPCIÓN EN CC REVISOR" */
        "preguntaId": 70,
        "valor": this.fechaInscripRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "FIRMA DE AUDITORIA (SI APLICA)" */
        "preguntaId": 71,
        "valor": this.firmaAuditoriaRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF CAMARA Y COMERCIO REVISOR" */
        "preguntaId": 72,
        "valor": this.resCamaraYcomercioRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "TIPO DE DOCUMENTO SUPLENTE" */
        "preguntaId": 73,
        "valor": this.tipoDocumentoRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "NÚMERO DE DOCUMENTO SUPLENTE", */
        "preguntaId": 74,
        "valor": this.numeroIdRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "NOMBRE COMPLETO SUPLENTE" */
        "preguntaId": 75,
        "valor": this.nombreCompletoRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF CEDULA RF SUPLENTE" */
        "preguntaId": 76,
        "valor": "",
        "nombreAlmacenado": this.resDocumentoIdRFS,
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "CORREO ELECTRÓNICO SUPLENTE" */
        "preguntaId": 77,
        "valor": this.emailRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "TARJETA PROFESIONAL SUPLENTE" */
        "preguntaId": 78,
        "valor": this.tarjetaProRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF TARJETA PROFESIONAL SUPLENTE" */
        "preguntaId": 79,
        "valor": "",
        "nombreAlmacenado": this.resTarjetaProDocRFS?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resTarjetaProDocRFS?.nombreOriginalArchivo,
        "ruta": this.resTarjetaProDocRFS?.ruta,
    },
    {/* "NÚMERO DE ACTA  SUPLENTE" */
        "preguntaId": 80,
        "valor": this.numeroActaRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "FECHA DE NOMBRAMIENTO SUPLENTE" */
        "preguntaId": 81,
        "valor": this.fechaNombrmientoRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF ACTA NOMBRAMIENTO SUPLENTE" */
        "preguntaId": 82,
        "valor": "",
        "nombreAlmacenado": this.resActaNombramientoRFS?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resActaNombramientoRFS?.nombreOriginalArchivo,
        "ruta": this.resActaNombramientoRFS?.ruta,
    },
    {/* "FECHA DE INSCRIPCIÓN EN CC SUPLENTE" */
        "preguntaId": 83,
        "valor": this.fechaInscripRFS,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF CAMARA Y COMERCIO SUPLENTE" */
        "preguntaId": 84,
        "valor": "",
        "nombreAlmacenado": this.resCamaraYcomercioRFS?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resCamaraYcomercioRFS?.nombreOriginalArchivo,
        "ruta": this.resCamaraYcomercioRFS?.ruta,
    }

    ]
  }
  capturarReporte(){
    return [
      {/* "NÚMERO DE ACTO ADMINISTRATIVO DE CREACIÓN" */
        "preguntaId": 1,
        "valor": this.numeroActoAC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "FECHA DE ACTO ADMINISTRATIVO DE CREACIÓN" */
        "preguntaId": 2,
        "valor": this.fechaActoAC,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "TIPO DE ENTIDAD PÚBLICA" */
        "preguntaId": 3,
        "valor": this.tipoEntidadP,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "CATEGORÍA" */
        "preguntaId": 4,
        "valor": this.categoria,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF ACTO ADMINISTRATIVO DE CREACION DE LA ENTIDAD" */
        "preguntaId": 5,
        "valor": "",
        "nombreAlmacenado": this.resDocActoAC?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocActoAC?.nombreOriginalArchivo,
        "ruta": this.resDocActoAC?.ruta,
    },
    {/* "TIPO DE DOCUMENTO" */
        "preguntaId": 6,
        "valor": this.tipoDocumentoR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "NÚMERO DE DOCUMENTO" */
        "preguntaId": 7,
        "valor": this.numeroIdR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "NOMBRE COMPLETO" */
        "preguntaId": 8,
        "valor": this.nombreCompletoR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "CORREO ELECTRÓNICO" */
        "preguntaId": 9,
        "valor": this.emailR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF IDENTIFICACION REPRESENTANTE" */
        "preguntaId": 10,
        "valor": "",
        "nombreAlmacenado": this.resDocumentoIdR?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocumentoIdR?.nombreOriginalArchivo,
        "ruta": this.resDocumentoIdR?.ruta,
    },
    {/* "ACTO OFICIAL DE NOMBRAMIENTO" */
        "preguntaId": 11,
        "valor": this.actoOficialNR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "FECHA DE NOMBRAMIENTO" */
        "preguntaId": 12,
        "valor": this.fechaNombrmientoR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF ACTO DE NOMBRAMIENTO" */
        "preguntaId": 13,
        "valor": "",
        "nombreAlmacenado": this.resDocActoNR?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocActoNR?.nombreOriginalArchivo,
        "ruta": this.resDocActoNR?.ruta,
    },
    {/* "ACTO OFICIAL DE NOMBRAMIENTO REVISOR FISCAL" */
        "preguntaId": 14,
        "valor": this.actoOficialNRF,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "FECHA DE NOMBRAMIENTO REVISOR FISCAL" */
        "preguntaId": 15,
        "valor": this.fechaNombrmientoRFR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF ACTO DE NOMBRAMIENTO REVISOR FISCAL" */
        "preguntaId": 16,
        "valor": "",
        "nombreAlmacenado": this.resDocActoNRR?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocActoNRR?.nombreOriginalArchivo,
        "ruta": this.resDocActoNRR?.ruta,
    },
    {/* "ACTO OFICIAL DE NOMBRAMIENTO CONTADOR" */
        "preguntaId": 17,
        "valor": this.actoOficialNCR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "FECHA DE NOMBRAMIENTO CONTADOR" */
        "preguntaId": 18,
        "valor": this.fechaNombrmientoCR,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF ACTO DE NOMBRAMIENTO REVISOR CONTADOR" */
        "preguntaId": 19,
        "valor": "",
        "nombreAlmacenado": this.resDocActoNCR?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocActoNCR?.nombreOriginalArchivo,
        "ruta": this.resDocActoNCR?.ruta,
    }

    ]
  }
  capturarDictamen(){
    return [
      {/* "Dictamen" */
        "preguntaId": 1,
        "valor": this.dictamen,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
    },
    {/* "Opinión Dictamen" */
        "preguntaId": 2,
        "valor": this.opinionDictamen,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
    },
    {/* "Contenido Salvedad Dictamen" */
        "preguntaId": 3,
        "valor": this.salvedadDictamenes,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
    },
    {/* "Parrafo Enfasis Dictamen" */
        "preguntaId": 4,
        "valor": this.enfasisDictamen,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
    },
    {/* "PDF Dictámen RF" */
        "preguntaId": 5,
        "valor": "",
        "nombreAlmacenado": this.resDocDictamen?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocDictamen?.nombreOriginalArchivo,
        "ruta": this.resDocDictamen?.ruta,
        "anio": this.anioReporte
    }

    ]
  }
  capturarIngresos(){
    return []
  }

  llenaridentificacion(){

  }
}
