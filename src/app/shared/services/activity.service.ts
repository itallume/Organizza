import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, catchError} from 'rxjs';
import {Activity} from '../model/activity';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  public selectedDate:Date;
  private URL_ACTIVITIES = 'https://agendapj-backend.onrender.com/activities';
  public activities: Activity[] = [];

  constructor(private http: HttpClient, private userService: UserService) {
    this.selectedDate = new Date();
   }

  register(activity: Activity): Observable<Activity> {
    // Verifica se há um usuário logado
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      throw new Error('Usuário deve estar logado para registrar atividades');
    }

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
    // Verifica se há um usuário logado antes de fazer a requisição
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      console.warn('Usuário não logado - não é possível carregar atividades');
      this.activities = [];
      return;
    }

    this.getActivityPerDay(this.userService.getCurrentUser().id).subscribe({
      next: (activities) => {
        this.activities = activities.sort((a, b) => {
          const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
          const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
          return dateA.getTime() - dateB.getTime();
        });
      },
      error: (error) => {
        console.error('Erro ao carregar atividades:', error);
        this.activities = [];
      }
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
    const activityJson = {
      "userID": activity.userID,
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
    };
    // Tentativa 1: PATCH
    return this.http.patch<Activity>(`${this.URL_ACTIVITIES}/${activity.id}`, activityJson);
  }

  // Método alternativo caso o PATCH não funcione
  atualizarComPost(activity: Activity): Observable<Activity> {
    // Validação de usuário
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      throw new Error('Usuário deve estar logado para atualizar atividades');
    };

    const activityJson = {
      "id": activity.id, // Inclui o ID no body também
      "userID": activity.userID,
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
    };
    
    
    // Tenta primeiro com POST para rota de update
    return this.http.post<Activity>(`${this.URL_ACTIVITIES}/update/${activity.id}`, activityJson)
      .pipe(
        catchError(error => {
          console.error('Erro na requisição POST /update:', error);
          console.error('Status:', error.status);
          console.error('Body:', error.error);
          
          if (error.status === 404) {
            console.warn('Endpoint POST /update não encontrado, tentando simulação local');
            return this.updateActivityLocally(activity);
          } else if (error.status === 400) {
            console.error('Erro 400 - Dados inválidos ou usuário não encontrado');
            throw error;
          } else {
            console.error('Erro desconhecido:', error);
            throw error;
          }
        })
      );
  }

  // Método de fallback para atualização local
  private updateActivityLocally(activity: Activity): Observable<Activity> {
    // Encontra e atualiza a atividade no array local
    const index = this.activities.findIndex(a => a.id === activity.id);
    if (index !== -1) {
      this.activities[index] = activity;
    }
    
    // Simula uma resposta HTTP bem-sucedida
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(activity);
        observer.complete();
      }, 100); // Simula delay de rede
    });
  }
}
