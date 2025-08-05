import { Component, OnInit, OnDestroy } from '@angular/core';
import { Activity } from '../../shared/model/activity';
import { ActivityService } from '../../shared/services/activity.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActivityRegisterComponent } from '../activity-register/activity-register.component';
import { ActivityDeleteComponent } from '../activity-delete/activity-delete.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activity-list',
  standalone: false,
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent implements OnInit, OnDestroy {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  isLoading = false;
  filterStatus: 'all' | 'pending' | 'completed' | 'today' = 'all';
  searchTerm: string = '';

  private activitiesSubscription: Subscription = new Subscription();

  get totalPending(): number {
    return this.activities.filter(a => !a.done).length;
  }

  get totalCompleted(): number {
    return this.activities.filter(a => a.done).length;
  }

  constructor(
    private activityService: ActivityService,
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
    this.subscribeToActivitiesUpdates();
  }

  ngOnDestroy(): void {
    this.activitiesSubscription.unsubscribe();
  }

  subscribeToActivitiesUpdates(): void {
    // Se inscreve para atualizações automáticas das atividades
    this.activitiesSubscription.add(
      this.activityService.activitiesUpdated$.subscribe(() => {
        this.loadAllActivities();
      })
    );
  }

  loadAllActivities(): void {
    this.isLoading = true;
    
    if (!this.userService.isLoggedIn() || !this.userService.getCurrentUser().id) {
      console.warn('Usuário não logado ou sem ID');
      this.isLoading = false;
      return;
    }

    const userId = this.userService.getCurrentUser().id;
    console.log('Buscando atividades para o usuário:', userId);

    // Buscar todas as atividades do usuário
    this.activityService.getAllActivities(userId).subscribe({
      next: (activities: Activity[]) => {
        console.log('Atividades recebidas:', activities);
        this.activities = activities.sort((a, b) => {
          // Ordenar por data corretamente
          const dateA = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0];
          const dateB = typeof b.date === 'string' ? b.date : new Date(b.date).toISOString().split('T')[0];
          return dateB.localeCompare(dateA); // Mais recentes primeiro
        });
        this.applyFilters();
        this.isLoading = false;
        console.log('Atividades após filtro:', this.filteredActivities);
      },
      error: (error: any) => {
        console.error('Erro ao carregar atividades:', error);
        this.activities = [];
        this.filteredActivities = [];
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.activities];

    // Filtro por status
    switch (this.filterStatus) {
      case 'pending':
        filtered = filtered.filter(activity => !activity.done);
        break;
      case 'completed':
        filtered = filtered.filter(activity => activity.done);
        break;
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(activity => {
          if (typeof activity.date === 'string') {
            return activity.date === today;
          }
          const activityDate = new Date(activity.date).toISOString().split('T')[0];
          return activityDate === today;
        });
        break;
      // 'all' não precisa de filtro
    }

    // Filtro por termo de busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(term) ||
        activity.description.toLowerCase().includes(term) ||
        activity.clientName.toLowerCase().includes(term) ||
        activity.address.toLowerCase().includes(term)
      );
    }

    this.filteredActivities = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
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

  deleteActivity(activity: Activity): void {
    const dialogRef = this.dialog.open(ActivityDeleteComponent, {
      width: '400px',
      data: { activity: activity }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Executar a exclusão e notificar sobre a atualização
        this.activityService.remove(activity.id).subscribe({
          next: () => {
            this.activityService.notifyActivitiesUpdated();
          },
          error: (error: any) => {
            console.error('Erro ao excluir atividade:', error);
          }
        });
      }
    });
  }

  toggleActivityStatus(activity: Activity): void {
    activity.done = !activity.done;
    
    this.activityService.atualizarComPost(activity).subscribe({
      next: () => {
        // Notifica que as atividades foram atualizadas
        this.activityService.notifyActivitiesUpdated();
      },
      error: (error: any) => {
        console.error('Erro ao atualizar status da atividade:', error);
        // Reverter o estado em caso de erro
        activity.done = !activity.done;
      }
    });
  }

  togglePaymentStatus(activity: Activity): void {
    activity.paied = !activity.paied;
    
    this.activityService.atualizarComPost(activity).subscribe({
      next: () => {
        // Notifica que as atividades foram atualizadas
        this.activityService.notifyActivitiesUpdated();
      },
      error: (error: any) => {
        console.error('Erro ao atualizar status de pagamento:', error);
        // Reverter o estado em caso de erro
        activity.paied = !activity.paied;
      }
    });
  }

  formatDate(dateString: string | Date): string {
    // Se for uma string no formato YYYY-MM-DD, criar uma data local
    if (typeof dateString === 'string') {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // Criar data local para evitar problemas de timezone
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  getActivityIcon(activity: Activity): string {
    if (activity.done) {
      return 'check_circle';
    } else if (this.isToday(activity.date)) {
      return 'today';
    } else if (this.isPast(activity.date)) {
      return 'schedule';
    }
    return 'event';
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
    
    if (typeof dateString === 'string') {
      return dateString === today;
    }
    
    const activityDate = new Date(dateString).toISOString().split('T')[0];
    return activityDate === today;
  }

  isPast(dateString: string | Date): boolean {
    const today = new Date().toISOString().split('T')[0];
    
    if (typeof dateString === 'string') {
      return dateString < today;
    }
    
    const activityDate = new Date(dateString).toISOString().split('T')[0];
    return activityDate < today;
  }

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
