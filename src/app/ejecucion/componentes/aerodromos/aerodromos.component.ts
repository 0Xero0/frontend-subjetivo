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
  selectedYear: number | null = null;
  listaUltimoAnioRM:Array<string> = []

  habilitarSubordinadas: boolean = true; habilitarNombreV: boolean = true; habilitarNitV: boolean = true; habilitarCual:boolean = true

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

  /* Archivos */
  cerl?:File; resoHabilitacion?:File; resoHabilitacion2?:File; documentoId?:File; actaNombramiento?:File; camaraYcomercio?:File;

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

  identificacion:Array<any> = []

  constructor(private servicio: ServicioEjecucion, private router: Router){
    this.obtenerAerodromos()
    this.fecha = new Date();
    this.fechaActual = this.formatearFecha(this.fecha)
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
          },
          error: (error: HttpErrorResponse) => {
            if(error.status == 415){
              Swal.fire({
                titleText:error.error.mensaje,
                icon:'error'
              })
              if(input == 'cerl'){this.resCerl = undefined; this.cerl = undefined}
              if(input == 'resoHabilitacion'){this.resHabilitacion = undefined; this.resoHabilitacion = undefined}
              if(input == 'resoHabilitacion2'){this.resHabilitacion2 = undefined; this.resoHabilitacion2 = undefined}
              if(input == 'documentoId'){this.resDocumentoId = undefined; this.documentoId = undefined}
              if(input == 'actaNombramiento'){this.resActaNombramiento = undefined; this.actaNombramiento = undefined}
              if(input == 'camaraYcomercio'){this.resCC = undefined; this.camaraYcomercio = undefined}
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
      }
    }
  }

  obtenerAerodromos(){
    this.servicio.obtenerAerodromos().subscribe({
      next: (respuesta)=>{
        console.log(respuesta);
        this.identificacion = respuesta['identificacion']

        this.llenaridentificacion
      }
    })
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
        this.naturalezasD = respuesta['delegaturasD']
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
  }

  llenaridentificacion(){

  }
}
