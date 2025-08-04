import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivityService} from '../../shared/services/activity.service';
import {Router} from '@angular/router';
import {Activity} from '../../shared/model/activity';

@Component({
  selector: 'app-calendar-card',
  standalone: false,
  templateUrl: './calendar-card.component.html',
  styleUrl: './calendar-card.component.css'
})
export class CalendarCardComponent implements OnInit {
  activities: Activity[] = [];
  pendingActivities: Activity[] = [];
  completedActivities: Activity[] = [];
  todayActivities: Activity[] = [];
  upcomingActivities: Activity[] = [];
  
  // Estatísticas
  totalPending: number = 0;
  totalCompleted: number = 0;
  totalRevenue: number = 0;
  totalToday: number = 0;

  constructor(
    private userService: UserService, 
    private router: Router,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadActivities();
  }

  loadActivities(): void {
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      return;
    }

    // Define uma data padrão para buscar todas as atividades
    this.activityService.selectedDate = new Date();
    
    this.activityService.getActivityPerDay(this.userService.getCurrentUser().id).subscribe({
      next: (activities: Activity[]) => {
        this.activities = activities;
        this.filterActivities();
        this.calculateStatistics();
        this.getUpcomingActivities();
      },
      error: (error: any) => {
        console.error('Erro ao carregar atividades:', error);
        // Definir valores padrão em caso de erro
        this.setDefaultValues();
      }
    });
  }

  setDefaultValues(): void {
    this.activities = [];
    this.totalPending = 0;
    this.totalCompleted = 0;
    this.totalRevenue = 0;
    this.totalToday = 0;
    this.upcomingActivities = [];
  }

  filterActivities(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.pendingActivities = this.activities.filter(activity => !activity.done);
    this.completedActivities = this.activities.filter(activity => activity.done);
    this.todayActivities = this.activities.filter(activity => {
      const activityDate = new Date(activity.date).toISOString().split('T')[0];
      return activityDate === today;
    });
  }

  calculateStatistics(): void {
    this.totalPending = this.pendingActivities.length;
    this.totalCompleted = this.completedActivities.length;
    this.totalToday = this.todayActivities.length;
    
    // Calcular receita total baseada no valor das atividades pagas
    this.totalRevenue = this.completedActivities.reduce((total, activity) => {
      return total + (activity.paied ? activity.pricePayed : 0);
    }, 0);
  }

  getUpcomingActivities(): void {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    this.upcomingActivities = this.activities
      .filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= today && activityDate <= nextWeek && !activity.done;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Mostrar apenas as próximas 5 atividades
  }

  // Métodos de navegação
  navigateToActivities(): void {
    this.router.navigate(['/activities']);
  }

  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  navigateToNewActivity(): void {
    this.router.navigate(['/activity-register']);
  }

  navigateToReports(): void {
    this.router.navigate(['/reports']);
  }

  // Método para formatar data
  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  // Método para formatar hora
  formatTime(activity: Activity): string {
    return activity.hour;
  }

  // Método para obter o status da atividade
  getActivityStatus(activity: Activity): string {
    return activity.done ? 'completed' : 'pending';
  }

  // Método para marcar atividade como completa
  markAsCompleted(activity: Activity): void {
    activity.done = true;
    this.activityService.atualizar(activity).subscribe({
      next: () => {
        this.loadActivities();
      },
      error: (error: any) => {
        console.error('Erro ao atualizar atividade:', error);
      }
    });
  }
}
