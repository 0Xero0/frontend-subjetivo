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
}
