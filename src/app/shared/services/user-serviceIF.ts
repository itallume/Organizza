import {User} from '../model/user';
import {Observable} from "rxjs";


export abstract class UserServiceIF {

  abstract createUser(user: User): Observable<User>;

  abstract getUsers(): Observable<User[]>;

  abstract getCurrentUser(): User;

  abstract setCurrentUser(user: User): void;

  abstract isLoggedIn(): boolean;

  abstract login(email:string, password:string): Observable<User | null>;

}
