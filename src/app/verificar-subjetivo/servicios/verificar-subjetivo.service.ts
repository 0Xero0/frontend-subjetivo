import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VerificarSubjetivoService {
  private urlBackend: string
  headers: HttpHeaders;

  constructor(private clientHttp:HttpClient) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    })
  }

  public verificar(documento:any){
    const endpoint = `/api/v1/autenticacion/verificar-subjetivo?nit=${documento}`
    return this.clientHttp.get<any>(`${this.urlBackend}${endpoint}`)
  }
}