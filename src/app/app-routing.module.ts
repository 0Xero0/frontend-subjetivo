import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantillaComponent } from './administrador/componentes/plantilla/plantilla.component';
import { InicioSesionComponent } from './autenticacion/componentes/inicio-sesion/inicio-sesion.component';
import { ActualizarContrasenaComponent } from './autenticacion/componentes/actualizar-contrasena/actualizar-contrasena.component';
import { AutenticacionGuard } from './guards/autenticacion.guard';
import { PaginaInformacionGeneralVigiladoComponent } from './administrador/paginas/pagina-informacion-general-vigilado/pagina-informacion-general-vigilado.component';
import { PaginaSoporteComponent } from './administrador/paginas/pagina-soporte/pagina-soporte.component';
import { PaginaSoportesComponent } from './soportes/paginas/pagina-soportes/pagina-soportes.component';
import { PaginaResponderSoporteComponent } from './soportes/paginas/pagina-responder-soporte/pagina-responder-soporte.component';
import { SoporteAccesoComponent } from './autenticacion/componentes/soporte-acceso/soporte-acceso.component';
import { FormularioEjecucionComponent } from './ejecucion/componentes/formulario-ejecucion/formulario-ejecucion.component';
import { PaginaEjecucionComponent } from './ejecucion/paginas/pagina-ejecucion/pagina-ejecucion.component';
import { AereosComponent } from './ejecucion/componentes/aereos/aereos.component';
import { TransitoComponent } from './ejecucion/componentes/transito/transito.component';
import { AerodromosComponent } from './ejecucion/componentes/aerodromos/aerodromos.component';
import { VerificarSubjetivoComponent } from './verificar-subjetivo/verificar-subjetivo.component';
import { VigenciasComponent } from './ejecucion/vigencias/vigencias.component';
import { VistaVigenciaEjecucionComponent } from './ejecucion/componentes/formulario-ejecucion/vista-vigencia-ejecucion/vista-vigencia-ejecucion.component';
import { VistaVigenciaTransitoComponent } from './ejecucion/componentes/transito/vista-vigencia-transito/vista-vigencia-transito.component';
import { VistaVigenciaAereosComponent } from './ejecucion/componentes/aereos/vista-vigencia-aereos/vista-vigencia-aereos.component';
import { VistaVigenciaAerodromosComponent } from './ejecucion/componentes/aerodromos/vista-vigencia-aerodromos/vista-vigencia-aerodromos.component';
import { ListadoUsuariosComponent } from './pagina-consultor/paginas/listado-usuarios/listado-usuarios.component';



const routes: Routes = [
  {
    path: 'administrar',
    component: PlantillaComponent,
    canActivate: [AutenticacionGuard],
    children: [
      {
        path: 'inicio',
        component: PaginaInformacionGeneralVigiladoComponent
      },
      {
        path: 'soporte',
        component: PaginaSoporteComponent
      },
      {
        path: 'responder-soporte/:idSoporte',
        component: PaginaResponderSoporteComponent
      },
      {
        path: 'soportes',
        component: PaginaSoportesComponent
      },
      {
        path: 'puertos',
        component: VistaVigenciaEjecucionComponent
      },
      {
        path: 'formulario-puertos',
        component: PaginaEjecucionComponent
      },
      {
        path: 'transito',
        component: VistaVigenciaTransitoComponent
      },
      {
        path: 'formulario-transito',
        component: TransitoComponent
      },
      {
        path: 'concesiones',
        component: VistaVigenciaAereosComponent/* AereosComponent */
      },
      {
        path: 'formulario-concesiones',
        component:  AereosComponent
      },
      {
        path: 'aerodromos',
        component: VistaVigenciaAerodromosComponent
      },
      {
        path: 'formulario-aerodromos',
        component: AerodromosComponent
      },
      {
        path: 'consultor/:formularioId',
        component: ListadoUsuariosComponent
      },
      /* {
        path: 'consultor',
        component: ListadoUsuariosComponent
      }, */
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
      },

    ]
  },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent
  },
  {
    path: 'actualizar-contrasena',
    component: ActualizarContrasenaComponent
  },
  {
    path: 'soporte',
    component: SoporteAccesoComponent
  },
  {
    path: 'verificar-subjetivo',
    component: VerificarSubjetivoComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'inicio-sesion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
