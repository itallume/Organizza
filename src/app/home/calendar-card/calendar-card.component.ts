import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivityService} from '../../shared/services/activity.service';
import {Router} from '@angular/router';
import {Activity} from '../../shared/model/activity';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-calendar-card',
  standalone: false,
  templateUrl: './calendar-card.component.html',
  styleUrl: './calendar-card.component.css'
})
export class CalendarCardComponent implements OnInit, OnDestroy {
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

  private activitiesSubscription: Subscription = new Subscription();

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
    this.subscribeToActivitiesUpdates();
  }

  ngOnDestroy(): void {
    this.activitiesSubscription.unsubscribe();
  }

  subscribeToActivitiesUpdates(): void {
    // Se inscreve para atualizações automáticas das atividades
    this.activitiesSubscription.add(
      this.activityService.activitiesUpdated$.subscribe(() => {
        this.loadActivities();
      })
    );
  }

  loadActivities(): void {
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      return;
    }

    // Buscar todas as atividades do usuário
    this.activityService.getAllActivities(this.userService.getCurrentUser().id).subscribe({
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
    this.totalRevenue = this.activities.reduce((total, activity) => {
      if (activity.paied && activity.pricePayed > 0) {
        return total + activity.pricePayed;
      } else if (activity.paied && activity.price > 0) {
        return total + activity.price;
      }
      return total;
    }, 0);
  }

  getUpcomingActivities(): void {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Próximos 2 dias (não incluindo hoje)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];
    
    this.upcomingActivities = this.activities
      .filter(activity => {
        const activityDate = typeof activity.date === 'string' 
          ? activity.date 
          : new Date(activity.date).toISOString().split('T')[0];
        
        // Apenas atividades dos próximos 2 dias (excluindo hoje)
        return (activityDate === tomorrowStr || activityDate === dayAfterTomorrowStr) && !activity.done;
      })
      .sort((a, b) => {
        // Ordenar por data e depois por horário
        const dateA = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0];
        const dateB = typeof b.date === 'string' ? b.date : new Date(b.date).toISOString().split('T')[0];
        
        if (dateA !== dateB) {
          return dateA.localeCompare(dateB);
        }
        
        // Se a data for igual, ordenar por horário
        return a.hour.localeCompare(b.hour);
      })
      .slice(0, 6); // Mostrar até 6 atividades próximas
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

  navigateToAnnualCalendar(): void {
    this.router.navigate(['/calendario-anual']);
  }

  // Propriedade para exibir o ano atual no card
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // Método para formatar data
  formatDate(dateString: string | Date): string {
    if (typeof dateString === 'string') {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        });
      }
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  // Método para formatar data completa para cards
  formatDateForCard(dateString: string | Date): string {
    if (typeof dateString === 'string') {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(today.getDate() + 2);
        
        const dateStr = date.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const dayAfterStr = dayAfter.toISOString().split('T')[0];
        
        if (dateStr === tomorrowStr) {
          return 'Amanhã';
        } else if (dateStr === dayAfterStr) {
          return 'Depois de amanhã';
        }
        
        return date.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit'
        });
      }
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  }

  // Método para obter classe CSS do status da atividade
  getActivityStatusClass(activity: Activity): string {
    if (activity.done) {
      return 'completed';
    }
    
    const today = new Date().toISOString().split('T')[0];
    const activityDate = typeof activity.date === 'string' 
      ? activity.date 
      : new Date(activity.date).toISOString().split('T')[0];
    
    if (activityDate < today) {
      return 'overdue';
    } else if (activityDate === today) {
      return 'today';
    }
    return 'upcoming';
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

  // Método para formatar valores monetários
  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
