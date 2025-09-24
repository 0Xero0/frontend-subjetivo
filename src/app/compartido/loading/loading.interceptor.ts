import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { environment } from 'src/environments/environment';

/**
 * Interceptor to show a global loading indicator while file downloads are in progress.
 * We detect download requests by matching known endpoints used in ServicioArchivos.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const archivosBase = `${environment.urlBackendArchivos}/api/v1/archivos?`;
    const coreBase = `${environment.urlBackend}/api/v1/`;
    const archivosToken = `Bearer ${environment.tokenBackendArchivos}`;

    const isServicioArchivosAuth = req.headers.get('Authorization') === archivosToken;
    const isGet = req.method.toUpperCase() === 'GET';
    const isDescargarArchivo = isGet && isServicioArchivosAuth && req.url.startsWith(archivosBase);
    const isDescargarArchivoUrl = isGet && isServicioArchivosAuth && req.url.startsWith(coreBase);
    const isDownload = isDescargarArchivo || isDescargarArchivoUrl;

    if (!isDownload) {
      return next.handle(req);
    }

    this.loading.start();
    return next.handle(req).pipe(
      finalize(() => this.loading.stop())
    );
  }
}
