import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoUsuariosComponent } from './paginas/listado-usuarios/listado-usuarios.component';
import { InputsModule } from '../inputs/inputs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    ListadoUsuariosComponent
  ],
  imports: [
    CommonModule,
    InputsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PipesModule
  ],
  exports: [
    ListadoUsuariosComponent
  ]
})
export class PaginaConsultorModule { }
