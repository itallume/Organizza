import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../model/user';
import {map, Observable, tap} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL_USERS = 'http://localhost:3000/users';

  private currentUser: User;

  constructor(private http: HttpClient) {
      this.currentUser = new User('','','');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.URL_USERS);
  }

  getUserById(id: string):Observable<User> {
    return this.http.get<User>(`${this.URL_USERS}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.URL_USERS, user);
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(user: User): void{
    this.currentUser  = user;
  }

  isLoggedIn() {
    return this.currentUser.id !== '';
  }
}
