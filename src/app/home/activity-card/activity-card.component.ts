import {ChangeDetectionStrategy, Component, Input, signal, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { ActivityService } from '../../shared/services/activity.service';
import {Activity} from '../../shared/model/activity';
import {Observable} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/model/user';
import {MatDialog} from '@angular/material/dialog';
import {ActivityRegisterComponent} from '../activity-register/activity-register.component';
import {ActivityDeleteComponent} from '../activity-delete/activity-delete.component';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'activity-card-component',
  templateUrl: 'activity-card.component.html',
  standalone: false,
})
export class ActivityCardComponent implements OnInit {
  readonly panelOpenState = signal(false);

  public activities: Array<Activity> = [];
  public user!: User ;

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


    // Abre o modal
    const dialogRef = this.dialog.open(ActivityRegisterComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.activityService.register(new Activity(result.id,
          this.user.id,
          result.title,
          result.description,
          `${result.date.getFullYear() + '-' + (result.date.getMonth() + 1) + '-' + result.date.getDate()}`,
          result.address,
          result.clientNumber,
          result.clientName,
          result.price,
          result.pricePayed,
          result.done,
          result.paied )).subscribe(newActivity => undefined);
      }
    });
  }

  deleteActivity(id: number) {
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

}
