import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivityService } from '../../shared/services/activity.service';
import { UserService } from '../../shared/services/user.service';
import { Activity } from '../../shared/model/activity';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface MonthInfo {
  name: string;
  days: number;
  index: number;
  firstDayOfWeek: number;
}

@Component({
  selector: 'app-calendario-anual',
  standalone: false,
  templateUrl: './calendario-anual.component.html',
  styleUrl: './calendario-anual.component.css'
})
export class CalendarioAnualComponent implements OnInit, OnDestroy {
  months: MonthInfo[] = [];
  activitiesByDate: { [date: string]: Activity[] } = {};
  currentYear: number = new Date().getFullYear();
  weekdays: string[] = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  loading: boolean = false;
  
  private activitiesSubscription: Subscription = new Subscription();

  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    
    this.initMonths();
    this.loadActivities();
  }

  ngOnDestroy(): void {
    this.activitiesSubscription.unsubscribe();
  }

  initMonths(): void {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    this.months = monthNames.map((name, index) => {
      const firstDay = new Date(this.currentYear, index, 1);
      return {
        name,
        days: new Date(this.currentYear, index + 1, 0).getDate(),
        index,
        firstDayOfWeek: firstDay.getDay()
      };
    });
  }

  isLeapYear(year: number): boolean {
    return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));
  }

  loadActivities(): void {
    const userId = this.userService.getCurrentUser().id;
    if (!userId) return;

    this.loading = true;
    this.activitiesSubscription.add(
      this.activityService.getAllActivitiesForYear(userId, this.currentYear).subscribe({
        next: (activities) => {
          this.activitiesByDate = {};
          activities.forEach(activity => {
            let dateStr: string;
            
            if (typeof activity.date === 'string') {
              dateStr = activity.date.includes('T') ? activity.date.split('T')[0] : activity.date;
            } else {
              dateStr = activity.date.toISOString().split('T')[0];
            }
            
            const activityYear = new Date(dateStr).getFullYear();
            
            // Só incluir atividades do ano atual
            if (activityYear === this.currentYear) {
              if (!this.activitiesByDate[dateStr]) {
                this.activitiesByDate[dateStr] = [];
              }
              this.activitiesByDate[dateStr].push(activity);
            }
          });
          console.log('Atividades carregadas para o calendário anual:', Object.keys(this.activitiesByDate).length, 'datas');
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar atividades para calendário anual:', error);
          this.loading = false;
        }
      })
    );
  }

  hasActivity(month: number, day: number): boolean {
    const dateStr = `${this.currentYear}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return !!this.activitiesByDate[dateStr] && this.activitiesByDate[dateStr].length > 0;
  }

  getActivityCount(month: number, day: number): number {
    const dateStr = `${this.currentYear}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.activitiesByDate[dateStr]?.length || 0;
  }

  getActivitiesForDay(month: number, day: number): Activity[] {
    const dateStr = `${this.currentYear}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.activitiesByDate[dateStr] || [];
  }

  isToday(month: number, day: number): boolean {
    const today = new Date();
    return today.getFullYear() === this.currentYear && 
           today.getMonth() === month && 
           today.getDate() === day;
  }

  navigateToDay(month: number, day: number): void {
    if (this.hasActivity(month, day)) {
      // Redireciona para o calendário com a data específica
      const date = new Date(this.currentYear, month, day);
      this.activityService.selectedDate = date;
      this.router.navigate(['/home/calendar']);
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  // Cria array de células vazias para o início do mês
  getEmptyCells(month: MonthInfo): number[] {
    return Array(month.firstDayOfWeek).fill(0);
  }

  // Cria array com os dias do mês
  getMonthDays(month: MonthInfo): number[] {
    return Array.from({ length: month.days }, (_, i) => i + 1);
  }

  // Métodos para estatísticas e tooltip
  getDayTooltip(month: number, day: number): string {
    if (this.isToday(month, day)) {
      return 'Hoje';
    }
    
    if (this.hasActivity(month, day)) {
      const count = this.getActivityCount(month, day);
      const activities = this.getActivitiesForDay(month, day);
      const titles = activities.slice(0, 2).map(a => a.title).join(', ');
      const more = count > 2 ? ` e mais ${count - 2}` : '';
      return `${count} atividade${count > 1 ? 's' : ''}: ${titles}${more}`;
    }
    
    return '';
  }

  getMonthActivityCount(monthIndex: number): number {
    let count = 0;
    const monthDays = new Date(this.currentYear, monthIndex + 1, 0).getDate();
    
    for (let day = 1; day <= monthDays; day++) {
      count += this.getActivityCount(monthIndex, day);
    }
    
    return count;
  }

  getTotalActivities(): number {
    return Object.values(this.activitiesByDate)
      .reduce((total, activities) => total + activities.length, 0);
  }

  getDaysWithActivities(): number {
    return Object.keys(this.activitiesByDate).length;
  }

  getMostActiveMonth(): string {
    const monthCounts = this.months.map(month => ({
      name: month.name,
      count: this.getMonthActivityCount(month.index)
    }));
    
    const mostActive = monthCounts.reduce((prev, current) => 
      current.count > prev.count ? current : prev
    );
    
    return mostActive.count > 0 ? mostActive.name : 'Nenhum';
  }
}
