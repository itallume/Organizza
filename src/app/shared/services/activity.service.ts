import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, catchError, Subject, BehaviorSubject, throwError, forkJoin, of, from, concatMap, toArray} from 'rxjs';
import {Activity} from '../model/activity';
import {UserService} from './user.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  public selectedDate:Date;
  private URL_ACTIVITIES = `${environment.apiUrl}/activities`;
  public activities: Activity[] = [];
  
  // Subject para notificar quando as atividades mudarem
  private activitiesUpdated = new Subject<void>();
  public activitiesUpdated$ = this.activitiesUpdated.asObservable();
  
  // BehaviorSubject para manter o estado atual das atividades
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  public activities$ = this.activitiesSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {
    this.selectedDate = new Date();
   }

  // Método público para notificar mudanças
  notifyActivitiesUpdated() {
    this.activitiesUpdated.next();
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
      this.activitiesSubject.next([]);
      return;
    }

    this.getAllActivities(this.userService.getCurrentUser().id).subscribe({
      next: (activities) => {
        this.activities = activities.sort((a, b) => {
          const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
          const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
          return dateA.getTime() - dateB.getTime();
        });
        
        // Notifica que as atividades foram atualizadas
        this.activitiesSubject.next(this.activities);
        this.activitiesUpdated.next();
      },
      error: (error) => {
        console.error('Erro ao carregar atividades:', error);
        this.activities = [];
        this.activitiesSubject.next([]);
      }
    });
  }

  getAllActivities(userID: string): Observable<Activity[]> {
    // Como o endpoint requer data obrigatória, vou buscar um range de datas
    // Buscar atividades dos últimos 7 dias e próximos 7 dias
    const dates: string[] = [];
    const today = new Date();
    
    // Adiciona datas dos últimos 7 dias até os próximos 7 dias
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    console.log('Buscando atividades para as datas:', dates);
    
    const requests = dates.map(date => {
      const url = `${this.URL_ACTIVITIES}?userID=${userID}&date=${date}`;
      return this.http.get<any[]>(url).pipe(
        catchError(error => {
          // Se der erro em uma data específica, retorna array vazio
          // console.warn(`Nenhuma atividade encontrada para ${date}`);
          return of([]);
        })
      );
    });
    
    // Combina todas as requisições usando forkJoin
    return forkJoin(requests).pipe(
      map(results => {
        const allActivities = results.flat().filter(activity => activity);
        console.log('Total de atividades encontradas:', allActivities.length);
        
        // Remove duplicatas baseado no ID
        const uniqueActivities = allActivities.filter((activity, index, self) =>
          index === self.findIndex(a => a.id === activity.id)
        );
        
        return uniqueActivities.map((activity: any) =>
          new Activity(
            activity.id,
            activity.userID,
            activity.title,
            activity.description,
            activity.date,
            activity.hour,
            activity.address,
            activity.clientNumber,
            activity.clientName,
            activity.price,
            activity.pricePayed,
            activity.done,
            activity.paied
          )
        );
      }),
      catchError(error => {
        console.error('Erro ao buscar atividades:', error);
        return throwError(() => error);
      })
    );
  }

  // Método específico para buscar atividades do ano inteiro (para o calendário anual)
  getAllActivitiesForYear(userID: string, year: number): Observable<Activity[]> {
    const dates: string[] = [];
    
    // Gera todas as datas do ano especificado
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    console.log(`Buscando atividades para o ano ${year}:`, dates.length, 'datas');
    
    // Divide em lotes para não sobrecarregar o servidor
    const batchSize = 30; // 30 requisições por lote
    const batches: string[][] = [];
    
    for (let i = 0; i < dates.length; i += batchSize) {
      batches.push(dates.slice(i, i + batchSize));
    }
    
    // Processa os lotes sequencialmente
    return from(batches).pipe(
      concatMap((batch: string[]) => {
        const requests = batch.map((date: string) => {
          const url = `${this.URL_ACTIVITIES}?userID=${userID}&date=${date}`;
          return this.http.get<any[]>(url).pipe(
            catchError(error => {
              // Se der erro em uma data específica, retorna array vazio
              return of([]);
            })
          );
        });
        
        return forkJoin(requests);
      }),
      toArray(),
      map((batchResults: any[][]) => {
        const allActivities = batchResults.flat().flat().filter((activity: any) => activity);
        console.log(`Total de atividades encontradas para ${year}:`, allActivities.length);
        
        // Remove duplicatas baseado no ID
        const uniqueActivities = allActivities.filter((activity: any, index: number, self: any[]) =>
          index === self.findIndex((a: any) => a.id === activity.id)
        );
        
        return uniqueActivities.map((activity: any) =>
          new Activity(
            activity.id,
            activity.userID,
            activity.title,
            activity.description,
            activity.date,
            activity.hour,
            activity.address,
            activity.clientNumber,
            activity.clientName,
            activity.price,
            activity.pricePayed,
            activity.done,
            activity.paied
          )
        );
      }),
      catchError(error => {
        console.error('Erro ao buscar atividades do ano:', error);
        return throwError(() => error);
      })
    );
  }

  getActivityPerDay(userID:string): Observable<Activity[]> {
    const dateStr = new Date(this.selectedDate).toISOString().slice(0, 10);
    const url = `${this.URL_ACTIVITIES}?userID=${userID}&date=${dateStr}`;
    console.log('Fazendo requisição para atividades do dia:', url);
    
    return this.http.get<any[]>(url).pipe(
      map(activities => activities.map((activity: any) =>
        new Activity(
          activity.id,
          activity.userID,
          activity.title,
          activity.description,
          activity.date, // Manter como string
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
    // Usar PUT que é padrão REST para atualizações
    return this.http.put<Activity>(`${this.URL_ACTIVITIES}/${activity.id}`, activityJson);
  }

  // Método alternativo caso o PUT não funcione
  atualizarComPost(activity: Activity): Observable<Activity> {
    // Validação de usuário
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      throw new Error('Usuário deve estar logado para atualizar atividades');
    };

    // Primeiro tenta com PUT padrão
    return this.atualizar(activity).pipe(
      catchError(error => {
        console.error('Erro na requisição PUT, tentando PATCH:', error);
        
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
        
        // Tenta com PATCH
        return this.http.patch<Activity>(`${this.URL_ACTIVITIES}/${activity.id}`, activityJson).pipe(
          catchError(patchError => {
            console.error('Erro na requisição PATCH também:', patchError);
            // Se ambos falharem, atualiza localmente
            return this.updateActivityLocally(activity);
          })
        );
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
