import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { UserRequestDTO, UserResponseDTO, UserLoginRequestDTO } from '../model/user-dto';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL_USERS = `${environment.apiUrl}/users`;

  private currentUser!: User;

  constructor(private http: HttpClient) {
      this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.currentUser = new User(userData.id, userData.name, userData.email);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        this.currentUser = new User('', '', '', '');
      }
    } else {
      this.currentUser = new User('', '', '', '');
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }));
  }

  getUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.URL_USERS);
  }

  getUserById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.URL_USERS}/${id}`);
  }

  login(email: string, password: string): Observable<User> {
    const loginRequest: UserLoginRequestDTO = { email, password };
    return this.http.post<UserResponseDTO>(`${this.URL_USERS}/login`, loginRequest)
      .pipe(
        map(response => new User(response.id, response.name, response.email)),
        tap(user => {
          this.currentUser = user;
          this.saveUserToStorage(user);
        })
      );
  }

  register(name: string, email: string, password: string): Observable<User> {
    const userRequest: UserRequestDTO = { name, email, password };
    return this.http.post<UserResponseDTO>(`${this.URL_USERS}/create`, userRequest)
      .pipe(
        map(response => new User(response.id, response.name, response.email))
      );
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser.id !== '';
  }

  // Método de debug para verificar o localStorage
  debugLocalStorage(): void {
  }

  logout(): void {
    this.currentUser = new User('', '', '', '');
    localStorage.removeItem('currentUser');
  }
}
