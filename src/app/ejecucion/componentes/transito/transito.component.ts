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

  servicios = [
    {
      id: 1,
      nombre: 'gruas',
      indice: 'G'
    }
  ]

/*   "gruas": this.check1,
      "patios": this.check2,
      "tramitesTransito": this.check3,
      "deteccionInfracciones": this.check4,
      "procesosContravencionales": this.check5,
      "procesoCobroCoactivo": this.check6,
      "procesoCobroPersuasivo": this.check7,
      "recaudoMultas": this.check8,
      "otros": this.check9 */

  //Variables tabla 1
  textL1: string = "";selectL2: string = "";numberL3: string = "";numberL4: string = "";selectL5: string = "";selectL6: string = "";
  selectL7: string = ""
  //Variables checkbox tabla 2
  check1: boolean = false;check2: boolean = false;check3: boolean = false;check4: boolean = false;check5: boolean = false;
  check6: boolean = false;check7: boolean = false;check8: boolean = false;check9: boolean = false;
  //Variables grua
  textG1: string = "";numeroG1: string = "";selectG1: string = "";selectG2: string = "";textG2: string = "";textG3: string = "";
  textG4: string = "";numeroG2: string = "";archivoG1: File | null = null;archivoG2: File | null = null;selectG3: string = "";
  textG5: string = "";selectG4: string = "";fechaG1?: Date;fechaG2?: Date;selectG5: string = "";numeroG3: string = "";
  textG6: string = "";numeroG4: string = "";
  //Variables Patios
  textP1: string = "";numeroP1: string = "";selectP1: string = "";selectP2: string = "";textP2: string = "";textP3: string = "";
  textP4: string = "";numeroP2: string = "";archivoP1: File | null = null;archivoP2: File | null = null;selectP3: string = "";
  textP5: string = "";selectP4: string = "";fechaP1?: Date;fechaP2?: Date;selectP5: string = "";numeroP3: string = "";
  textP6: string = "";numeroP4: string = "";
  //Variables Tramites
  textT1: string = "";numeroT1: string = "";selectT1: string = "";selectT2: string = "";textT2: string = "";textT3: string = "";
  textT4: string = "";numeroT2: string = "";archivoT1: File | null = null;archivoT2: File | null = null;selectT3: string = "";
  textT5: string = "";selectT4: string = "";fechaT1?: Date;fechaT2?: Date;selectT5: string = "";numeroT3: string = "";
  textT6: string = "";numeroT4: string = "";
  //Variables Deteccion
  textD1: string = "";numeroD1: string = "";selectD1: string = "";selectD2: string = "";textD2: string = "";textD3: string = "";
  textD4: string = "";numeroD2: string = "";archivoD1: File | null = null;archivoD2: File | null = null;selectD3: string = "";
  textD5: string = "";selectD4: string = "";fechaD1?: Date;fechaD2?: Date;selectD5: string = "";numeroD3: string = "";
  textD6: string = "";numeroD4: string = "";
  //Variables PC
  textPC1: string = "";numeroPC1: string = "";selectPC1: string = "";selectPC2: string = "";textPC2: string = "";textPC3: string = "";
  textPC4: string = "";numeroPC2: string = "";archivoPC1: File | null = null;archivoPC2: File | null = null;selectPC3: string = "";
  textPC5: string = "";selectPC4: string = "";fechaPC1?: Date;fechaPC2?: Date;selectPC5: string = "";numeroPC3: string = "";
  textPC6: string = "";numeroPC4: string = "";
  //Variables PCC
  textPCC1: string = "";numeroPCC1: string = "";selectPCC1: string = "";selectPCC2: string = "";textPCC2: string = "";textPCC3: string = "";
  textPCC4: string = "";numeroPCC2: string = "";archivoPCC1: File | null = null;archivoPCC2: File | null = null;selectPCC3: string = "";
  textPCC5: string = "";selectPCC4: string = "";fechaPCC1?: Date;fechaPCC2?: Date;selectPCC5: string = "";numeroPCC3: string = "";
  textPCC6: string = "";numeroPCC4: string = "";
  //Variables PCP
  textPCP1: string = "";numeroPCP1: string = "";selectPCP1: string = "";selectPCP2: string = "";textPCP2: string = "";textPCP3: string = "";
  textPCP4: string = "";numeroPCP2: string = "";archivoPCP1: File | null = null;archivoPCP2: File | null = null;selectPCP3: string = "";
  textPCP5: string = "";selectPCP4: string = "";fechaPCP1?: Date;fechaPCP2?: Date;selectPCP5: string = "";numeroPCP3: string = "";
  textPCP6: string = "";numeroPCP4: string = "";
  //Variables Recaudo
  textR1: string = "";numeroR1: string = "";selectR1: string = "";selectR2: string = "";textR2: string = "";textR3: string = "";
  textR4: string = "";numeroR2: string = "";archivoR1: File | null = null;archivoR2: File | null = null;selectR3: string = "";
  textR5: string = "";selectR4: string = "";fechaR1?: Date;fechaR2?: Date;selectR5: string = "";numeroR3: string = "";
  textR6: string = "";numeroR4: string = "";
  //Variables Otros
  textO1: string = "";numeroO1: string = "";selectO1: string = "";selectO2: string = "";textO2: string = "";textO3: string = "";
  textO4: string = "";numeroO2: string = "";archivoO1: File | null = null;archivoO2: File | null = null;selectO3: string = "";
  textO5: string = "";selectO4: string = "";fechaO1?: Date;fechaO2?: Date;selectO5: string = "";numeroO3: string = "";
  textO6: string = "";selectO0: string = "";numeroO4: string = "";textO0: string =""

  //Variables habilitar/deshabilitar/cambiar/mostrar
  cambioG: boolean = true
  cambioP: boolean = true
  cambioT: boolean = true
  cambioD: boolean = true
  cambioPC: boolean = true
  cambioPCC: boolean = true
  cambioPCP: boolean = true
  cambioR: boolean = true
  cambioO: boolean = true

  //Variables archivos Grua            //Variables archivos Patios          //Variables archivos Traamites       //Variables archivos Deteccion
  resArchivoG1?: ArchivoGuardado;/*  */resArchivoP1?: ArchivoGuardado;/*  */resArchivoT1?: ArchivoGuardado;/*  */resArchivoD1?: ArchivoGuardado;
  resArchivoG2?: ArchivoGuardado;/*  */resArchivoP2?: ArchivoGuardado;/*  */resArchivoT2?: ArchivoGuardado;/*  */resArchivoD2?: ArchivoGuardado;
  
  //Variables archivos PC               //Variables archivos PCC               //Variables archivos PCP               //Variables archivos Recaudo
  resArchivoPC1?: ArchivoGuardado;/*  */resArchivoPCC1?: ArchivoGuardado;/*  */resArchivoPCP1?: ArchivoGuardado;/*  */resArchivoR1?: ArchivoGuardado;
  resArchivoPC2?: ArchivoGuardado;/*  */resArchivoPCC2?: ArchivoGuardado;/*  */resArchivoPCP2?: ArchivoGuardado;/*  */resArchivoR2?: ArchivoGuardado;
  
  //Variables archivos Otros
  resArchivoO1?: ArchivoGuardado;
  resArchivoO2?: ArchivoGuardado;

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

  identificacionOrganismo?: any
  preguntas?: any

  constructor(private servicio: ServicioEjecucion, private router: Router, private servicioLocalStorage: ServicioLocalStorage){
    this.obtenerTransitos()
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
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

  cambioRespuestaSelect(event:any,servicio:any){
    if(event.target.value == null || event.target.value == undefined || event.target.value == ""){
      if(servicio == 'G'){this.cambioG = true; this.numeroG3 = " "}
      if(servicio == 'P'){this.cambioP = true; this.numeroP3 = " "}
      if(servicio == 'T'){this.cambioT = true; this.numeroT3 = " "}
      if(servicio == 'D'){this.cambioD = true; this.numeroD3 = " "}
      if(servicio == 'PC'){this.cambioPC = true; this.numeroPC3 = " "}
      if(servicio == 'PCC'){this.cambioPCC = true; this.numeroPCC3 = " "}
      if(servicio == 'PCP'){this.cambioPCP = true; this.numeroPCP3 = " "}
      if(servicio == 'R'){this.cambioR = true; this.numeroR3 = " "}
      if(servicio == 'O'){this.cambioO = true; this.numeroO3 = " "}
    }
    if(event.target.value == 1){
      if(servicio == 'G'){this.cambioG = false; this.numeroG3 = " "}
      if(servicio == 'P'){this.cambioP = false; this.numeroP3 = " "}
      if(servicio == 'T'){this.cambioT = false; this.numeroT3 = " "}
      if(servicio == 'D'){this.cambioD = false; this.numeroD3 = " "}
      if(servicio == 'PC'){this.cambioPC = false; this.numeroPC3 = " "}
      if(servicio == 'PCC'){this.cambioPCC = false; this.numeroPCC3 = " "}
      if(servicio == 'PCP'){this.cambioPCP = false; this.numeroPCP3 = " "}
      if(servicio == 'R'){this.cambioR = false; this.numeroR3 = " "}
      if(servicio == 'O'){this.cambioO = false; this.numeroO3 = " "}
    }
    if(event.target.value == 2){
      if(servicio == 'G'){this.cambioG = true; this.numeroG3 = " "}
      if(servicio == 'P'){this.cambioP = true; this.numeroP3 = " "}
      if(servicio == 'T'){this.cambioT = true; this.numeroT3 = " "}
      if(servicio == 'D'){this.cambioD = true; this.numeroD3 = " "}
      if(servicio == 'PC'){this.cambioPC = true; this.numeroPC3 = " "}
      if(servicio == 'PCC'){this.cambioPCC = true; this.numeroPCC3 = " "}
      if(servicio == 'PCP'){this.cambioPCP = true; this.numeroPCP3 = " "}
      if(servicio == 'R'){this.cambioR = true; this.numeroR3 = " "}
      if(servicio == 'O'){this.cambioO = true; this.numeroO3 = " "}
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
        this.preguntas = respuesta['preguntas']
        
        for(let i = 1; i <= 37; i++){
          //this.cambioRespuestaSelect(this.portuarias[i-1].valor,i)
        }
        if(respuesta['editable'] != true){
          this.soloLectura = true
          this.hayCambios = true
        }
        this.llenarIdentificacion()
        this.llenarPreguntas(this.preguntas)
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
            if(input == 'G1'){this.resArchivoG1 = respuesta};if(input == 'G2'){this.resArchivoG2 = respuesta}
            if(input == 'P1'){this.resArchivoP1 = respuesta};if(input == 'P2'){this.resArchivoP2 = respuesta}
            if(input == 'T1'){this.resArchivoT1 = respuesta};if(input == 'T2'){this.resArchivoT2 = respuesta}
            if(input == 'D1'){this.resArchivoD1 = respuesta};if(input == 'D2'){this.resArchivoD2 = respuesta}
            if(input == 'PC1'){this.resArchivoPC1 = respuesta};if(input == 'PC2'){this.resArchivoPC2 = respuesta}
            if(input == 'PCC1'){this.resArchivoPCC1 = respuesta};if(input == 'PCC2'){this.resArchivoPCC2 = respuesta}
            if(input == 'PCP1'){this.resArchivoPCP1 = respuesta};if(input == 'PCP2'){this.resArchivoPCP2 = respuesta}
            if(input == 'R1'){this.resArchivoR1 = respuesta};if(input == 'R2'){this.resArchivoR2 = respuesta}
            if(input == 'O1'){this.resArchivoO1 = respuesta};if(input == 'O2'){this.resArchivoO2 = respuesta}
            //console.log(respuesta);
            Swal.close()
          },
          error: (error: HttpErrorResponse) => {
            if(error.status == 415){
              Swal.fire({
                titleText:error.error.mensaje,
                icon:'error'
              })
              if(input == 'G1'){this.archivoG1 = null; this.resArchivoG1 = undefined};
              if(input == 'G2'){this.archivoG2 = null; this.resArchivoG2 = undefined}
              if(input == 'P1'){this.archivoP1 = null; this.resArchivoP1 = undefined};
              if(input == 'P2'){this.archivoP2 = null; this.resArchivoP2 = undefined}
              if(input == 'T1'){this.archivoT1 = null; this.resArchivoT1 = undefined};
              if(input == 'T2'){this.archivoT2 = null; this.resArchivoT2 = undefined}
              if(input == 'D1'){this.archivoD1 = null; this.resArchivoD1 = undefined};
              if(input == 'D2'){this.archivoD2 = null; this.resArchivoD2 = undefined}
              if(input == 'PC1'){this.archivoPC1 = null; this.resArchivoPC1 = undefined};
              if(input == 'PC2'){this.archivoPC2 = null; this.resArchivoPC2 = undefined}
              if(input == 'PCC1'){this.archivoPCC1 = null; this.resArchivoPCC1 = undefined};
              if(input == 'PCC2'){this.archivoPCC2 = null; this.resArchivoPCC2 = undefined}
              if(input == 'PCP1'){this.archivoPCP1 = null; this.resArchivoPCP1 = undefined};
              if(input == 'PCP2'){this.archivoPCP2 = null; this.resArchivoPCP2 = undefined}
              if(input == 'R1'){this.archivoR1 = null; this.resArchivoG1 = undefined};
              if(input == 'R2'){this.archivoR2 = null; this.resArchivoR2 = undefined}
              if(input == 'O1'){this.archivoO1 = null; this.resArchivoO1 = undefined};
              if(input == 'O2'){this.archivoO2 = null; this.resArchivoO2 = undefined}
            }
          }
        })
      }
      else{
        //console.log('Tamaño incorrecto: ',archivo.size);
        if(input == 'G1'){this.archivoG1 = null; this.resArchivoG1 = undefined};
        if(input == 'G2'){this.archivoG2 = null; this.resArchivoG2 = undefined}
        if(input == 'P1'){this.archivoP1 = null; this.resArchivoP1 = undefined};
        if(input == 'P2'){this.archivoP2 = null; this.resArchivoP2 = undefined}
        if(input == 'T1'){this.archivoT1 = null; this.resArchivoT1 = undefined};
        if(input == 'T2'){this.archivoT2 = null; this.resArchivoT2 = undefined}
        if(input == 'D1'){this.archivoD1 = null; this.resArchivoD1 = undefined};
        if(input == 'D2'){this.archivoD2 = null; this.resArchivoD2 = undefined}
        if(input == 'PC1'){this.archivoPC1 = null; this.resArchivoPC1 = undefined};
        if(input == 'PC2'){this.archivoPC2 = null; this.resArchivoPC2 = undefined}
        if(input == 'PCC1'){this.archivoPCC1 = null; this.resArchivoPCC1 = undefined};
        if(input == 'PCC2'){this.archivoPCC2 = null; this.resArchivoPCC2 = undefined}
        if(input == 'PCP1'){this.archivoPCP1 = null; this.resArchivoPCP1 = undefined};
        if(input == 'PCP2'){this.archivoPCP2 = null; this.resArchivoPCP2 = undefined}
        if(input == 'R1'){this.archivoR1 = null; this.resArchivoG1 = undefined};
        if(input == 'R2'){this.archivoR2 = null; this.resArchivoR2 = undefined}
        if(input == 'O1'){this.archivoO1 = null; this.resArchivoO1 = undefined};
        if(input == 'O2'){this.archivoO2 = null; this.resArchivoO2 = undefined}
        Swal.fire({
          titleText:'El archivo cargado no debe ser mayor a 5MB',
          icon:'warning'
        })
      }

    }
  }

  guardar(){
    const identificacionOrganismo = this.capturarIdentificacion();
    const preguntas = this.capturarPreguntas(identificacionOrganismo);

    let preguntaJson: any;

    preguntaJson={identificacionOrganismo, preguntas}
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicio.guardarTransito(preguntaJson).subscribe({
      next: (respuesta: any) =>{
        //console.log(respuesta);
        if(respuesta){
          Swal.fire({
            titleText:"¡Guardado exitoso!",
            icon: "success"
          })
          this.obtenerTransitos()
          //this.detectarCambios()
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

    //console.log(preguntaJson);
  }

  enviarST(){
    this.servicio.enviarSTTransito().subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        /* this.aprobado = respuesta['aprobado']
        this.faltantes = respuesta['faltantes']
        this.obtenerTransitos()
        if(respuesta['aprobado']){
          Swal.fire({
            titleText:"Enviado a ST exitosamente",
            icon: "success"
          })
        } */
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

  verificarFechas(servicio:any){
    if(servicio == 1){
      if(this.fechaG1 && this.fechaG2){
        if(this.fechaG1 >= this.fechaG2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaG1 = undefined; this.fechaG2 = undefined
        }
      }
    }
    if(servicio == 2){
      if(this.fechaP1 && this.fechaP2){
        if(this.fechaP1 >= this.fechaP2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaP1 = undefined; this.fechaP2 = undefined
        }
      }
    }
    if(servicio == 3){
      if(this.fechaT1 && this.fechaT2){
        if(this.fechaT1 >= this.fechaT2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaT1 = undefined; this.fechaT2 = undefined
        }
      }
    }
    if(servicio == 4){
      if(this.fechaD1 && this.fechaD2){
        if(this.fechaD1 >= this.fechaD2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaD1 = undefined; this.fechaD2 = undefined
        }
      }
    }
    if(servicio == 5){
      if(this.fechaPC1 && this.fechaPC2){
        if(this.fechaPC1 >= this.fechaPC2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaPC1 = undefined; this.fechaPC2 = undefined
        }
      }
    }
    if(servicio == 6){
      if(this.fechaPCC1 && this.fechaPCC2){
        if(this.fechaPCC1 >= this.fechaPCC2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaPCC1 = undefined; this.fechaPCC2 = undefined
        }
      }
    }
    if(servicio == 7){
      if(this.fechaPCP1 && this.fechaPCP2){
        if(this.fechaPCP1 >= this.fechaPCP2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaPCP1 = undefined; this.fechaPCP2 = undefined
        }
      }
    }
    if(servicio == 8){
      if(this.fechaR1 && this.fechaR2){
        if(this.fechaR1 >= this.fechaR2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaR1 = undefined; this.fechaR2 = undefined
        }
      }
    }
    if(servicio == 9){
      if(this.fechaO1 && this.fechaO2){
        if(this.fechaO1 >= this.fechaO2){
          Swal.fire({
            titleText:"La fecha Inicial no puede ser mayor o  igual a la fecha final",
            icon:"warning",
          })
          this.fechaO1 = undefined; this.fechaO2 = undefined
        }
      }
    }
  }

  capturarIdentificacion(){
    return {
      "razonSocial": this.textL1,
      "tipoNit": this.selectL2,
      "nit": this.numberL3,
      "digitoVerificacion": this.numberL4,
      "tipoOrganizacion": this.selectL5,
      "apoyaTerceros": this.selectL6,
      "procesoAdjudicacion": this.selectL7,
      "gruas": this.check1,
      "patios": this.check2,
      "tramitesTransito": this.check3,
      "deteccionInfracciones": this.check4,
      "procesosContravencionales": this.check5,
      "procesoCobroCoactivo": this.check6,
      "procesoCobroPersuasivo": this.check7,
      "recaudoMultas": this.check8,
      "otros": this.check9
    }
  }

  capturarPreguntas(identificacion:any){
    const preguntas = []

    if(identificacion.gruas){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textG1,
        "servicioId":1
      },{
        "preguntaId":2,
        "valor":this.numeroG1,
        "servicioId":1
      },{
        "preguntaId":3,
        "valor":this.selectG2,
        "servicioId":1
      },{
        "preguntaId":4,
        "valor":this.textG2,
        "servicioId":1
      },{
        "preguntaId":5,
        "valor":this.textG3,
        "servicioId":1
      },{
        "preguntaId":6,
        "valor":this.textG4,
        "servicioId":1
      },{
        "preguntaId":7,
        "valor":this.numeroG2,
        "servicioId":1
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoG1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoG1?.nombreOriginalArchivo,
        "ruta": this.resArchivoG1?.ruta,
        "servicioId":1
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoG2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoG2?.nombreOriginalArchivo,
        "ruta": this.resArchivoG2?.ruta,
        "servicioId":1
      },{
        "preguntaId":9,
        "valor":this.selectG3,
        "servicioId":1
      },{
        "preguntaId":10,
        "valor":this.textG5,
        "servicioId":1
      },{
        "preguntaId":11,
        "valor":this.selectG4,
        "servicioId":1
      },{
        "preguntaId":12,
        "valor":this.fechaG1,
        "servicioId":1
      },{
        "preguntaId":13,
        "valor":this.fechaG2,
        "servicioId":1
      },{
        "preguntaId":14,
        "valor":this.selectG5,
        "servicioId":1
      },{
        "preguntaId":15,
        "valor":this.numeroG3,
        "servicioId":1
      },{
        "preguntaId":16,
        "valor":this.textG6,
        "servicioId":1
      }   
    
    )
    }

    if(identificacion.patios){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textP1,
        "servicioId":2
      },{
        "preguntaId":2,
        "valor":this.numeroP1,
        "servicioId":2
      },{
        "preguntaId":3,
        "valor":this.selectP2,
        "servicioId":2
      },{
        "preguntaId":4,
        "valor":this.textP2,
        "servicioId":2
      },{
        "preguntaId":5,
        "valor":this.textP3,
        "servicioId":2
      },{
        "preguntaId":6,
        "valor":this.textP4,
        "servicioId":2
      },{
        "preguntaId":7,
        "valor":this.numeroP2,
        "servicioId":2
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoP1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoP1?.nombreOriginalArchivo,
        "ruta": this.resArchivoP1?.ruta,
        "servicioId":2
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoP2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoP2?.nombreOriginalArchivo,
        "ruta": this.resArchivoP2?.ruta,
        "servicioId":2
      },{
        "preguntaId":9,
        "valor":this.selectP3,
        "servicioId":2
      },{
        "preguntaId":10,
        "valor":this.textP5,
        "servicioId":2
      },{
        "preguntaId":11,
        "valor":this.selectP4,
        "servicioId":2
      },{
        "preguntaId":12,
        "valor":this.fechaP1,
        "servicioId":2
      },{
        "preguntaId":13,
        "valor":this.fechaP2,
        "servicioId":2
      },{
        "preguntaId":14,
        "valor":this.selectP5,
        "servicioId":2
      },{
        "preguntaId":15,
        "valor":this.numeroP3,
        "servicioId":2
      },{
        "preguntaId":16,
        "valor":this.textP6,
        "servicioId":2
      }   
    
    )
    }

    if(identificacion.tramitesTransito){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textT1,
        "servicioId":3
      },{
        "preguntaId":2,
        "valor":this.numeroT1,
        "servicioId":3
      },{
        "preguntaId":3,
        "valor":this.selectT2,
        "servicioId":3
      },{
        "preguntaId":4,
        "valor":this.textT2,
        "servicioId":3
      },{
        "preguntaId":5,
        "valor":this.textT3,
        "servicioId":3
      },{
        "preguntaId":6,
        "valor":this.textT4,
        "servicioId":3
      },{
        "preguntaId":7,
        "valor":this.numeroT2,
        "servicioId":3
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoT1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoT1?.nombreOriginalArchivo,
        "ruta": this.resArchivoT1?.ruta,
        "servicioId":3
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoT2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoT2?.nombreOriginalArchivo,
        "ruta": this.resArchivoT2?.ruta,
        "servicioId":3
      },{
        "preguntaId":9,
        "valor":this.selectT3,
        "servicioId":3
      },{
        "preguntaId":10,
        "valor":this.textT5,
        "servicioId":3
      },{
        "preguntaId":11,
        "valor":this.selectT4,
        "servicioId":3
      },{
        "preguntaId":12,
        "valor":this.fechaT1,
        "servicioId":3
      },{
        "preguntaId":13,
        "valor":this.fechaT2,
        "servicioId":3
      },{
        "preguntaId":14,
        "valor":this.selectT5,
        "servicioId":3
      },{
        "preguntaId":15,
        "valor":this.numeroT3,
        "servicioId":3
      },{
        "preguntaId":16,
        "valor":this.textT6,
        "servicioId":3
      }   
    
    )
    }

    if(identificacion.deteccionInfracciones){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textD1,
        "servicioId":4
      },{
        "preguntaId":2,
        "valor":this.numeroD1,
        "servicioId":4
      },{
        "preguntaId":3,
        "valor":this.selectD2,
        "servicioId":4
      },{
        "preguntaId":4,
        "valor":this.textD2,
        "servicioId":4
      },{
        "preguntaId":5,
        "valor":this.textD3,
        "servicioId":4
      },{
        "preguntaId":6,
        "valor":this.textD4,
        "servicioId":4
      },{
        "preguntaId":7,
        "valor":this.numeroD2,
        "servicioId":4
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoD1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoD1?.nombreOriginalArchivo,
        "ruta": this.resArchivoD1?.ruta,
        "servicioId":1
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoD2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoD2?.nombreOriginalArchivo,
        "ruta": this.resArchivoD2?.ruta,
        "servicioId":4
      },{
        "preguntaId":9,
        "valor":this.selectD3,
        "servicioId":4
      },{
        "preguntaId":10,
        "valor":this.textD5,
        "servicioId":4
      },{
        "preguntaId":11,
        "valor":this.selectD4,
        "servicioId":4
      },{
        "preguntaId":12,
        "valor":this.fechaD1,
        "servicioId":4
      },{
        "preguntaId":13,
        "valor":this.fechaD2,
        "servicioId":4
      },{
        "preguntaId":14,
        "valor":this.selectD5,
        "servicioId":4
      },{
        "preguntaId":15,
        "valor":this.numeroD3,
        "servicioId":4
      },{
        "preguntaId":16,
        "valor":this.textD6,
        "servicioId":4
      }   
    
    )
    }

    if(identificacion.procesosContravencionales){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textPC1,
        "servicioId":5
      },{
        "preguntaId":2,
        "valor":this.numeroPC1,
        "servicioId":5
      },{
        "preguntaId":3,
        "valor":this.selectPC2,
        "servicioId":5
      },{
        "preguntaId":4,
        "valor":this.textPC2,
        "servicioId":5
      },{
        "preguntaId":5,
        "valor":this.textPC3,
        "servicioId":5
      },{
        "preguntaId":6,
        "valor":this.textPC4,
        "servicioId":5
      },{
        "preguntaId":7,
        "valor":this.numeroPC2,
        "servicioId":5
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoPC1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoPC1?.nombreOriginalArchivo,
        "ruta": this.resArchivoPC1?.ruta,
        "servicioId":5
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoPC2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoPC2?.nombreOriginalArchivo,
        "ruta": this.resArchivoPC2?.ruta,
        "servicioId":5
      },{
        "preguntaId":9,
        "valor":this.selectPC3,
        "servicioId":5
      },{
        "preguntaId":10,
        "valor":this.textPC5,
        "servicioId":5
      },{
        "preguntaId":11,
        "valor":this.selectPC4,
        "servicioId":5
      },{
        "preguntaId":12,
        "valor":this.fechaPC1,
        "servicioId":5
      },{
        "preguntaId":13,
        "valor":this.fechaPC2,
        "servicioId":5
      },{
        "preguntaId":14,
        "valor":this.selectPC5,
        "servicioId":5
      },{
        "preguntaId":15,
        "valor":this.numeroPC3,
        "servicioId":5
      },{
        "preguntaId":16,
        "valor":this.textPC6,
        "servicioId":5
      }   
    
    )
    }

    if(identificacion.procesoCobroCoactivo){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textPCC1,
        "servicioId":6
      },{
        "preguntaId":2,
        "valor":this.numeroPCC1,
        "servicioId":6
      },{
        "preguntaId":3,
        "valor":this.selectPCC2,
        "servicioId":6
      },{
        "preguntaId":4,
        "valor":this.textPCC2,
        "servicioId":6
      },{
        "preguntaId":5,
        "valor":this.textPCC3,
        "servicioId":6
      },{
        "preguntaId":6,
        "valor":this.textPCC4,
        "servicioId":6
      },{
        "preguntaId":7,
        "valor":this.numeroPCC2,
        "servicioId":6
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoPCC1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoPCC1?.nombreOriginalArchivo,
        "ruta": this.resArchivoPCC1?.ruta,
        "servicioId":6
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoPCC2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoPCC2?.nombreOriginalArchivo,
        "ruta": this.resArchivoPCC2?.ruta,
        "servicioId":6
      },{
        "preguntaId":9,
        "valor":this.selectPCC3,
        "servicioId":6
      },{
        "preguntaId":10,
        "valor":this.textPCC5,
        "servicioId":6
      },{
        "preguntaId":11,
        "valor":this.selectPCC4,
        "servicioId":6
      },{
        "preguntaId":12,
        "valor":this.fechaPCC1,
        "servicioId":6
      },{
        "preguntaId":13,
        "valor":this.fechaPCC2,
        "servicioId":6
      },{
        "preguntaId":14,
        "valor":this.selectPCC5,
        "servicioId":6
      },{
        "preguntaId":15,
        "valor":this.numeroPCC3,
        "servicioId":6
      },{
        "preguntaId":16,
        "valor":this.textPCC6,
        "servicioId":6
      }   
    
    )
    }

    if(identificacion.procesoCobroPersuasivo){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textPCP1,
        "servicioId":7
      },{
        "preguntaId":2,
        "valor":this.numeroPCP1,
        "servicioId":7
      },{
        "preguntaId":3,
        "valor":this.selectPCP2,
        "servicioId":7
      },{
        "preguntaId":4,
        "valor":this.textPCP2,
        "servicioId":7
      },{
        "preguntaId":5,
        "valor":this.textPCP3,
        "servicioId":7
      },{
        "preguntaId":6,
        "valor":this.textPCP4,
        "servicioId":7
      },{
        "preguntaId":7,
        "valor":this.numeroPCP2,
        "servicioId":7
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoPCP1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoPCP1?.nombreOriginalArchivo,
        "ruta": this.resArchivoPCP1?.ruta,
        "servicioId":1
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoPCP2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoPCP2?.nombreOriginalArchivo,
        "ruta": this.resArchivoPCP2?.ruta,
        "servicioId":1
      },{
        "preguntaId":9,
        "valor":this.selectPCP3,
        "servicioId":7
      },{
        "preguntaId":10,
        "valor":this.textPCP5,
        "servicioId":7
      },{
        "preguntaId":11,
        "valor":this.selectPCP4,
        "servicioId":7
      },{
        "preguntaId":12,
        "valor":this.fechaPCP1,
        "servicioId":7
      },{
        "preguntaId":13,
        "valor":this.fechaPCP2,
        "servicioId":7
      },{
        "preguntaId":14,
        "valor":this.selectPCP5,
        "servicioId":7
      },{
        "preguntaId":15,
        "valor":this.numeroPCP3,
        "servicioId":7
      },{
        "preguntaId":16,
        "valor":this.textPCP6,
        "servicioId":7
      }   
    
    )
    }

    if(identificacion.recaudoMultas){
      preguntas.push({
        "preguntaId":1,
        "valor":this.textR1,
        "servicioId":8
      },{
        "preguntaId":2,
        "valor":this.numeroR1,
        "servicioId":8
      },{
        "preguntaId":3,
        "valor":this.selectR2,
        "servicioId":8
      },{
        "preguntaId":4,
        "valor":this.textR2,
        "servicioId":8
      },{
        "preguntaId":5,
        "valor":this.textR3,
        "servicioId":8
      },{
        "preguntaId":6,
        "valor":this.textR4,
        "servicioId":8
      },{
        "preguntaId":7,
        "valor":this.numeroR2,
        "servicioId":8
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoR1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoR1?.nombreOriginalArchivo,
        "ruta": this.resArchivoG1?.ruta,
        "servicioId":8
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoR2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoR2?.nombreOriginalArchivo,
        "ruta": this.resArchivoR2?.ruta,
        "servicioId":8
      },{
        "preguntaId":9,
        "valor":this.selectR3,
        "servicioId":8
      },{
        "preguntaId":10,
        "valor":this.textR5,
        "servicioId":8
      },{
        "preguntaId":11,
        "valor":this.selectR4,
        "servicioId":8
      },{
        "preguntaId":12,
        "valor":this.fechaR1,
        "servicioId":8
      },{
        "preguntaId":13,
        "valor":this.fechaR2,
        "servicioId":8
      },{
        "preguntaId":14,
        "valor":this.selectR5,
        "servicioId":8
      },{
        "preguntaId":15,
        "valor":this.numeroR3,
        "servicioId":8
      },{
        "preguntaId":16,
        "valor":this.textR6,
        "servicioId":8
      }   
    
    )
    }

    if(identificacion.otros){
      preguntas.push({
        "preguntaId":0,
        "valor":this.textO0,
        "servicioId":9
      },{
        "preguntaId":1,
        "valor":this.textO1,
        "servicioId":9
      },{
        "preguntaId":2,
        "valor":this.numeroO1,
        "servicioId":9
      },{
        "preguntaId":3,
        "valor":this.selectO2,
        "servicioId":9
      },{
        "preguntaId":4,
        "valor":this.textO2,
        "servicioId":9
      },{
        "preguntaId":5,
        "valor":this.textO3,
        "servicioId":9
      },{
        "preguntaId":6,
        "valor":this.textO4,
        "servicioId":9
      },{
        "preguntaId":7,
        "valor":this.numeroO2,
        "servicioId":9
      },{
        "preguntaId": 17,
        "nombreAlmacenado": this.resArchivoO1?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoO1?.nombreOriginalArchivo,
        "ruta": this.resArchivoO1?.ruta,
        "servicioId":9
      },{
        "preguntaId": 8,
        "nombreAlmacenado": this.resArchivoO2?.nombreAlmacenado,
        "nombreOriginalArchivo": this.resArchivoO2?.nombreOriginalArchivo,
        "ruta": this.resArchivoO2?.ruta,
        "servicioId":9
      },{
        "preguntaId":9,
        "valor":this.selectO3,
        "servicioId":9
      },{
        "preguntaId":10,
        "valor":this.textO5,
        "servicioId":9
      },{
        "preguntaId":11,
        "valor":this.selectO4,
        "servicioId":9
      },{
        "preguntaId":12,
        "valor":this.fechaO1,
        "servicioId":9
      },{
        "preguntaId":13,
        "valor":this.fechaO2,
        "servicioId":9
      },{
        "preguntaId":14,
        "valor":this.selectO5,
        "servicioId":9
      },{
        "preguntaId":15,
        "valor":this.numeroO3,
        "servicioId":9
      },{
        "preguntaId":16,
        "valor":this.textO6,
        "servicioId":9
      }   
    
    )
    }

    return preguntas
  }

  llenarIdentificacion(){
    //Inicializar variables
    this.textL1 = this.identificacionOrganismo.razonSocial
    this.selectL2 = this.identificacionOrganismo.tipoNit
    this.numberL3 = this.identificacionOrganismo.nit
    this.numberL4 = this.identificacionOrganismo.digitoVerificacion
    this.selectL5 = this.identificacionOrganismo.tipoOrganizacion
    this.selectL6 = this.identificacionOrganismo.apoyaTerceros
    this.selectL7 = this.identificacionOrganismo.procesoAdjudicacion
    this.check1 = this.identificacionOrganismo.gruas
    this.check2 = this.identificacionOrganismo.patios
    this.check3 = this.identificacionOrganismo.tramitesTransito
    this.check4 = this.identificacionOrganismo.deteccionInfracciones
    this.check5 = this.identificacionOrganismo.procesosContravencionales
    this.check6 = this.identificacionOrganismo.procesoCobroCoactivo
    this.check7 = this.identificacionOrganismo.procesoCobroPersuasivo
    this.check8 = this.identificacionOrganismo.recaudoMultas
    this.check9 = this.identificacionOrganismo.otros
  }

  llenarPreguntas(preguntas:any){
    /* Gruas */
    this.textG1 = preguntas.gruas[1].valor
    this.numeroG1 = preguntas.gruas[2].valor
    this.selectG2 = preguntas.gruas[3].valor
    this.textG2 = preguntas.gruas[4].valor
    this.textG3 = preguntas.gruas[5].valor
    this.textG4 = preguntas.gruas[6].valor
    this.numeroG2 = preguntas.gruas[7].valor
    this.selectG3 = preguntas.gruas[9].valor
    this.textG5 = preguntas.gruas[10].valor
    this.selectG4 = preguntas.gruas[11].valor
    this.fechaG1 = preguntas.gruas[12].valor
    this.fechaG2 = preguntas.gruas[13].valor
    this.selectG5 = preguntas.gruas[14].valor
    this.numeroG3 = preguntas.gruas[15].valor
    this.textG6 = preguntas.gruas[16].valor
    /* patios */
    this.textP1 = preguntas.patios[1].valor
    this.numeroP1 = preguntas.patios[2].valor
    this.selectP2 = preguntas.patios[3].valor
    this.textP2 = preguntas.patios[4].valor
    this.textP3 = preguntas.patios[5].valor
    this.textP4 = preguntas.patios[6].valor
    this.numeroP2 = preguntas.patios[7].valor
    this.selectP3 = preguntas.patios[9].valor
    this.textP5 = preguntas.patios[10].valor
    this.selectP4 = preguntas.patios[11].valor
    this.fechaP1 = preguntas.patios[12].valor
    this.fechaP2 = preguntas.patios[13].valor
    this.selectP5 = preguntas.patios[14].valor
    this.numeroP3 = preguntas.patios[15].valor
    this.textP6 = preguntas.patios[16].valor
    /* tramitesTransito */
    this.textT1 = preguntas.tramitesTransito[1].valor
    this.numeroT1 = preguntas.tramitesTransito[2].valor
    this.selectT2 = preguntas.tramitesTransito[3].valor
    this.textT2 = preguntas.tramitesTransito[4].valor
    this.textT3 = preguntas.tramitesTransito[5].valor
    this.textT4 = preguntas.tramitesTransito[6].valor
    this.numeroT2 = preguntas.tramitesTransito[7].valor
    this.selectT3 = preguntas.tramitesTransito[9].valor
    this.textT5 = preguntas.tramitesTransito[10].valor
    this.selectT4 = preguntas.tramitesTransito[11].valor
    this.fechaT1 = preguntas.tramitesTransito[12].valor
    this.fechaT2 = preguntas.tramitesTransito[13].valor
    this.selectT5 = preguntas.tramitesTransito[14].valor
    this.numeroT3 = preguntas.tramitesTransito[15].valor
    this.textT6 = preguntas.tramitesTransito[16].valor
    /* deteccionInfracciones */
    this.textD1 = preguntas.deteccionInfracciones[1].valor
    this.numeroD1 = preguntas.deteccionInfracciones[2].valor
    this.selectD2 = preguntas.deteccionInfracciones[3].valor
    this.textD2 = preguntas.deteccionInfracciones[4].valor
    this.textD3 = preguntas.deteccionInfracciones[5].valor
    this.textD4 = preguntas.deteccionInfracciones[6].valor
    this.numeroD2 = preguntas.deteccionInfracciones[7].valor
    this.selectD3 = preguntas.deteccionInfracciones[9].valor
    this.textD5 = preguntas.deteccionInfracciones[10].valor
    this.selectD4 = preguntas.deteccionInfracciones[11].valor
    this.fechaD1 = preguntas.deteccionInfracciones[12].valor
    this.fechaD2 = preguntas.deteccionInfracciones[13].valor
    this.selectD5 = preguntas.deteccionInfracciones[14].valor
    this.numeroD3 = preguntas.deteccionInfracciones[15].valor
    this.textD6 = preguntas.deteccionInfracciones[16].valor
    /* procesosContravencionales */
    this.textPC1 = preguntas.procesosContravencionales[1].valor
    this.numeroPC1 = preguntas.procesosContravencionales[2].valor
    this.selectPC2 = preguntas.procesosContravencionales[3].valor
    this.textPC2 = preguntas.procesosContravencionales[4].valor
    this.textPC3 = preguntas.procesosContravencionales[5].valor
    this.textPC4 = preguntas.procesosContravencionales[6].valor
    this.numeroPC2 = preguntas.procesosContravencionales[7].valor
    this.selectPC3 = preguntas.procesosContravencionales[9].valor
    this.textPC5 = preguntas.procesosContravencionales[10].valor
    this.selectPC4 = preguntas.procesosContravencionales[11].valor
    this.fechaPC1 = preguntas.procesosContravencionales[12].valor
    this.fechaPC2 = preguntas.procesosContravencionales[13].valor
    this.selectPC5 = preguntas.procesosContravencionales[14].valor
    this.numeroPC3 = preguntas.procesosContravencionales[15].valor
    this.textPC6 = preguntas.procesosContravencionales[16].valor
    /* procesoCobroCoactivo */
    this.textPCC1 = preguntas.procesoCobroCoactivo[1].valor
    this.numeroPCC1 = preguntas.procesoCobroCoactivo[2].valor
    this.selectPCC2 = preguntas.procesoCobroCoactivo[3].valor
    this.textPCC2 = preguntas.procesoCobroCoactivo[4].valor
    this.textPCC3 = preguntas.procesoCobroCoactivo[5].valor
    this.textPCC4 = preguntas.procesoCobroCoactivo[6].valor
    this.numeroPCC2 = preguntas.procesoCobroCoactivo[7].valor
    this.selectPCC3 = preguntas.procesoCobroCoactivo[9].valor
    this.textPCC5 = preguntas.procesoCobroCoactivo[10].valor
    this.selectPCC4 = preguntas.procesoCobroCoactivo[11].valor
    this.fechaPCC1 = preguntas.procesoCobroCoactivo[12].valor
    this.fechaPCC2 = preguntas.procesoCobroCoactivo[13].valor
    this.selectPCC5 = preguntas.procesoCobroCoactivo[14].valor
    this.numeroPCC3 = preguntas.procesoCobroCoactivo[15].valor
    this.textPCC6 = preguntas.procesoCobroCoactivo[16].valor
    /* procesoCobroPersuasivo */
    this.textPCP1 = preguntas.procesoCobroPersuasivo[1].valor
    this.numeroPCP1 = preguntas.procesoCobroPersuasivo[2].valor
    this.selectPCP2 = preguntas.procesoCobroPersuasivo[3].valor
    this.textPCP2 = preguntas.procesoCobroPersuasivo[4].valor
    this.textPCP3 = preguntas.procesoCobroPersuasivo[5].valor
    this.textPCP4 = preguntas.procesoCobroPersuasivo[6].valor
    this.numeroPCP2 = preguntas.procesoCobroPersuasivo[7].valor
    this.selectPCP3 = preguntas.procesoCobroPersuasivo[9].valor
    this.textPCP5 = preguntas.procesoCobroPersuasivo[10].valor
    this.selectPCP4 = preguntas.procesoCobroPersuasivo[11].valor
    this.fechaPCP1 = preguntas.procesoCobroPersuasivo[12].valor
    this.fechaPCP2 = preguntas.procesoCobroPersuasivo[13].valor
    this.selectPCP5 = preguntas.procesoCobroPersuasivo[14].valor
    this.numeroPCP3 = preguntas.procesoCobroPersuasivo[15].valor
    this.textPCP6 = preguntas.procesoCobroPersuasivo[16].valor
    /* recaudoMultas */
    this.textR1 = preguntas.recaudoMultas[1].valor
    this.numeroR1 = preguntas.recaudoMultas[2].valor
    this.selectR2 = preguntas.recaudoMultas[3].valor
    this.textR2 = preguntas.recaudoMultas[4].valor
    this.textR3 = preguntas.recaudoMultas[5].valor
    this.textR4 = preguntas.recaudoMultas[6].valor
    this.numeroR2 = preguntas.recaudoMultas[7].valor
    this.selectR3 = preguntas.recaudoMultas[9].valor
    this.textR5 = preguntas.recaudoMultas[10].valor
    this.selectR4 = preguntas.recaudoMultas[11].valor
    this.fechaR1 = preguntas.recaudoMultas[12].valor
    this.fechaR2 = preguntas.recaudoMultas[13].valor
    this.selectR5 = preguntas.recaudoMultas[14].valor
    this.numeroR3 = preguntas.recaudoMultas[15].valor
    this.textR6 = preguntas.recaudoMultas[16].valor
    /* otros */
    this.textO0 = preguntas.otros[0].valor
    this.textO1 = preguntas.otros[1].valor
    this.numeroO1 = preguntas.otros[2].valor
    this.selectO2 = preguntas.otros[3].valor
    this.textO2 = preguntas.otros[4].valor
    this.textO3 = preguntas.otros[5].valor
    this.textO4 = preguntas.otros[6].valor
    this.numeroO2 = preguntas.otros[7].valor
    this.selectO3 = preguntas.otros[9].valor
    this.textO5 = preguntas.otros[10].valor
    this.selectO4 = preguntas.otros[11].valor
    this.fechaO1 = preguntas.otros[12].valor
    this.fechaO2 = preguntas.otros[13].valor
    this.selectO5 = preguntas.otros[14].valor
    this.numeroO3 = preguntas.otros[15].valor
    this.textO6 = preguntas.otros[16].valor
  }
}
