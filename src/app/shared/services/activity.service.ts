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

  register(activity: Activity): Observable<Activity> {
    const activityJson = {
      "userID": this.userService.getCurrentUser().id,
      "title": activity.title,
      "description": activity.description,
      "date": new Date(activity.date).toISOString().slice(0, 10),
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

  getActivityPerDay(userID: string): Observable<Activity[]> {
    return this.http.get<any[]>(
      `${this.URL_ACTIVITIES}?userID=${userID}&date=${new Date(this.selectedDate).toLocaleDateString('en-CA')}`
    ).pipe(
      map(activities => activities.map(activity => {
        // Dividir a string da data e criar Date localmente
        const dateParts = activity.date.split('-').map((part: string) => parseInt(part, 10));
        const activityDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        return new Activity(
          activity.id,
          activity.userID,
          activity.title,
          activity.description,
          activityDate,
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

  update(activity: Activity): Observable<any> {
    const year = activity.date.getFullYear();
    const month = (activity.date.getMonth() + 1).toString().padStart(2, '0');
    const day = activity.date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const activityJson = {
      "id": activity.id,
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
