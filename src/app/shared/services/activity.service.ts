import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {Activity} from '../model/activity';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  public selectedDate:Date;
  private URL_ACTIVITIES = 'http://localhost:3000/activities';
  public activities: Activity[] = [];

  constructor(private http: HttpClient, private userService: UserService) {
    this.selectedDate = new Date();

   }

  register(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.URL_ACTIVITIES, activity);

  }
  updateActivities() {
    this.getActivityPerDay(this.userService.getCurrentUser().id).subscribe((activities) => {
      this.activities = activities;
      console.log(this.activities); // Aqui você pode ver se as atividades estão sendo atualizadas
    });
  }

  getActivityPerDay(userID:string): Observable<Activity[]> {
    console.log(this.selectedDate);
    console.log(userID)
    console.log(this.selectedDate.getFullYear() + '-' + (this.selectedDate.getMonth() + 1) + '-' + this.selectedDate.getDate());
    return this.http.get<Activity[]>(`${this.URL_ACTIVITIES}?userID=${userID}&date=${this.selectedDate.getFullYear() + '-' + (this.selectedDate.getMonth() + 1) + '-' + this.selectedDate.getDate()}`);

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
