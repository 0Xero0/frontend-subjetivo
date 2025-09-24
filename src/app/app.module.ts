import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministradorModule } from './administrador/administrador.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorAutorizacion } from './administrador/interceptores/InterceptorAutorizacion';
import { LoadingOverlayComponent } from './compartido/loading/loading-overlay.component';
import { LoadingInterceptor } from './compartido/loading/loading.interceptor';
import { AlertasModule } from './alertas/alertas.module';
import { InputsModule } from './inputs/inputs.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { FormulariosModule } from './formularios/formularios.module';
import { EjecucionModule } from './ejecucion/ejecucion.module';
import { TarifasModule } from './tarifas/tarifas.module';
import { FormsModule } from '@angular/forms';
import { TemplatesModule } from "./templates/templates.module";
import { VerificarSubjetivoModule } from './verificar-subjetivo/verificar-subjetivo.module';
import { PaginaConsultorModule } from './pagina-consultor/pagina-consultor.module';


@NgModule({
    declarations: [
        AppComponent,
        LoadingOverlayComponent,
    ],
    exports: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorAutorizacion,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        AdministradorModule,
        AutenticacionModule,
        AsignacionesModule,
        TarifasModule,
        FormulariosModule,
        EjecucionModule,
        AlertasModule,
        InputsModule,
        SweetAlert2Module.forRoot(),
        FormsModule,
        TemplatesModule,
        VerificarSubjetivoModule,
        PaginaConsultorModule
    ]
})
export class AppModule { }
