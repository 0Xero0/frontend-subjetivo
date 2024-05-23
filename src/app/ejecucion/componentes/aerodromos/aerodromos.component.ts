import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { Faltantes } from '../../modelos/faltantes';
import { ingresos } from '../../modelos/aerodromo';

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
  faltantesDigtamen?:Array<any>
  faltantesIdentificacion?:Array<any>
  faltantesIngresos?:Array<any>
  faltantesReporte?:Array<any>
  fecha: Date;
  fechaActual: string;
  anioReporte: number;
  selectedYear: number | null = null;
  listaUltimoAnioRM:Array<string> = []

  habilitarSubordinadas: boolean = true; habilitarNombreV: boolean = true; habilitarNitV: boolean = true; habilitarCual:boolean = true;
  noObligadoRF:boolean = true;noObligadoRFS:boolean = true;
  /* Validación correos electronicos */
  emailValido:boolean = true; emailValidoRL:boolean = true; emailValidoC:boolean = true; emailValidoRF:boolean = true;emailValidoRFS:boolean = true;
  emailValidoR:boolean = true;

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
  naturalezas?: Array<any>
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
  codigosCiiu?: Array<any>

  identificacion:Array<any> = []
  reporte:Array<any> = []
  dictamenj:Array<any> = []
  ingresos:Array<ingresos> = []

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
  esString(valor: any): boolean {
    return typeof valor === 'string';
  }
  validateEmail(event: any, input: number) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    if (!pattern.test(currentValue)) {
      inputElement.setCustomValidity('Introduce un correo electrónico válido.');
    } else {
      inputElement.setCustomValidity('');
    }
    if(input == 1){this.email = currentValue;this.emailValido = pattern.test(currentValue);}
    if(input == 2){this.emailRL = currentValue;this.emailValidoRL = pattern.test(currentValue);}
    if(input == 3){this.emailC = currentValue;this.emailValidoC = pattern.test(currentValue);}
    if(input == 4){this.emailRF = currentValue;this.emailValidoRF = pattern.test(currentValue);}
    if(input == 5){this.emailRFS = currentValue;this.emailValidoRFS = pattern.test(currentValue);}
    if(input == 6){this.emailR = currentValue;this.emailValidoR = pattern.test(currentValue);}

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
      }else if (event.target.value < '1900-01-01'){
        Swal.fire({
          titleText: 'La fecha del Acto administrativo de creación no puede ser menor a 01 de enero de 1900',
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
      }else if (event.target.value < '1900-01-01'){
        Swal.fire({
          titleText: 'La fecha del Acto administrativo de creación no puede ser menor a 01 de enero de 1900',
          icon: 'warning'
        })
        this.fechaActoAC = undefined
      }
    }
    if(input == 'fechaNombrmientoRFR'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmientoRFR = undefined
      }else if (event.target.value < '1900-01-01'){
        Swal.fire({
          titleText: 'La fecha del Acto administrativo de creación no puede ser menor a 01 de enero de 1900',
          icon: 'warning'
        })
        this.fechaActoAC = undefined
      }
    }
    if(input == 'fechaNombrmientoCR'){
      if(event.target.value > this.fechaActual){
        Swal.fire({
          titleText: 'La fecha de nombramiento no puede ser mayor a la fecha actual',
          icon: 'warning'
        })
        this.fechaNombrmientoR = undefined
      }else if (event.target.value < '1900-01-01'){
        Swal.fire({
          titleText: 'La fecha del Acto administrativo de creación no puede ser menor a 01 de enero de 1900',
          icon: 'warning'
        })
        this.fechaActoAC = undefined
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

  habilitarSi(event?:any,pregunt?:any){
    let respuesta: string
    if(this.esString(event) || event == null || event == undefined || event == ""){
      respuesta = event
    }else{
      respuesta = event.target.value
    }

    if(pregunt == 'vinculacionEconomica'){
      if(respuesta == '2'){this.habilitarSubordinadas = false}
      if(respuesta != '2'){this.habilitarSubordinadas = true; this.subordinadaSi = "";}
    }
    if(pregunt == 'vinculadosEco'){
      if(respuesta == '1'){this.habilitarNombreV = false; this.habilitarNitV = false}
      if(respuesta != '1'){
        this.habilitarNombreV = true; this.nombreVinculado = ""
        this.habilitarNitV = true; this.nitVinculado = ""
      }
    }
    if(pregunt == 'vigilada'){
      if(respuesta == '1'){this.habilitarCual = false}
      if(respuesta != '1'){this.habilitarCual = true; this.cual = ""}
    }
    if(pregunt == 'obligadaRF'){
      if(respuesta != '5'){this.noObligadoRF = false}
      if(respuesta == '5' || respuesta == ""){this.noObligadoRF = true;this.noObligadoRFS = true;
        this.tipoDocumentoRF="";this.numeroIdRF="";this.nombreCompletoRF="";this.resDocumentoIdRF=undefined;this.emailRF="";
        this.tarjetaProRF="";this.resTarjetaProDocRF=undefined;this.numeroActaRF="";this.fechaNombrmientoRF=undefined;this.firmaAuditoriaRF="";
        this.fechaInscripRF=undefined;this.actaNombramientoRF=undefined;this.resActaNombramientoRF=undefined;this.documentoIdRF=undefined;
        this.tarjetaProDocRF=undefined;this.resCamaraYcomercioRF=undefined;this.camaraYcomercioRF=undefined;

        this.tipoDocumentoRFS = "";this.numeroIdRFS="";this.nombreCompletoRFS="";this.resDocumentoIdRFS=undefined;this.emailRFS="";
        this.tarjetaProRFS="";this.resTarjetaProDocRFS=undefined;this.numeroActaRFS="";this.resActaNombramientoRFS=undefined;
        this.fechaNombrmientoRFS=undefined;this.fechaInscripRFS=undefined; this.documentoIdRFS=undefined; this.tarjetaProDocRFS=undefined;
        this.actaNombramientoRFS=undefined; this.resCamaraYcomercioRFS=undefined;this.camaraYcomercioRFS=undefined;
      }
    }
    if(pregunt == 'fiscalSuplente'){
      if(respuesta != '4' && respuesta != ""){this.noObligadoRFS = false}
      if(respuesta == '4' || respuesta == ""){this.noObligadoRFS = true;
        this.numeroIdRFS="";this.nombreCompletoRFS="";this.resDocumentoIdRFS=undefined;this.emailRFS="";
        this.tarjetaProRFS="";this.resTarjetaProDocRFS=undefined;this.numeroActaRFS="";this.resActaNombramientoRFS=undefined;
        this.fechaNombrmientoRFS=undefined; this.documentoIdRFS=undefined; this.tarjetaProDocRFS=undefined;this.actaNombramientoRFS=undefined;
        this.resCamaraYcomercioRFS=undefined;this.camaraYcomercioRFS=undefined;
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
            if(input == 'documentoIdRFS'){this.resDocumentoIdRFS = respuesta}
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
        this.llenaridentificacion()
        this.llenarReporte()
        this.llenarDictamen()
        this.llenarIngresos()

        if(this.identificacion[5].valor){this.habilitarSi(this.identificacion[5].valor,'vinculacionEconomica')}
        if(this.identificacion[7].valor){this.habilitarSi(this.identificacion[7].valor,'vinculadosEco')}
        if(this.identificacion[31].valor){this.habilitarSi(this.identificacion[31].valor,'vigilada')}
        if(this.identificacion[58].valor){this.habilitarSi(this.identificacion[58].valor,'obligadaRF')}
        if(this.identificacion[72].valor){this.habilitarSi(this.identificacion[72].valor,'fiscalSuplente')}

        if(respuesta['editable'] == false){
          this.soloLectura = true; this.hayCambios = true; this.noObligadoRF = true; this.noObligadoRFS = true;
        }
      }
    })
  }

  guardar(){
    const identificacion = this.capturarIdentificacion()
    const reporte = this.capturarReporte()
    const dictamen = this.capturarDictamen()
    const ingresos = this.capturarIngresos()
    let aerodromosJson:any;

    aerodromosJson={identificacion,reporte,dictamen,ingresos}
    console.log(aerodromosJson)
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicio.guardarAerodromo(aerodromosJson).subscribe({
      next: (respuesta: any) =>{
        //console.log(respuesta);
        if(respuesta){
          Swal.fire({
            titleText:"¡Guardado exitoso!",
            icon: "success"
          })
          this.obtenerAerodromos()
          this.detectarCambios()
          this.hayCambios = false
        }
      },
      error: (error: HttpErrorResponse) => {
        if(error.status == 400){
          Swal.fire({
            titleText:error.error.mensaje,
            icon:'error'
          })
        }else{
          Swal.fire({
            titleText:error.error,
            icon:'error'
          })
        }
      }
    })
  }

  enviarST(){
    this.servicio.enviarSTAerodromo().subscribe({
      next: (respuesta) => {
        console.log(respuesta);

        this.aprobado = respuesta['aprobado']
        this.faltantesDigtamen = respuesta['faltantesDigtamen']
        this.faltantesIdentificacion = respuesta['faltantesIdentificacion']
        this.faltantesIngresos = respuesta['faltantesIngresos']
        this.faltantesReporte = respuesta['faltantesReporte']
        this.obtenerAerodromos()
        //console.log(this.faltantes);
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

  verificarFaltantes(tipo:any,preguntaId?:any):boolean{
    if(
      this.faltantesDigtamen?.length == 5 && this.faltantesIdentificacion?.length == 84 &&
      this.faltantesIngresos?.length == 8 && this.faltantesReporte?.length == 19
    ){return false}

    if(tipo == 1 && this.faltantesIdentificacion){
      for(const valor of this.faltantesIdentificacion){if(valor == preguntaId){return true}}
    }
    if(tipo == 2 && this.faltantesReporte){
      for(const valor of this.faltantesReporte){if(valor == preguntaId){return true}}
    }
    if(tipo == 3 && this.faltantesIngresos){
      for(const valor of this.faltantesIngresos){if(valor == preguntaId){return true}}
    }
    if(tipo == 4 && this.faltantesDigtamen){
      for(const valor of this.faltantesDigtamen){if(valor == preguntaId){return true}}
    }

    return false
  }

  maestras(){
    this.servicio.obtenerMaestras2('sino').subscribe({
      next: (respuesta)=>{
        this.sino = respuesta['siNo']
      }
    })
    this.servicio.obtenerMaestras2('codigosCiiu').subscribe({
      next: (respuesta)=>{
        this.codigosCiiu = respuesta['codigosCiiu']
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
    this.servicio.obtenerMaestras2('naturalezas').subscribe({
      next: (respuesta)=>{
        this.naturalezas = respuesta['naturalezas']
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
        "nombreAlmacenado": this.resCerl?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resCerl?.nombreOriginalArchivo??'',
        "ruta": this.resCerl?.ruta??'',
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
        "nombreAlmacenado": this.resHabilitacion?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resHabilitacion?.nombreOriginalArchivo??'',
        "ruta": this.resHabilitacion?.ruta??'',
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
        "nombreAlmacenado": this.resHabilitacion2?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resHabilitacion2?.nombreOriginalArchivo??'',
        "ruta": this.resHabilitacion2?.ruta??'',
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
        "nombreAlmacenado": this.resDocumentoId?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resDocumentoId?.nombreOriginalArchivo??'',
        "ruta": this.resDocumentoId?.ruta??'',
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
        "nombreAlmacenado": this.resActaNombramiento?.nombreAlmacenado??''??''??'',
        "nombreOriginalArchivo": this.resActaNombramiento?.nombreOriginalArchivo??''??''??'',
        "ruta": this.resActaNombramiento?.ruta??''??''??'',
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
        "nombreAlmacenado": this.resCC?.nombreAlmacenado??''??''??''??'',
        "nombreOriginalArchivo": this.resCC?.nombreOriginalArchivo??''??''??''??'',
        "ruta": this.resCC?.ruta??''??''??''??'',
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
        "nombreAlmacenado": this.resDocumentoIdC?.nombreAlmacenado??''??''??''??''??'',
        "nombreOriginalArchivo": this.resDocumentoIdC?.nombreOriginalArchivo??''??''??''??''??'',
        "ruta": this.resDocumentoIdC?.ruta??''??''??''??''??'',
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
        "nombreAlmacenado": this.resTarjetaProDoc?.nombreAlmacenado??''??''??''??''??''??'',
        "nombreOriginalArchivo": this.resTarjetaProDoc?.nombreOriginalArchivo??''??''??''??''??''??'',
        "ruta": this.resTarjetaProDoc?.ruta??''??''??''??''??''??'',
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
        "nombreAlmacenado": this.resActaNombramientoC?.nombreAlmacenado??''??''??''??''??''??''??'',
        "nombreOriginalArchivo": this.resActaNombramientoC?.nombreOriginalArchivo??''??''??''??''??''??''??'',
        "ruta": this.resActaNombramientoC?.ruta??''??''??''??''??''??''??'',
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
        "nombreAlmacenado": this.resDocumentoIdRF?.nombreAlmacenado??''??''??''??''??''??''??''??'',
        "nombreOriginalArchivo": this.resDocumentoIdRF?.nombreOriginalArchivo??''??''??''??''??''??''??''??'',
        "ruta": this.resDocumentoIdRF?.ruta??''??''??''??''??''??''??''??'',
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
        "valor": this.tarjetaProRF.trim(),
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF TARJETA PROFESIONAL REVISOR" */
        "preguntaId": 66,
        "valor": "",
        "nombreAlmacenado": this.resTarjetaProDocRF?.nombreAlmacenado??''??''??''??''??''??''??''??''??'',
        "nombreOriginalArchivo": this.resTarjetaProDocRF?.nombreOriginalArchivo??''??''??''??''??''??''??''??''??'',
        "ruta": this.resTarjetaProDocRF?.ruta??''??''??''??''??''??''??''??''??'',
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
        "nombreAlmacenado": this.resActaNombramientoRF?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resActaNombramientoRF?.nombreOriginalArchivo??'',
        "ruta": this.resActaNombramientoRF?.ruta??'',
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
        "valor": "",
        "nombreAlmacenado": this.resCamaraYcomercioRF?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resCamaraYcomercioRF?.nombreOriginalArchivo,
        "ruta": this.resCamaraYcomercioRF?.ruta,
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
        "nombreAlmacenado": this.resDocumentoIdRFS?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resDocumentoIdRFS?.nombreOriginalArchivo,
        "ruta": this.resDocumentoIdRFS?.ruta,
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
        "valor": this.tarjetaProRFS.trim(),
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
    },
    {/* "PDF TARJETA PROFESIONAL SUPLENTE" */
        "preguntaId": 79,
        "valor": "",
        "nombreAlmacenado": this.resTarjetaProDocRFS?.nombreAlmacenado??''??'',
        "nombreOriginalArchivo": this.resTarjetaProDocRFS?.nombreOriginalArchivo??''??'',
        "ruta": this.resTarjetaProDocRFS?.ruta??''??'',
    },
    {/* "NÚMERO DE ACTA  SUPLENTE" */
        "preguntaId": 80,
        "valor": this.numeroActaRFS.trim(),
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
        "nombreAlmacenado": this.resActaNombramientoRFS?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resActaNombramientoRFS?.nombreOriginalArchivo??'',
        "ruta": this.resActaNombramientoRFS?.ruta??'',
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
        "nombreAlmacenado": this.resCamaraYcomercioRFS?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resCamaraYcomercioRFS?.nombreOriginalArchivo??'',
        "ruta": this.resCamaraYcomercioRFS?.ruta??'',
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
        "nombreAlmacenado": this.resDocActoAC?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resDocActoAC?.nombreOriginalArchivo??'',
        "ruta": this.resDocActoAC?.ruta??'',
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
        "nombreAlmacenado": this.resDocumentoIdR?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resDocumentoIdR?.nombreOriginalArchivo??'',
        "ruta": this.resDocumentoIdR?.ruta??'',
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
        "nombreAlmacenado": this.resDocActoNR?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resDocActoNR?.nombreOriginalArchivo??'',
        "ruta": this.resDocActoNR?.ruta??'',
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
        "nombreAlmacenado": this.resDocActoNRR?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resDocActoNRR?.nombreOriginalArchivo??'',
        "ruta": this.resDocActoNRR?.ruta??'',
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
        "nombreAlmacenado": this.resDocActoNCR?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resDocActoNCR?.nombreOriginalArchivo??'',
        "ruta": this.resDocActoNCR?.ruta??'',
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
        "valor": this.conSalDictamen,
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
        "nombreAlmacenado": this.resDocDictamen?.nombreAlmacenado??'',
        "nombreOriginalArchivo": this.resDocDictamen?.nombreOriginalArchivo??'',
        "ruta": this.resDocDictamen?.ruta??'',
        "anio": this.anioReporte
    }

    ]
  }
  capturarIngresos(){
    return [
      {/* "Ingresos de actividades ordinarias ó Ingresos Fiscales" */
        "preguntaId": 1,
        "valor": this.IngrsoF1,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
      },
      {/* "Ingresos de actividades ordinarias ó Ingresos Fiscales"  */
        "preguntaId": 1,
        "valor": this.IngrsoF2,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte-1
      },
      {/* "Ingresos derivados de actividades de transporte, conexas y complementarias" */
        "preguntaId": 2,
        "valor": this.IngrsoA1,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
      },
      {/* "Ingresos derivados de actividades de transporte, conexas y complementarias" */
        "preguntaId": 2,
        "valor": this.IngrsoA2,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte-1
      },
      {/* "Unidad de negocio (aeródromos a cargo de los entes territoriales." */
        "preguntaId": 3,
        "valor": this.unidadN1,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
      },
      {/* "Unidad de negocio (aeródromos a cargo de los entes territoriales." */
        "preguntaId": 3,
        "valor": this.unidadN2,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte-1
      },
      {/* "INGRESOS FISCALES NO TRIBUTARIOS " */
        "preguntaId": 4,
        "valor": this.ingresoFT1,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte
      },
      {/* "INGRESOS FISCALES NO TRIBUTARIOS " */
        "preguntaId": 4,
        "valor": this.ingresoFT2,
        "nombreAlmacenado": "",
        "nombreOriginalArchivo": "",
        "ruta": "",
        "anio": this.anioReporte-1
      }
    ]
  }

  llenaridentificacion(){
    this.nit = this.identificacion[0].valor
    this.digito = this.identificacion[1].valor
    this.nombre = this.identificacion[2].valor
    this.codigoCIIU = this.identificacion[3].valor
    this.estadoFinanciero = this.identificacion[4].valor
    this.vinculacionEconomica = this.identificacion[5].valor
    this.subordinadaSi = this.identificacion[6].valor
    this.vinculadosEco = this.identificacion[7].valor
    this.nombreVinculado = this.identificacion[8].valor
    this.nitVinculado = this.identificacion[9].valor
    this.fechaCorteEF = this.identificacion[10].valor
    this.moneda = this.identificacion[11].valor
    /* this.fechaReporte = this.identificacion[12].valor */
    this.periodicidad = this.identificacion[13].valor
    this.anioActual = this.identificacion[14].valor
    this.anioComparativo = this.identificacion[15].valor
    this.tipoEmpresa = this.identificacion[16].valor
    this.naturaleza = this.identificacion[17].valor
    this.tipoSocietario = this.identificacion[18].valor
    this.sJuridica = this.identificacion[19].valor
    this.gtupoNiif = this.identificacion[20].valor
    this.ultimoAnioRM = this.identificacion[21].valor
    this.domicilioPrin = this.identificacion[22].valor
    this.direccionN = this.identificacion[23].valor
    this.email = this.identificacion[24].valor
    this.notElectronica = this.identificacion[25].valor
    /* El archivo que va aquí ya se muestra [26]*/
    this.resCerl = this.identificacion[26]
    /* ---------------------------------------- */
    this.tipoVigilado = this.identificacion[27].valor
    this.fechaInicioPS = this.identificacion[28].valor
    /* El archivo que va aquí ya se muestra [29]*/
    this.resHabilitacion = this.identificacion[29]
    /* ---------------------------------------- */
    this.entidadHabilitante = this.identificacion[30].valor
    this.vigilada = this.identificacion[31].valor
    this.cual = this.identificacion[32].valor
    this.habilitacionPS = this.identificacion[33].valor
    this.tipoVigiladoSelect = this.identificacion[34].valor
    this.fechaInicioPS2 = this.identificacion[35].valor
    /* El archivo que va aquí ya se muestra [36]*/
    this.resHabilitacion2 = this.identificacion[36]
    /* ---------------------------------------- */
    this.entidadHabilitante2 = this.identificacion[37].valor
    this.tipoDocumento = this.identificacion[38].valor
    this.numeroId = this.identificacion[39].valor
    this.nombreCompleto = this.identificacion[40].valor
    /* El archivo que va aquí ya se muestra [41]*/
    this.resDocumentoId = this.identificacion[41]
    /* ---------------------------------------- */
    this.emailRL= this.identificacion[42].valor
    this.numeroActa= this.identificacion[43].valor
    this.fechaNombrmiento= this.identificacion[44].valor
    /* El archivo que va aquí ya se muestra [45]*/
    this.resActaNombramiento = this.identificacion[45]
    /* ---------------------------------------- */
    this.fechaInscrip= this.identificacion[46].valor
    /* El archivo que va aquí ya se muestra [47]*/
    this.resCC = this.identificacion[47]
    /* ---------------------------------------- */
    this.tipoDocumentoC = this.identificacion[48].valor
    this.numeroIdC = this.identificacion[49].valor
    this.nombreCompletoC = this.identificacion[50].valor
    /* El archivo que va aquí ya se muestra [51]*/
    this.resDocumentoIdC = this.identificacion[51]
    /* ---------------------------------------- */
    this.emailC = this.identificacion[52].valor
    this.tarjetaPro = this.identificacion[53].valor
    /* El archivo que va aquí ya se muestra [54]*/
    this.resTarjetaProDoc = this.identificacion[54]
    /* ---------------------------------------- */
    this.numeroActaC = this.identificacion[55].valor
    this.fechaNombrmientoC = this.identificacion[56].valor
    /* El archivo que va aquí ya se muestra [57]*/
    this.resActaNombramientoC = this.identificacion[57]
    /* ---------------------------------------- */
    this.obligadaRF = this.identificacion[58].valor
    this.tipoDocumentoRF = this.identificacion[59].valor
    this.numeroIdRF = this.identificacion[60].valor
    this.nombreCompletoRF = this.identificacion[61].valor
    /* El archivo que va aquí ya se muestra [62]*/
    this.resDocumentoIdRF = this.identificacion[62]
    /* ---------------------------------------- */
    this.emailRF = this.identificacion[63].valor
    this.tarjetaProRF = this.identificacion[64].valor
    /* El archivo que va aquí ya se muestra [65]*/
    this.resTarjetaProDocRF = this.identificacion[65]
    /* ---------------------------------------- */
    this.numeroActaRF = this.identificacion[66].valor
    this.fechaNombrmientoRF = this.identificacion[67].valor
    /* El archivo que va aquí ya se muestra [68]*/
    this.resActaNombramientoRF = this.identificacion[68]
    /* ---------------------------------------- */
    this.fechaInscripRF = this.identificacion[69].valor
    this.firmaAuditoriaRF = this.identificacion[70].valor
    /* El archivo que va aquí ya se muestra [71]*/
    this.resCamaraYcomercioRF = this.identificacion[71]
    /* ---------------------------------------- */
    this.tipoDocumentoRFS = this.identificacion[72].valor
    this.numeroIdRFS = this.identificacion[73].valor
    this.nombreCompletoRFS = this.identificacion[74].valor
    /* El archivo que va aquí ya se muestra [75]*/
    this.resDocumentoIdRFS = this.identificacion[75]
    /* ---------------------------------------- */
    this.emailRFS = this.identificacion[76].valor
    this.tarjetaProRFS = this.identificacion[77].valor
    /* El archivo que va aquí ya se muestra [78]*/
    this.resTarjetaProDocRFS = this.identificacion[78]
    /* ---------------------------------------- */
    this.numeroActaRFS = this.identificacion[79].valor
    this.fechaNombrmientoRFS = this.identificacion[80].valor
    /* El archivo que va aquí ya se muestra [81]*/
    this.resActaNombramientoRFS = this.identificacion[81]
    /* ---------------------------------------- */
    this.fechaInscripRFS = this.identificacion[82].valor
    /* El archivo que va aquí ya se muestra [83]*/
    this.resCamaraYcomercioRFS = this.identificacion[83]
    /* ---------------------------------------- */
  }

  llenarReporte(){
    this.numeroActoAC = this.reporte[0].valor
    this.fechaActoAC = this.reporte[1].valor
    this.tipoEntidadP = this.reporte[2].valor
    this.categoria = this.reporte[3].valor
    /* El archivo que va aquí ya se muestra [4]*/
    this.resDocActoAC = this.reporte[4]
    /* --------------------------------------- */
    this.tipoDocumentoR = this.reporte[5].valor
    this.numeroIdR = this.reporte[6].valor
    this.nombreCompletoR = this.reporte[7].valor
    this.emailR = this.reporte[8].valor
    /* El archivo que va aquí ya se muestra [9]*/
    this.resDocumentoIdR = this.reporte[9]
    /* --------------------------------------- */
    this.actoOficialNR = this.reporte[10].valor
    this.fechaNombrmientoR = this.reporte[11].valor
    /* El archivo que va aquí ya se muestra [12]*/
    this.resDocActoNR = this.reporte[12]
    /* --------------------------------------- */
    this.actoOficialNRF = this.reporte[13].valor
    this.fechaNombrmientoRFR = this.reporte[14].valor
    /* El archivo que va aquí ya se muestra [15]*/
    this.resDocActoNRR = this.reporte[15]
    /* --------------------------------------- */
    this.actoOficialNCR = this.reporte[16].valor
    this.fechaNombrmientoCR = this.reporte[17].valor
    /* El archivo que va aquí ya se muestra [18]*/
    this.resDocActoNCR = this.reporte[18]
    /* --------------------------------------- */
  }

  llenarDictamen(){
    this.dictamen = this.dictamenj[0].valor
    this.opinionDictamen = this.dictamenj[1].valor
    this.conSalDictamen = this.dictamenj[2].valor
    this.enfasisDictamen = this.dictamenj[3].valor
    /* El archivo que va aquí ya se muestra [4]*/
    this.resDocDictamen = this.dictamenj[4]
  }

  llenarIngresos(){
    this.IngrsoF1 = this.encontrarValor(1,this.anioReporte)
    this.IngrsoF2 = this.encontrarValor(1,this.anioReporte-1)
    this.IngrsoA1 = this.encontrarValor(2,this.anioReporte)
    this.IngrsoA2 = this.encontrarValor(2,this.anioReporte-1)
    this.unidadN1 = this.encontrarValor(3,this.anioReporte)
    this.unidadN2 = this.encontrarValor(3,this.anioReporte-1)
    this.ingresoFT1 = this.encontrarValor(4,this.anioReporte)
    this.ingresoFT2 = this.encontrarValor(4,this.anioReporte-1)
  }

  encontrarValor(preguntaId:any, anio:any):string {
    if(preguntaId == 1){
      if(anio === this.ingresos[0].anio){return this.ingresos[0].valor}
      if(anio === this.ingresos[1].anio){return this.ingresos[1].valor}
    }
    if(preguntaId == 2){
      if(anio === this.ingresos[2].anio){return this.ingresos[2].valor}
      if(anio === this.ingresos[3].anio){return this.ingresos[3].valor}
    }
    if(preguntaId == 3){
      if(anio === this.ingresos[4].anio){return this.ingresos[4].valor}
      if(anio === this.ingresos[5].anio){return this.ingresos[5].valor}
    }
    if(preguntaId == 4){
      if(anio === this.ingresos[6].anio){return this.ingresos[6].valor}
      if(anio === this.ingresos[7].anio){return this.ingresos[7].valor}
    }
    return ""
    /* const pregunta = preguntas.find(p => p.preguntaId === preguntaId && p.anio === anio);
    return pregunta ? pregunta.valor : null; */
  }
}
