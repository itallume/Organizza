import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/compat/firestore';
import {User} from '../model/user';
import {from, map, Observable, switchMap} from 'rxjs';
import {UserServiceIF} from './user-serviceIF';


@Injectable({
  providedIn: 'root'
})
export class UserFirestoreService implements UserServiceIF {


  private injetor = inject(Injector);
  private userCollection: AngularFirestoreCollection<User>;
  private currentUser: User;
  NOME_COLECAO = 'users';

  constructor(private firestore: AngularFirestore) {
    this.currentUser = new User('','','');
    this.userCollection = this.firestore.collection(this.NOME_COLECAO);
    runInInjectionContext(this.injetor, () => {
      this.userCollection = this.firestore.collection(this.NOME_COLECAO);
    })
  }

  getUsers(): Observable<User[]> {
    return runInInjectionContext(this.injetor, () => {
      return this.userCollection.valueChanges({idField: 'id'});
    })
  }
  createUser(user: User): Observable<User> {
      delete user.id;
      return from(this.userCollection.add({...user})).pipe(
        switchMap((docRef:DocumentReference<User>) => docRef.get()),
        map(doc => ({id: doc.id, ...doc.data()} as User))
      );
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

  // getUserById(newId: string): Observable<User> {
  //   return runInInjectionContext(this.injetor, () => {
  //     return this.userCollection.doc(newId).get().pipe(map(document =>
  //       const data = document.data();
  //       return new User(data.name, data.email, data.password, newId) ));
  //   });
  // }

  // pesquisarPorId(idEdicao: string): Observable<Aluno> {
  //   return runInInjectionContext(this.injetor, () => {
  //     return this.colecaoAlunos.doc(idEdicao).get().pipe(map(document =>
  //       new Aluno(idEdicao, document.data())));
  //   });
  // }

  // deleteUser(id: string): Observable<void> {
  //   return undefined;
  // }

}
