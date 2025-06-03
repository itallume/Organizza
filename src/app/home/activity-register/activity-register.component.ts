import { Component, Inject } from '@angular/core';
import { Activity } from '../../shared/model/activity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivityService } from '../../shared/services/activity.service';
import { UserService } from '../../shared/services/user.service';

class ActivityModalComponent {
}

@Component({
  selector: 'app-activity-register',
  standalone: false,
  templateUrl: './activity-register.component.html',
  styleUrl: './activity-register.component.css'
})
export class ActivityRegisterComponent {
  activity: Activity;

  constructor(
    public dialogRef: MatDialogRef<ActivityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public activityService: ActivityService,
    public userService: UserService
  ) {
    if (data && data.activity) {
      this.activity = { ...data.activity };
      if (typeof this.activity.date === 'string') {
        this.activity.date = new Date(this.activity.date);
      }
    } else {
      this.activity = new Activity('', '', '', '', new Date(this.activityService.selectedDate), '', '', '', '', 0);
    }
  }

  onSubmit(): void {
    if (
      this.activity &&
      this.activity.title &&
      this.activity.description &&
      this.activity.date &&
      this.activity.hour &&
      this.activity.title.trim() !== '' &&
      this.activity.description.trim() !== ''
    ) {
      this.activity.userID = this.userService.getCurrentUser().id;

      // Sempre formata a data para 'YYYY-MM-DD' antes de enviar
      if (this.activity.date instanceof Date) {
        // Corrige para garantir que só a data (sem hora) seja enviada
        const year = this.activity.date.getFullYear();
        const month = (this.activity.date.getMonth() + 1).toString().padStart(2, '0');
        const day = this.activity.date.getDate().toString().padStart(2, '0');
        this.activity.date = `${year}-${month}-${day}`;
      }

      if (this.data && this.data.activity) {
        // Edição
        this.activityService.atualizar(this.activity).subscribe(() => {
          this.activityService.updateActivities();
          this.dialogRef.close(true);
        });
      } else {
        // Criação
        this.activityService.register(this.activity).subscribe(() => {
          this.activityService.updateActivities();
          this.dialogRef.close(true);
        });
      }
    } else {
      alert("Preencha os campos obrigatórios");
      return;
    }
  }

  formatHour() {
    let cleaned = this.activity.hour.replace(/\D/g, '');

    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    }
    this.activity.hour = cleaned.slice(0, 5);
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.keyCode ? event.keyCode : event.which;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

}
