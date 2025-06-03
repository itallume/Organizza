import { ChangeDetectionStrategy, Component, Input, signal, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivityService } from '../../shared/services/activity.service';
import { Activity } from '../../shared/model/activity';
import { Observable } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/model/user';
import { MatDialog } from '@angular/material/dialog';
import { ActivityRegisterComponent } from '../activity-register/activity-register.component';
import { ActivityDeleteComponent } from '../activity-delete/activity-delete.component';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'activity-card-component',
  templateUrl: 'activity-card.component.html',
  styleUrls: ['activity-card.component.css'],
  standalone: false,
})
export class ActivityCardComponent implements OnInit {
  readonly panelOpenState = signal(false);
  public user: User;

  constructor(
    public activityService: ActivityService,
    public userService: UserService,
    private dialog: MatDialog
  ) {
    this.user = this.userService.getCurrentUser();

  }

  ngOnInit(): void {
    this.activityService.updateActivities();
  }

  addActivity() {
    this.dialog.open(ActivityRegisterComponent, {
      width: '500px'
    });
  }

  deleteActivity(id: string) {
    this.dialog.open(ActivityDeleteComponent, {
      width: '250px',
      enterAnimationDuration: '0.5s',
      exitAnimationDuration: '0.5s',
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.activityService.remove(id).subscribe(res => this.activityService.updateActivities());
      }
    });
  }

  editActivity(activity: Activity) {
    const dialogRef = this.dialog.open(ActivityRegisterComponent, {
      width: '500px',
      data: { activity }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.activityService.updateActivities();
      }
    });
  }

}
