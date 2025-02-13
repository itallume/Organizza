import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {ActivityService} from '../../shared/services/activity.service';

/**
 * @title Dialog Animations
 */
@Component({
  selector: 'activity-delete',
  styleUrl: 'activity-delete.component.css',
  templateUrl: 'activity-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ActivityDeleteComponent {
  constructor(
    public activityService: ActivityService,
    public dialogRef: MatDialogRef<ActivityDeleteComponent>
  ) {}

  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }
}
