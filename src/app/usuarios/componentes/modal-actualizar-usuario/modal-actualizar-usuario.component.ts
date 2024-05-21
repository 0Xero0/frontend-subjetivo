import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '../../modelos/Usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Rol } from '../../modelos/Rol';
import { DateTime } from 'luxon';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { UsuarioDB } from '../../modelos/UsuarioDB';

@Component({
  selector: 'app-modal-actualizar-usuario',
  templateUrl: './modal-actualizar-usuario.component.html',
  styleUrls: ['./modal-actualizar-usuario.component.css']
})
export class ModalActualizarUsuarioComponent implements OnInit{
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  @Output('usuarioActualizado') usuarioActualizado: EventEmitter<void>;
  usuario?: UsuarioDB
  formulario: FormGroup
  roles: Rol[] = []
  constructor(private servicioModal: NgbModal, private servicio: ServicioUsuarios, private servicioDepartamento: ServicioDepartamentos){
    this.usuarioActualizado = new EventEmitter<void>();
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      correo: new FormControl(undefined, [ Validators.required ]),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      puertos: new FormControl(false),
      concesiones: new FormControl(false),
      transito: new FormControl(false),
      aerodromos: new FormControl(false),
    })
  }

  ngOnInit(): void {
    this.obtenerRoles()
  }

  abrir(id: string){
    this.obtenerUsuario(id)
    
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }

  actualizar(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controls = this.formulario.controls
    this.servicio.actualizar(this.usuario!.identificacion, {
      apellido: controls['apellido'].value,
      nombre: controls['nombre'].value,
      correo: controls['correo'].value,
      identificacion: controls['identificacion'].value,
      idRol: controls['rol'].value,
      telefono: controls['telefono'].value,
      formularios: [{
        "formularioId":7,
        "estado":controls['puertos'].value
    },{
        "formularioId":8,
        "estado":controls['concesiones'].value
    },{
        "formularioId":9,
        "estado":controls['transito'].value
    },{
        "formularioId":553,
        "estado":controls['aerodromos'].value 
    }]
    }).subscribe({
      next: ()=>{
        this.usuarioActualizado.emit();
        this.cerrar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar el usuario", "Intentalo más tarde.")
      }
    })
  }

  rellenarFormulario(usuario: UsuarioDB){
    console.log(usuario);
    
    const controls = this.formulario.controls
    controls['apellido'].setValue(usuario.apellido)
    controls['nombre'].setValue(usuario.nombre)
    controls['correo'].setValue(usuario.correo)
    controls['identificacion'].setValue(usuario.identificacion)
    controls['rol'].setValue(usuario.id_rol)
    controls['puertos'].setValue(false)
    controls['concesiones'].setValue(false)
    controls['transito'].setValue(false)
    controls['aerodromos'].setValue(false)

    this.marcarCheckboxes(usuario.formularios);



    
  }

  marcarCheckboxes(formularios:any): void {
    formularios.forEach((formulario:any) => {
      switch (formulario.delegatura.toLowerCase()) {
        case 'puertos':
          this.formulario.controls['puertos'].setValue(formulario.estado);
          break;
        case 'concesiones':
          this.formulario.controls['concesiones'].setValue(formulario.estado);
          break;
        case 'tránsito':
          this.formulario.controls['transito'].setValue(formulario.estado);
          break;
        case 'aeródromos':
          this.formulario.controls['aerodromos'].setValue(formulario.estado);
          break;
      }
    });
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }

  obtenerUsuario(id:string){
    this.servicio.obtenerUsuarioPorId(id).subscribe({
      next: (respuesta: any) => {
       this.usuario = respuesta
       if(this.usuario) this.rellenarFormulario(this.usuario);
      }
    })
  }


}
