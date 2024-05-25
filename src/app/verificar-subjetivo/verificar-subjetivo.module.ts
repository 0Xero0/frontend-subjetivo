import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { RouterModule } from '@angular/router';
import { TemplatesModule } from '../templates/templates.module';
import { VerificarSubjetivoComponent } from './verificar-subjetivo.component';

@NgModule({
  declarations: [
    VerificarSubjetivoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    InputsModule,
    SweetAlert2Module.forRoot(),
    AlertasModule,
    TemplatesModule,
    RouterModule
  ]
})
export class VerificarSubjetivoModule { }