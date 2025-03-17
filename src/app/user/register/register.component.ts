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
      const user: User = this.registerForm.value;
      this.userService.createUser(user)
        .subscribe({
          next: (res) => {
            console.log('User registrado com sucesso');
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Erro ao registrar usuário:', err);
          }
        });
    }
  }

}
