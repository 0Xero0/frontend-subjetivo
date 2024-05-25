import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupComponent } from '../alertas/componentes/popup/popup.component';
import Swal from 'sweetalert2';
import { VerificarSubjetivoService } from './servicios/verificar-subjetivo.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verificar-subjetivo',
  templateUrl: './verificar-subjetivo.component.html',
  styleUrls: ['./verificar-subjetivo.component.css']
})
export class VerificarSubjetivoComponent {
  public formulario: FormGroup
  documento:string = ""

  constructor(private verificarSubjetivo: VerificarSubjetivoService, private enrutador: Router) {
    this.formulario = new FormGroup({
      documentoId: new FormControl('', [Validators.required])
    })
  }

  verificar(){
    if (this.formulario.invalid) {
      this.marcarFormularioComoSucio()
      return;
    }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.verificarSubjetivo.verificar(
      this.formulario.controls['documentoId'].value.toString()
    ).subscribe({
      next: (respuesta:any) => {
        if(respuesta){
          if(respuesta.estado){
            Swal.fire({
              titleText:respuesta.mensaje,
              icon:'success',
              confirmButtonText:'Ir a inicio de sesión',
              showCancelButton:true,
              cancelButtonText:'Cancelar'
            }).then((result) => {
              if(result.isConfirmed){
                this.enrutador.navigateByUrl('/inicio-sesion')
              }
            })
          }else{
            Swal.fire({
              titleText:respuesta.mensaje,
              icon:'error'
            })
          }
          
        }
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          titleText: '¡Ha ocurrido un error!',
          text: error.error,
          icon:'error'
        })
      }
    })
  }

  marcarFormularioComoSucio(): void {
    (<any>Object).values(this.formulario.controls).forEach((control: FormControl) => {
      control.markAsDirty();
      if (control) {
        control.markAsDirty()
      }
    });
  }
}
