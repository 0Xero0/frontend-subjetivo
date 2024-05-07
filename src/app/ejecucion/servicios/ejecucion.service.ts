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

@Injectable({
  providedIn: 'root'
})
export class ServicioEjecucion extends Autenticable {

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  consultarListaFormulariosEjecucion(pagina: number, limite: number, idVigilado: string, filtros?: FiltrosReportes) {
    let endpoint = `/api/v1/encuestas/listar?pagina=${pagina}&limite=${limite}&idVigilado=${idVigilado}&idEncuesta=2`
    if(filtros){
      if(filtros.termino){
        endpoint+= `&termino=${filtros.termino}` 
      }
    }
    return this.http.get<{ reportadas: ResumenReporte[], paginacion: Paginacion }>(
      `${this.host}${endpoint}`,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
    )
  }

  consultarEjecucion(idReporte: number, idVigilado: string, idMes: number, historico: boolean = false) {
    const endpoint = `/api/v1/inidicador/ejecucion?idReporte=${idReporte}&idVigilado=${idVigilado}&idMes=${idMes}&historico=${historico}`
    return this.http.get<FormularioEjecucion>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  guardarEjecucion(
    reporteId: number,
    mesId: number,
    respuestasActividades: RespuestaActividad[],
    respuestasAdicionales: RespuestaAdicional[]
  ) {
    const endpoint = '/api/v1/inidicador/respuestasEjecucion'
    return this.http.post(`${this.host}${endpoint}`, {
        reporteId,
        respuestasActividades,
        adicionales: respuestasAdicionales,
        mesId
      },
      { headers: this.obtenerCabeceraAutorizacion() })
  }

  enviarEjecucion(idReporte: number, idVigilado: string, idMes: number) {
    const endpoint = '/api/v1/inidicador/enviarEjecucion'
    return this.http.post(`${this.host}${endpoint}`, {
        idReporte,
        idVigilado,
        idMes
      },
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  obtenerMeses(historico: boolean = false):Observable<{ meses: Mes[] }>{
    let endpoint = `/api/v1/maestras/meses?historico=${historico}`
    return this.http.get<{ meses: Mes[] }>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  consultarListadoEmpresas(idVigilado: string, vigencia: number, idMes: number){
    const endpoint = `/api/v1/inidicador/empresas?idVigilado=${idVigilado}&vigencia=${vigencia}&idMes=${idMes}`
    return this.http.get<ListaEmpresasEjecucion>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  consultarListadoPatios(idVigilado: string, vigencia: number, idMes: number){
    const endpoint = `/api/v1/inidicador/patios?idVigilado=${idVigilado}&vigencia=${vigencia}&idMes=${idMes}`
    return this.http.get<ListaPatiosEjecucion>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  guardarImportacion(archivo: File, idVigilado: string, vigencia: number, mes: number, tipo: TipoImportacion){
    const endpoint = '/api/v1/inidicador/importar-excel'
    const formData = new FormData()
    formData.append('tipo', tipo.toString())
    formData.append('archivo', archivo)
    formData.append('idVigilado', idVigilado)
    formData.append('vigencia', vigencia.toString())
    formData.append('mes', mes.toString())
    return this.http.post(`${this.host}${endpoint}`, formData ,{ headers: this.obtenerCabeceraAutorizacion() })
  }
}
