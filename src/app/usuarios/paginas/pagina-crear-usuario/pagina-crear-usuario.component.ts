import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosUsuarios } from '../../modelos/FiltrosUsuarios';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { Observable } from 'rxjs';
import { Usuario } from '../../modelos/Usuario';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ModalActualizarUsuarioComponent } from '../../componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';
import { Rol } from '../../modelos/Rol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';

@Component({
  selector: 'app-pagina-crear-usuario',
  templateUrl: './pagina-crear-usuario.component.html',
  styleUrls: ['./pagina-crear-usuario.component.css']
})
export class PaginaCrearUsuarioComponent implements OnInit{
  @ViewChild('modalActualizarUsuario') modalActualizarUsuario!: ModalActualizarUsuarioComponent
  @ViewChild('popup') popup!: PopupComponent
  paginador: Paginador<FiltrosUsuarios>
  usuarios: Usuario[] = []
  termino: string = ""
  rol: string = ""
  roles: Rol[] = []
  formulario: FormGroup
  mostrarFormularios = false
 /*  puertos: boolean = false; concesiones: boolean = false; transito: boolean = false; aerodromos: boolean = false; */
/*   departamentos: Departamento[] = []
  municipios: Ciudad[] = [] */

  constructor(private servicio: ServicioUsuarios, private servicioDepartamento: ServicioDepartamentos){
    this.paginador = new Paginador<FiltrosUsuarios>(this.obtenerUsuarios)
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      correo: new FormControl(undefined, [ Validators.required, Validators.email ]),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      puertos: new FormControl(false),
      concesiones: new FormControl(false),
      transito: new FormControl(false),
      aerodromos: new FormControl(false),
    })
  }

  ngOnInit(): void {
    this.paginador.inicializar(1, 30)
    this.obtenerRoles()
    this.formulario.controls['rol'].valueChanges.subscribe({
      next: (rolId)=>{
        console.log(rolId);
        (rolId == '003')?this.mostrarFormularios = true:this.mostrarFormularios = false
        
      }
    })
 
  }

  obtenerUsuarios = (pagina: number, limite: number, filtros?: FiltrosUsuarios)=>{
    return new Observable<Paginacion>( subscripcion => {
      this.servicio.listar(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.usuarios = respuesta.usuarios
          subscripcion.next(respuesta.paginacion) 
        }
      })
    })
  }

  manejarUsuarioActualizado(){
    this.paginador.refrescar()
    this.popup.abrirPopupExitoso('Usuario actualizado con éxito.')
  }

  crear(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }

   /*  const formularios = this.obtenerFormularios(); */
   const controls = this.formulario.controls
   
    this.servicio.guardar({
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
        this.popup.abrirPopupExitoso("Usuario creado con éxito.")
        this.paginador.refrescar()
        this.limpiarFormulario()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al crear el usuario", "Intentalo más tarde.")
      }
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({
      termino: this.termino,
      rol: this.rol
    })
  }

  limpiarFiltros(){
    this.termino = ""
    this.rol = ""
    this.paginador.filtrar({})
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  abrirModalActualizarUsuario(id: string){
    this.modalActualizarUsuario.abrir(id)
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }

/*   obtenerFormularios(){
    const formularios = [{
      "formularioId":7,
      "estado":this.puertos
  },{
      "formularioId":8,
      "estado":this.concesiones
  },{
      "formularioId":9,
      "estado":this.transito
  },{
      "formularioId":553,
      "estado":this.aerodromos
  }]

  return formularios

  } */


}
