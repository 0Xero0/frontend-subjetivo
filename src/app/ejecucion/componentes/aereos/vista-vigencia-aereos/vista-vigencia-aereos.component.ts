import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { Rol, Formulario } from 'src/app/autenticacion/modelos/Rol';
import { RegistroVigencia } from 'src/app/ejecucion/modelos/vigencia';
import { ServicioEjecucion } from 'src/app/ejecucion/servicios/ejecucion.service';

@Component({
  selector: 'app-vista-vigencia-aereos',
  templateUrl: './vista-vigencia-aereos.component.html',
  styleUrls: ['./vista-vigencia-aereos.component.css']
})
export class VistaVigenciaAereosComponent implements OnInit{

  usuario: Usuario | null = null; // Para almacenar el usuario autenticado
  rol: Rol | null = null;
  formularios: Formulario[] | [] = [];

  registros: RegistroVigencia[] = []

  tipo: number = 1; // 1: Concesiones, 2: Tránsito, 3: Puertos, 4: Aerodromos
  vigencia?: number
  formularioId?: any
  nitVigilado?: string
  nombreVigilado?: string
  constructor(
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioEjecucion: ServicioEjecucion, // Asegúrate de importar el servicio correcto
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.usuario = servicioLocalStorage.obtenerUsuario()
    this.rol = servicioLocalStorage.obtenerRol();
    this.formularios = this.servicioLocalStorage.obtenerFormularios();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.vigencia = params['vigencia'] || null;
      this.formularioId = params['formularioId'] || null;
      this.nitVigilado = params['nit'] || this.usuario?.usuario || null;
      this.nombreVigilado = params['nombre'] || null;
    });
    console.log('Parametros: ',this.vigencia, this.formularioId, this.nitVigilado, this.nombreVigilado);
    this.obtenerRegistros();
  }

  obtenerRegistros() {
    // Aquí podrías cargar los registros desde un servicio

    this.servicioEjecucion.obtenerVigencias(8, this.nitVigilado).subscribe(
      (response: any) => {
        this.registros = response.data;
      },
      (error: any) => {
        console.error('Error al obtener las vigencias:', error);
      }
    );
  }

  mostrarTitulo(): string {
    if (this.formularioId) {
      const formulario = (this.formularios || []).find((f: any) => f?.id === this.formularioId || String(f?.id) === String(this.formularioId))
      if (formulario?.delegatura) return formulario.delegatura
    }
    const mapa: Record<string, string> = {
      '7': 'Puertos',
      '8': 'Concesiones',
      '9': 'Tránsito',
      '553': 'Aeródromos'
    }
    const id = this.formularioId != null ? String(this.formularioId) : ''
    return mapa[id] || 'Concesiones'
  }

  volverAVigencias(): void {
    if (this.rol && (this.rol.id === '001' || this.rol.id === '009')) {
      this.router.navigate(['/administrar/consultor/8']);
    } else {
      this.router.navigate(['/administrar/concesiones']);
    }
  }
}
