import {Component, Inject} from '@angular/core';
import {Activity} from '../../shared/model/activity';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ActivityService} from '../../shared/services/activity.service';
import {UserService} from '../../shared/services/user.service';
import {UserServiceIF} from '../../shared/services/user-serviceIF';

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
    public userService: UserServiceIF
  ) {
    this.activity = new Activity('', '', '', '', new Date(this.activityService.selectedDate), '', '','', '', 0);
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
      this.activity.userID = this.userService.getCurrentUser().id!;
      this.activityService.register(this.activity).subscribe(newActivity => this.activityService.updateActivities());
    }
    else {
      alert("Preencha os campos obrigatórios");
      return;
    }
    this.dialogRef.close();
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
