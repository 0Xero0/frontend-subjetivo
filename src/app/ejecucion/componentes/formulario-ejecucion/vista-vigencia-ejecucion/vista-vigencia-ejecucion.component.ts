import { Component, OnInit } from '@angular/core';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { RegistroVigencia } from 'src/app/ejecucion/modelos/vigencia';
import { ServicioEjecucion } from 'src/app/ejecucion/servicios/ejecucion.service';

@Component({
  selector: 'app-vista-vigencia-ejecucion',
  templateUrl: './vista-vigencia-ejecucion.component.html',
  styleUrls: ['./vista-vigencia-ejecucion.component.css']
})
export class VistaVigenciaEjecucionComponent implements OnInit {
  usuario: Usuario | null = null;

  registros: RegistroVigencia[] = []

  tipo: number = 3; // 1: Concesiones, 2: Tránsito, 3: Puertos, 4: Aerodromos

  constructor(
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioEjecucion: ServicioEjecucion // Asegúrate de importar el servicio correcto
  ) {
    this.usuario = servicioLocalStorage.obtenerUsuario();
  }

  ngOnInit(): void {
    // Aquí podrías cargar los registros desde un servicio
    this.obtenerRegistros();
  }

  obtenerRegistros() {
    // Aquí podrías cargar los registros desde un servicio
    this.servicioEjecucion.obtenerVigencias(7).subscribe(
      (response: any) => {
        this.registros = response.data;
      },
      (error: any) => {
        console.error('Error al obtener las vigencias:', error);
      }
    );
  }
}
