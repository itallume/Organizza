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

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      
      this.errorMessage = null; // Limpa erros anteriores
      
      this.userService.login(email, password)
        .subscribe({
          next: (res: User) => {
            if (res && res.id) {
              this.router.navigate(['home']);
            } else {
              this.errorMessage = 'Usuário não encontrado ou credenciais inválidas.';
            }
          },
          error: (err) => {
            this.errorMessage = 'Erro ao fazer login:' + err;
          }
        });
    }
  }
}
