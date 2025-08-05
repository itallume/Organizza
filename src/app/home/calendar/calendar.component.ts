import {Component, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ActivityService} from '../../shared/services/activity.service';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';
import {Activity} from '../../shared/model/activity';
import {MatDialog} from '@angular/material/dialog';
import {ActivityRegisterComponent} from '../activity-register/activity-register.component';

/** @title Datepicker inline calendar example */
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrl: 'calendar.component.css',
  standalone: false,
  providers: [provideNativeDateAdapter()],
})
export class CalendarComponent implements OnInit {
  allActivities: Activity[] = [];
  selectedDateActivities: Activity[] = [];

  constructor(
    protected activityService: ActivityService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadAllActivities();
    this.onDateChange();
  }

  loadAllActivities(): void {
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      return;
    }

    this.activityService.getAllActivities(this.userService.getCurrentUser().id).subscribe({
      next: (activities: Activity[]) => {
        this.allActivities = activities;
        this.filterActivitiesForSelectedDate();
      },
      error: (error: any) => {
        console.error('Erro ao carregar atividades:', error);
        this.allActivities = [];
        this.selectedDateActivities = [];
      }
    });
  }

  onDateChange(): void {
    this.filterActivitiesForSelectedDate();
    this.activityService.updateActivities();
  }

  private filterActivitiesForSelectedDate(): void {
    if (!this.activityService.selectedDate) {
      this.selectedDateActivities = [];
      return;
    }

    const selectedDateStr = this.activityService.selectedDate.toISOString().split('T')[0];
    
    this.selectedDateActivities = this.allActivities.filter(activity => {
      const activityDateStr = new Date(activity.date).toISOString().split('T')[0];
      return activityDateStr === selectedDateStr;
    }).sort((a, b) => {
      // Ordenar por horário
      return a.hour.localeCompare(b.hour);
    });
  }

  openNewActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityRegisterComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllActivities();
      }
    });
  }

  editActivity(activity: Activity): void {
    const dialogRef = this.dialog.open(ActivityRegisterComponent, {
      width: '600px',
      data: { activity: activity }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllActivities();
      }
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(activity: Activity): string {
    return activity.hour;
  }

  getActivityStatusClass(activity: Activity): string {
    if (activity.done) {
      return 'completed';
    } else if (this.isPast(activity.date)) {
      return 'overdue';
    } else if (this.isToday(activity.date)) {
      return 'today';
    }
    return 'pending';
  }

  isToday(dateString: string | Date): boolean {
    const today = new Date().toISOString().split('T')[0];
    const activityDate = new Date(dateString).toISOString().split('T')[0];
    return activityDate === today;
  }

  isPast(dateString: string | Date): boolean {
    const today = new Date().toISOString().split('T')[0];
    const activityDate = new Date(dateString).toISOString().split('T')[0];
    return activityDate < today;
  }

  goToActivities(): void {
    this.router.navigate(['/activities']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  hasActivitiesOnDate(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return this.allActivities.some(activity => {
      const activityDateStr = new Date(activity.date).toISOString().split('T')[0];
      return activityDateStr === dateStr;
    });
  }
}
