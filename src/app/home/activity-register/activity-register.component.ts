import {Component, Inject} from '@angular/core';
import {Activity} from '../../shared/model/activity';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ActivityService} from '../../shared/services/activity.service';
import {UserService} from '../../shared/services/user.service';

class ActivityModalComponent {
}

@Component({
  selector: 'app-activity-register',
  standalone: false,
  templateUrl: './activity-register.component.html',
  styleUrl: './activity-register.component.css'
})
export class ActivityRegisterComponent {
  activity: Activity = new Activity('', '', '', '', '', '','', '',0);

  constructor(
    public dialogRef: MatDialogRef<ActivityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public activityService: ActivityService,
    public userService: UserService
  ) {}

  onSubmit(): void {
    const parserdDate = new Date(this.activity.date);

    if (
      this.activity &&
      this.activity.title &&
      this.activity.description &&
      this.activity.date &&
      this.activity.title.trim() !== '' &&
      this.activity.description.trim() !== ''
    ) {
      const newActvity = new Activity(this.activity.id,
        this.userService.getCurrentUser().id,
        this.activity.title,
        this.activity.description,
        `${parserdDate.getFullYear() + '-' + (parserdDate.getMonth() + 1) + '-' + parserdDate.getDate()}`,
        this.activity.address,
        this.activity.clientNumber,
        this.activity.clientName,
        this.activity.price,
        this.activity.pricePayed,
        this.activity.done,
        this.activity.paied );

      this.activityService.register(newActvity).subscribe(newActivity => this.activityService.updateActivities());
    }
    else {
      alert("Preencha os campos obrigatórios");
      return;
    }
    this.dialogRef.close();
  }
}
