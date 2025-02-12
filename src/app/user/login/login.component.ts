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
      this.userService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
        .subscribe({
          next: (res) => {

            this.router.navigate(['home']);
          },
          error: (err) => {
            console.error('Erro ao fazer login:', err);
          }
        });
    }
  }
}
