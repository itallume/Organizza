import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../model/Activity';
@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private URL_ACTIVITIES = 'http://localhost:3000/activity';

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
}
