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
          name:['', Validators.required],
          email:['', Validators.required],
          password:['', Validators.required]
        })
    }

  onSubmit(): void {
    if(this.registerForm.valid) {
      const name = this.registerForm.get('name')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      
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
            this.errorMessage = err;
            this.successMessage = null;
          }
        });
    }
  }

}
