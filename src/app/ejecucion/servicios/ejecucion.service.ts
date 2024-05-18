import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { FormularioEjecucion } from '../modelos/FormularioEjecucion';
import { ResumenReporte } from 'src/app/encuestas/modelos/ResumenReporte';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { RespuestaActividad } from '../modelos/RespuestaActividad';
import { RespuestaAdicional } from '../modelos/RespuestaAdicional';
import { Observable } from 'rxjs';
import { Mes } from 'src/app/encuestas/modelos/Mes';
import { FiltrosReportes } from 'src/app/encuestas/modelos/FiltrosReportes';
import { ListaEmpresasEjecucion } from '../modelos/ListaEmpresasEjecucion';
import { ListaPatiosEjecucion } from '../modelos/ListaPatiosEjecucion';
import { TipoImportacion } from '../TipoImportacion';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';

@Injectable({
  providedIn: 'root'
})
export class ServicioEjecucion extends Autenticable {

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  obtenerPortuarias(){
    const endpoint = `/api/v1/portuarias`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerTransporte(){
    const endpoint = `/api/v1/transportes`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerTransito(){
    const endpoint = `/api/v1/transitos`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraSiNo(){
    const endpoint = `/api/v1/maestras/sino`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraSiNoAplica(){
    const endpoint = `/api/v1/maestras/sinoaplica`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraFusiones(){
    const endpoint = `/api/v1/maestras/fusiones`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraInversiones(){
    const endpoint = `/api/v1/maestras/inversiones`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraFinancierosN(){
    const endpoint = `/api/v1/maestras/financierosN`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraFinancieros(){
    const endpoint = `/api/v1/maestras/financieros`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraNits(){
    const endpoint = `/api/v1/maestras/nits`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraOrganizaciones(){
    const endpoint = `/api/v1/maestras/organizaciones`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraPeriodos(){
    const endpoint = `/api/v1/maestras/periodos`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraPorcentajes(){
    const endpoint = `/api/v1/maestras/porcentajes`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraSociedades(){
    const endpoint = `/api/v1/maestras/sociedades`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraDomicilios(){
    const endpoint = `/api/v1/maestras/domicilios`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraEquipos(){
    const endpoint = `/api/v1/maestras/equipos`
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  cargarArchivos(archivo: File, extension:string){
    //console.log(archivo, extension);
    const endpoint = `/api/v1/archivos`
    const formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('extension',extension)
    return this.http.post<ArchivoGuardado>(
      `${this.host}${endpoint}`,
      formData,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
    )
  }

  obtenerMaestras2(ruta:string){
    const endpoint = `/api/v1/maestras/`+ruta
    return this.http.get<any>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  guardar(portuariasJson: any){
    console.log(portuariasJson);
    const endpoint = '/api/v1/portuarias'
    return this.http.post<any>(`${this.host}${endpoint}`,portuariasJson ,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  enviarST(){
    const endpoint = '/api/v1/portuarias/enviar'
    return this.http.get<any>(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion()})
  }

  guardarTransporte(transportesJson: any){
    console.log(transportesJson);
    const endpoint = '/api/v1/transportes'
    return this.http.post<any>(`${this.host}${endpoint}`,transportesJson ,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  enviarSTTransporte(){
    const endpoint = '/api/v1/transportes/enviar'
    return this.http.get<any>(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion()})
  }

  guardarTransito(transitosJson: any){
    console.log(transitosJson);
    const endpoint = '/api/v1/transitos'
    return this.http.post<any>(`${this.host}${endpoint}`,transitosJson ,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  enviarSTTransito(){
    const endpoint = '/api/v1/transitos/enviar'
    return this.http.get<any>(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion()})
  }

}
