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
  private URL_ACTIVITIES = environment.URL_ACTIVITIES_JSON_SERVER;
  public activities: Activity[] = [];

  constructor(private http: HttpClient, private userService:UserServiceIF) {
    this.selectedDate = new Date();
  }

  register(activity: Activity): Observable<Activity> {
    const date = new Date(activity.date);
    // Formatação garantindo dia/mês/ano local e evitando problemas de fuso horário
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const activityJson = {
      "userID": this.userService.getCurrentUser().id,
      "title": activity.title,
      "description": activity.description,
      "date": formattedDate,
      "hour": activity.hour,
      "address": activity.address,
      "clientNumber": activity.clientNumber,
      "clientName": activity.clientName,
      "price": activity.price,
      "pricePayed": activity.pricePayed,
      "done": activity.done,
      "paied": activity.paied,
    }
    return this.http.post<Activity>(this.URL_ACTIVITIES, activityJson);

  }

  updateActivities() {
    this.getActivityPerDay(this.userService.getCurrentUser().id!).subscribe((activities) => {
      this.activities = activities.sort((a, b) => a.date.getTime() - b.date.getTime());
    });
  }

  getActivityPerDay(userID:string): Observable<Activity[]> {
    const date = new Date(this.selectedDate);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    return this.http.get<Activity[]>(
      `${this.URL_ACTIVITIES}?userID=${userID}&date=${formattedDate}`).pipe(
      map(activities => activities.map(activity => {
        // Cria a data preservando o dia correto
        // Assumindo que activity.date é uma string no formato YYYY-MM-DD
        const dateStr = activity.date.toString(); // Converte para string se ainda não for
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(5, 7)) - 1;
        const day = parseInt(dateStr.substring(8, 10));
        const correctDate = new Date(year, month, day);
        
        return new Activity(
          activity.id,
          activity.userID,
          activity.title,
          activity.description,
          correctDate,
          activity.hour,
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

  update(id: string, activity: Activity): Observable<any> {
    const date = new Date(activity.date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const activityJson = {
      "userID": this.userService.getCurrentUser().id,
      "title": activity.title,
      "description": activity.description,
      "date": formattedDate,
      "hour": activity.hour,
      "address": activity.address,
      "clientNumber": activity.clientNumber,
      "clientName": activity.clientName,
      "price": activity.price,
      "pricePayed": activity.pricePayed,
      "done": activity.done,
      "paied": activity.paied,
    }
    return this.http.put(`${this.URL_ACTIVITIES}/${id}`,activityJson);
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.URL_ACTIVITIES}/${id}`);
  }

  getReportPerMonth(): Observable<Blob | string> {
    const date = new Date(this.selectedDate);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    return this.http.get(
      `${this.URL_ACTIVITIES}/report?userID=${this.userService.getCurrentUser().id}&date=${formattedDate}`, {
        responseType: 'blob',
        observe: 'response'
      }).pipe(
      map(response => {
        if (response.body instanceof Blob) {
          return response.body;
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
