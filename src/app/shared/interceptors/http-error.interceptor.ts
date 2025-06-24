import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adiciona headers padrão
    const modifiedReq = req.clone({
      headers: req.headers
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    });

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        if (error.error instanceof ErrorEvent) {
          // Erro do lado do cliente
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          // Erro do lado do servidor
          switch (error.status) {
            case 400:
              errorMessage = 'Dados inválidos fornecidos.';
              break;
            case 401:
              errorMessage = 'Email ou senha incorretos.';
              break;
            case 404:
              errorMessage = 'Usuário não encontrado.';
              break;
            case 409:
              errorMessage = 'Email já está em uso.';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor.';
              break;
            default:
              errorMessage = error.error?.message || `Erro: ${error.status} - ${error.message}`;
          }
        }
        
        return throwError(() => errorMessage);
      })
    );
  }
}
