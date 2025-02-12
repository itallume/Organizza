import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Activity} from '../model/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  public selectedDate:Date;
  private URL_ACTIVITIES = 'http://localhost:3000/activities';

  constructor(private http: HttpClient) {
    this.selectedDate = new Date();
   }

  register(activity: Activity): Observable<Activity> {
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
