import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';

@Injectable({
  providedIn: 'root'
})
export class ServiciosConsultorService extends Autenticable {
  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super();
   }

  obtenerVigilados(formularioId: number){
    const endpoint = `/api/v1/maestras/vigilados?formularioId=${formularioId}`;
    return this.http.get<any>(
      `${this.host}${endpoint}`,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
    );
  }
}
