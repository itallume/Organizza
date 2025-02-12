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

      this.userService.login(email, password)
        .subscribe({
          next: (res: User | null) => {
            if (res && res.id) { // Verifica se o usuário foi retornado e possui um ID válido
              this.router.navigate(['home']);
            } else {
              // Opcional: Exibir uma mensagem de erro ao usuário
              console.error('Usuário não encontrado ou inválido.');
            }
          },
          error: (err) => {
            console.error('Erro ao fazer login:', err);
            // Opcional: Exibir uma mensagem de erro ao usuário
          }
        });
    }
  }
}
