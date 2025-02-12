import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from '../model/activity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private URL_ACTIVITIES = 'http://localhost:3000/activity';
  private MAIOR_IDADE = 18;

  constructor(private http: HttpClient) { }

  cadastrar(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.URL_ACTIVITIES, activity);
  }

  getActivityPerDay(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.URL_ACTIVITIES);
  }

  remover(id: string): Observable<any> {
    return this.http.delete(`${this.URL_ACTIVITIES}/${id}`);
  }

  pesquisarPorId(idEdicao: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.URL_ACTIVITIES}/${idEdicao}`);
  }

  atualizar(activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.URL_ACTIVITIES}/${activity.id}`, activity);
  }

  maioresDeIdade(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.URL_ACTIVITIES}?idade_gte=${this.MAIOR_IDADE}`);
  }
}
