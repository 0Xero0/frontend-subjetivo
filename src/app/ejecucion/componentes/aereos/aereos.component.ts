import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concesiones',
  templateUrl: './aereos.component.html',
  styleUrls: ['./aereos.component.css']
})
export class AereosComponent {
  @ViewChild('popup') popup!: PopupComponent
  hayCambios: boolean = false

  soloLectura: boolean = false
  aprobado: boolean = false
  faltantes: number[] = []

  //Variables select tabla 1
  selectL1: string = "";selectL2: string = "";selectL3: string = "";selectL4: string = "";selectL5: string = "";selectL6: string = "";
  selectL7: string = "";numberL8: string = "";selectL9: string = "";selectL10: string = "";selectL11: string = "";selectL12: string = "";
  selectL13: string = "";selectL14: string = "";selectL15: string = "";
  //Variables select tabla 2
  selectL16: string = "";
  //Variables select tabla 3
  selectL17: string = "";selectL18: string = "";selectL19: string = "";selectL20: string = "";selectL21: string = "";selectL22: string = "";
  //Variables select tabla 4
  selectL23: string = "";
  //Variables select tabla 5
  selectL24: string = "";selectL25: string = "";selectL26: string = "";selectL27: string = "";

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
  archivoT1L5: File | null | string = null;resArchivoT1L5?: ArchivoGuardado
  archivoT1L6: File | null | string = null;resArchivoT1L6?: ArchivoGuardado
  archivoT1L8: File | null | string = null;resArchivoT1L8?: ArchivoGuardado
  //Variables archivos tabla 3
  archivoT3L4: File | null | string = null;resArchivoT3L4?: ArchivoGuardado
  archivoT3L5: File | null | string = null;resArchivoT3L5?: ArchivoGuardado
  //Variables archivos tabla 5
  archivoT5L3: File | null | string = null;resArchivoT5L3?: ArchivoGuardado
  archivoT5L4: File | null | string = null;resArchivoT5L4?: ArchivoGuardado

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

  constructor(private servicio: ServicioEjecucion, private router: Router){
    //this.obtenerPortuarias()
  }
  ngOnChanges(changes: SimpleChanges): void {
  }



  recargarPagina(){
    window.location.reload()
  }

  manejarCambioArchivos(){
    this.hayCambios = true
  }
}
