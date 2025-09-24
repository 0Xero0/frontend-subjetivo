import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroVigencia } from '../modelos/vigencia';

@Component({
  selector: 'app-vigencias',
  templateUrl: './vigencias.component.html',
  styleUrls: ['./vigencias.component.css']
})
export class VigenciasComponent implements OnInit {

  @Input() tipo?: number; // 1: Concesiones, 2: Tránsito, 3: Puertos, 4: Aerodromos
  @Input() nitVigilado?: string;
  @Input() nombreVigilado?: string;

  @Input() registros: RegistroVigencia[] = []

  itemPorPagina: number = 5; // Número de registros por página
  pagina: number = 1; // Página actual

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Aquí podrías cargar los registros desde un servicio
  }

  redirigir(registro: RegistroVigencia): void {
    // Aquí puedes implementar la lógica para redirigir a la página de detalles del registro
    /* console.log('Redirigiendo al registro:', registro);
    console.log('Tipo de vigencia:', this.tipo); */
    if (this.tipo === 1) {
      /* console.log('Redirigiendo a formulario de concesiones'); */
      this.router.navigate(['/administrar/formulario-concesiones'], { queryParams: { vigencia: registro.vigencia, nit: this.nitVigilado, nombre: this.nombreVigilado }});
    } else if (this.tipo === 2) {
      this.router.navigate(['/administrar/formulario-transito'], { queryParams: { vigencia: registro.vigencia, nit: this.nitVigilado, nombre: this.nombreVigilado }});
    } else if (this.tipo === 3) {
      this.router.navigate(['/administrar/formulario-puertos'], { queryParams: { vigencia: registro.vigencia, nit: this.nitVigilado, nombre: this.nombreVigilado }});
    } else {
      this.router.navigate(['/administrar/formulario-aerodromos'], { queryParams: { vigencia: registro.vigencia, nit: this.nitVigilado, nombre: this.nombreVigilado }});
    }
  }

}
