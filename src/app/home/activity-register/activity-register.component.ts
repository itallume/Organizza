import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Activity } from '../../shared/model/activity';
import { ActivityService } from '../../shared/services/activity.service';
import { UserServiceIF } from '../../shared/services/user-serviceIF';

@Component({
  selector: 'app-activity-register',
  templateUrl: './activity-register.component.html',
  styleUrls: ['./activity-register.component.css'],
  standalone: false
})
export class ActivityRegisterComponent implements OnInit {
  activity: Activity;
  editMode: boolean = false;

  constructor(
    private activityService: ActivityService,
    public dialogRef: MatDialogRef<ActivityRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { editMode: boolean, activity: Activity, activityId: string },
    public userService: UserServiceIF
  ) {
    this.activity = new Activity('', '', '', '', new Date(), '', '', '', '', 0, 0, false, false);
  }

  ngOnInit(): void {
    if (this.data && this.data.editMode) {
      this.editMode = true;
      if (this.data.activity) {
        this.activity = this.data.activity;
      }
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode === 46 || (charCode >= 48 && charCode <= 57) || charCode === 58) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  formatHour(): void {
    if (this.activity.hour.length === 2) {
      this.activity.hour += ':';
    }
  }

  onSubmit(): void {
    if (this.editMode) {
      this.activityService.update(this.activity).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        error => {
          console.error('Erro ao atualizar atividade', error);
        }
      );
    } else {
      this.activityService.register(this.activity).subscribe(
        () => {
          this.activityService.updateActivities();
          this.dialogRef.close(true);
        },
        error => {
          console.error('Erro ao registrar atividade', error);
        }
      );
    }
  }
}
