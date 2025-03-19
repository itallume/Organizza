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

  getActivityPerDay(userID:string): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `${this.URL_ACTIVITIES}?userID=${userID}&date=${new Date(this.selectedDate).toISOString().slice(0, 10)}`).pipe(
      map(activities => activities.map(activity =>
        new Activity(
          activity.id,
          activity.userID,
          activity.title,
          activity.description,
          new Date(activity.date),
          activity.hour,
          activity.address,
          activity.clientNumber,
          activity.clientName,
          activity.price,
          activity.pricePayed,
          activity.done,
          activity.paied
        )
      ))
    );
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.URL_ACTIVITIES}/${id}`);
  }

  pesquisarPorId(idEdicao: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.URL_ACTIVITIES}/${idEdicao}`);
  }

  atualizar(activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.URL_ACTIVITIES}/${activity.id}`, activity);
  }
}
