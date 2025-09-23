import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { Formulario, Rol } from 'src/app/autenticacion/modelos/Rol';
import { ServiciosConsultorService } from '../../servicios/servicios-consultor.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent implements OnInit {
  usuario: Usuario | null
  rol: Rol | null
  formularios: Formulario[] | []

  vigilados?: Array<any> = []
  vigiladosFiltrados: Array<any> = []
  formularioId?: any
  termino: string = ""
  reportes: any[] = []

  // Paginación (front)
  totalRegistros: number = 0
  registrosPorPagina: number = 5
  paginaActual: number = 1

  constructor(
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioConsultor: ServiciosConsultorService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.rol = this.servicioLocalStorage.obtenerRol()
    this.formularios = this.servicioLocalStorage.obtenerFormularios()
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.formularioId = Number(params['formularioId'])
        // Cargar datos al entrar a la pantalla
        this.obtenerVigilados()
      }
    });
  }

  obtenerVigilados() {
    if (this.formularioId) {
      this.servicioConsultor.obtenerVigilados(this.formularioId).subscribe({
        next: (respuesta) => {
          this.vigilados = respuesta.vigilados
          this.vigiladosFiltrados = respuesta.vigilados
          this.totalRegistros = this.vigiladosFiltrados.length
          this.paginaActual = 1
          this.actualizarPagina()
        },
        error: (error) => {
          console.error('Error al obtener vigilados:', error);
        }
      })
    }
  }

  mostrarTitulo(): string {
    if (this.formularioId) {
      const formulario = this.formularios.find(f => f.id === this.formularioId)
      return formulario ? formulario.delegatura : 'Listado de usuarios'
    }
    return 'Listado de usuarios'
  }


  actualizarFiltros() {
    const termino = (this.termino || '').toString().trim().toLowerCase()

    if (!termino) {
      this.vigiladosFiltrados = [...(this.vigilados || [])]
    } else {
      const fuente = this.vigilados || []
      this.vigiladosFiltrados = fuente.filter((r: any) => {
        const campos = [
          r?.numeroReporte,
          r?.encuesta,
          r?.descripcion,
          r?.clasificacion,
          r?.fechaInicio,
          r?.fechaFinal,
          r?.fechaEnvioST,
          r?.razonSocial,
          r?.nit,
          r?.email,
          r?.vigencia,
          r?.estado,
        ]
        return campos.some(v => (v ?? '').toString().toLowerCase().includes(termino))
      })
    }

    this.totalRegistros = this.vigiladosFiltrados.length
    this.paginaActual = 1
    this.actualizarPagina()
  }

  limpiarFiltros() {
    this.termino = '';
    this.actualizarFiltros()
  }

  paginaSeleccionada(pagina: any) {
    const num = Number(pagina?.pagina ?? pagina)
    this.paginaActual = isNaN(num) ? 1 : num
    this.actualizarPagina()
  }

  private actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina
    const fin = inicio + this.registrosPorPagina
    this.reportes = this.vigiladosFiltrados.slice(inicio, fin)
  }

  irAlFormulario(reporte: any) {
    // Prefer the formularioId from current route; fallback to possible fields in reporte
    const formularioId = this.formularioId ?? reporte?.idFormulario ?? reporte?.formularioId
    const ruta = this.obtenerRutaFormulario(formularioId)
    if (!ruta) {
      console.warn('No se pudo determinar la ruta para el formularioId:', formularioId)
      return
    }

    const nit = reporte?.nit ?? reporte?.NIT ?? reporte?.Nit
    const nombre = reporte?.nombre ?? reporte?.Nombre ?? reporte?.Nombre
    this.router.navigate(['/administrar', ruta], {
      queryParams: {
        nit,
        nombre,
        formularioId
      }
    })
  }

  private obtenerRutaFormulario(formularioId: number | string | undefined): string | null {
    if (formularioId === undefined || formularioId === null) return null
    const id = String(formularioId)
    // Mapa de ids de formulario a rutas. Ajustar si los ids difieren.
    const mapa: Record<string, 'puertos' | 'transito' | 'concesiones' | 'aerodromos'> = {
      '7': 'puertos',
      '8': 'concesiones',
      '9': 'transito',
      '553': 'aerodromos'
    }
    return mapa[id] ?? null
  }
}
