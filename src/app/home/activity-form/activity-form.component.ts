import { Component, OnInit } from '@angular/core';
import { Activity } from '../../shared/model/activity';
import { ActivityService } from '../../shared/services/activity.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-form',
  standalone: false,
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.css'
})
export class ActivityFormComponent implements OnInit {
  activity: Activity;
  isSubmitting = false;

  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private router: Router
  ) {
    this.activity = new Activity('', '', '', '', new Date(), '', '', '', '', 0);
  }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    this.isSubmitting = true;
    this.activity.userID = this.userService.getCurrentUser().id;

    // Formata a data para 'YYYY-MM-DD' antes de enviar
    if (this.activity.date instanceof Date) {
      const year = this.activity.date.getFullYear();
      const month = (this.activity.date.getMonth() + 1).toString().padStart(2, '0');
      const day = this.activity.date.getDate().toString().padStart(2, '0');
      this.activity.date = `${year}-${month}-${day}`;
    }

    this.activityService.register(this.activity).subscribe({
      next: () => {
        alert('Atividade criada com sucesso!');
        this.router.navigate(['/activities']);
      },
      error: (error) => {
        console.error('Erro ao criar atividade:', error);
        alert('Erro ao criar atividade: ' + error.message);
        this.isSubmitting = false;
      }
    });
  }

  private isFormValid(): boolean {
    return !!(
      this.activity &&
      this.activity.title &&
      this.activity.description &&
      this.activity.date &&
      this.activity.hour &&
      this.activity.title.trim() !== '' &&
      this.activity.description.trim() !== ''
    );
  }

  formatHour(): void {
    let cleaned = this.activity.hour.replace(/\D/g, '');

    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    }
    this.activity.hour = cleaned.slice(0, 5);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.keyCode ? event.keyCode : event.which;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  goToActivities(): void {
    this.router.navigate(['/activities']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  clearForm(): void {
    this.activity = new Activity('', '', '', '', new Date(), '', '', '', '', 0);
  }
}
