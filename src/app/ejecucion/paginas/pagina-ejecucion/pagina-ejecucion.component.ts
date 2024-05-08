import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { ActivatedRoute } from '@angular/router';
import { FormularioEjecucionComponent } from '../../componentes/formulario-ejecucion/formulario-ejecucion.component';

@Component({
  selector: 'app-pagina-ejecucion',
  templateUrl: './pagina-ejecucion.component.html',
  styleUrls: ['./pagina-ejecucion.component.css']
})
export class PaginaEjecucionComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  esUsuarioVigilado: boolean;
  idReporte?: number;
  idVigilado?: string

  constructor(
    private servicio: ServicioEjecucion,
    private servicioLocalStorage: ServicioLocalStorage,
    private activatedRoute: ActivatedRoute
    ){
    const usuario = this.servicioLocalStorage.obtenerUsuario();
    const rol = this.servicioLocalStorage.obtenerRol();
    if(!usuario) throw new ErrorAutorizacion();
    if(!rol) throw new ErrorAutorizacion();
    this.esUsuarioVigilado = rol.id === '003' ? true : false;
  }

  formulario?: FormularioEjecucion

  ngOnInit(): void {
  }


}
