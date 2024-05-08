import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioEjecucionComponent } from './componentes/formulario-ejecucion/formulario-ejecucion.component';
import { PaginaEjecucionComponent } from './paginas/pagina-ejecucion/pagina-ejecucion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { ActividadFormEjecComponent } from './componentes/actividad-form-ejec/actividad-form-ejec.component';
import { AdicionalFormEjecComponent } from './componentes/adicional-form-ejec/adicional-form-ejec.component';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { InformacionGeneralModule } from '../informacion-general/informacion-general.module';



@NgModule({
  declarations: [
    FormularioEjecucionComponent,
    PaginaEjecucionComponent,
    ActividadFormEjecComponent,
    AdicionalFormEjecComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AlertasModule,
    InputsModule,
    InformacionGeneralModule,
    PipesModule,
    RouterModule
  ]
})
export class EjecucionModule { }
