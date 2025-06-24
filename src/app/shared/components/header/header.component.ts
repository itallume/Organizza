import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  getCurrentUserName(): string {
    return this.userService.getCurrentUser().name;
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
