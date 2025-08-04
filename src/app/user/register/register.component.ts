import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../shared/model/user';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  hidePw = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
      ]]
    })
  }

  onSubmit(): void {
    if(this.registerForm.valid) {
      const name = this.registerForm.get('name')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      
      this.errorMessage = null; // Limpa erros anteriores
      this.successMessage = null; // Limpa mensagens de sucesso anteriores
      
      this.userService.register(name, email, password)
        .subscribe({
          next: (res) => {
            this.successMessage = 'Usuário registrado com sucesso!';
            this.errorMessage = null;
            setTimeout(() => {
              this.router.navigate(['']);
            }, 2000);
          },
          error: (err) => {
            this.errorMessage = 'Erro ao registrar usuário: ' + err;
            this.successMessage = null;
          }
        });
    }
  }

  // Método para alternar visibilidade da senha com suporte a teclado
  togglePasswordVisibility(event?: KeyboardEvent): void {
    if (event && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    this.hidePw = !this.hidePw;
  }

}
