import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, from, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {Activity} from '../model/activity';
import {UserServiceIF} from './user-serviceIF';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  public selectedDate:Date;
  private URL_ACTIVITIES = environment.URL_ACTIVITIES_SPRING;
  public activities: Activity[] = [];

  constructor(private http: HttpClient, private userService:UserServiceIF) {
    this.selectedDate = new Date();
  }



  updateActivities() {
    this.getActivityPerDay(this.userService.getCurrentUser().id!).subscribe((activities) => {
      this.activities = activities.sort((a, b) => a.date.getTime() - b.date.getTime());
    });
  }

  // Método auxiliar para formatação de data (padrão único)
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

// Método auxiliar para criar Date local
  private parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Cria data sem fuso horário
  }

  register(activity: Activity): Observable<Activity> {
    const activityJson = {
      "userID": this.userService.getCurrentUser().id,
      "title": activity.title,
      "description": activity.description,
      "date": this.formatDate(activity.date), // Formatação padronizada
      "hour": activity.hour || '00:00', // Hora default
      "address": activity.address,
      "clientNumber": activity.clientNumber,
      "clientName": activity.clientName,
      "price": activity.price,
      "pricePayed": activity.pricePayed,
      "done": activity.done,
      "paied": activity.paied,
    };
    return this.http.post<Activity>(this.URL_ACTIVITIES, activityJson);
  }

  getActivityPerDay(userID: string): Observable<Activity[]> {
    const formattedDate = this.formatDate(new Date(this.selectedDate));

    return this.http.get<any[]>(
      `${this.URL_ACTIVITIES}?userID=${userID}&date=${formattedDate}`
    ).pipe(
      map(activities => activities.map(activity => {
        return new Activity(
          activity.id,
          activity.userID,
          activity.title,
          activity.description,
          this.parseDate(activity.date), // Parse padronizado
          activity.hour || '00:00', // Hora default
          activity.address,
          activity.clientNumber,
          activity.clientName,
          activity.price,
          activity.pricePayed,
          activity.done,
          activity.paied
        );
      }))
    );
  }

  update(activity: Activity): Observable<any> {
    const activityJson = {
      "id": activity.id,
      "userID": this.userService.getCurrentUser().id,
      "title": activity.title,
      "description": activity.description,
      "date": this.formatDate(activity.date), // Formatação padronizada
      "hour": activity.hour || '00:00', // Hora default
      "address": activity.address,
      "clientNumber": activity.clientNumber,
      "clientName": activity.clientName,
      "price": activity.price,
      "pricePayed": activity.pricePayed,
      "done": activity.done,
      "paied": activity.paied,
    };
    return this.http.put(`${this.URL_ACTIVITIES}`, activityJson);
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.URL_ACTIVITIES}/${id}`);
  }

  getReportPerMonth(): Observable<Blob | string> {
    return this.http.get(
      `${this.URL_ACTIVITIES}/report?userID=${this.userService.getCurrentUser().id}&date=${new Date(this.selectedDate).toISOString().slice(0, 10)}`, {
        responseType: 'blob',
        observe: 'response'
      }).pipe(
      map(response => {
        if (response.body instanceof Blob) {
          return response.body; // Retorna o Blob (PDF)
        } else {
          throw new Error('Nenhuma ocorrência encontrada para o mês selecionado.');
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          return of('Nenhuma ocorrência encontrada para o mês selecionado.');
        } else {
          return of('Erro ao baixar o relatório. Tente novamente.');
        }
      })
    );
  }

  downloadReportPerMonth(): Observable<void> {
    return this.getReportPerMonth().pipe(
      tap(response => {
        if (response instanceof Blob) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'relatorio.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        } else if (typeof response === 'string') {
          alert(response);
        }
      }),
      map(() => undefined)
    );
  }

  pesquisarPorId(idEdicao: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.URL_ACTIVITIES}/${idEdicao}`);
  }

  atualizar(activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.URL_ACTIVITIES}/${activity.id}`, activity);
  }
}
