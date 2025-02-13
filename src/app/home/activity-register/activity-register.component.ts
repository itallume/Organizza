import {Component, Inject} from '@angular/core';
import {Activity} from '../../shared/model/activity';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

class ActivityModalComponent {
}

@Component({
  selector: 'app-activity-register',
  standalone: false,
  templateUrl: './activity-register.component.html',
  styleUrl: './activity-register.component.css'
})
export class ActivityRegisterComponent {
  activity: Activity = new Activity(0, '', '', '', '', '','', '',0);

  constructor(
    public dialogRef: MatDialogRef<ActivityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.activity);
  }
}
