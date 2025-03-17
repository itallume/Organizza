import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';
import {User} from '../../shared/model/user';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  hidePw = true;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value.trim().toLowerCase();
      const password = this.loginForm.get('password')?.value;
      this.userService.getUsers().subscribe({
        next: (users) => {
          const foundUser = users.find((user: any) => 
            user.email.toLowerCase() === email && 
            user.password === password
          );
          console.log(foundUser)
          if (foundUser) {
            this.userService.setCurrentUser(foundUser);
            this.router.navigate(['home']);
          } else {
            this.errorMessage = 'Credenciais incorretas';
          }
        },
        error: (error) => {
          console.error('Erro:', error);
          this.errorMessage = 'Erro ao conectar ao servidor';
        }
      });
    }
  }
}
