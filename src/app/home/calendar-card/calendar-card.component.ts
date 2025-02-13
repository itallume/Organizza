import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-calendar-card',
  standalone: false,
  templateUrl: './calendar-card.component.html',
  styleUrl: './calendar-card.component.css'
})
export class CalendarCardComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
}
