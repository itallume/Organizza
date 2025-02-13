import {ChangeDetectionStrategy, Component, Input, signal, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { ActivityService } from '../../shared/services/activity.service';
import {Activity} from '../../shared/model/activity';
import {Observable} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/model/user';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'activity-card-component',
  templateUrl: 'activity-card.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityCardComponent implements OnInit{
  readonly panelOpenState = signal(false);

  public activities:Array<Activity> = [];
  public user:User | null;


  constructor(public activityService:ActivityService, public userService:UserService) {
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
  }

  ngOnInit(): void {

    // @ts-ignore
    this.activityService.getActivityPerDay(this.user.id).subscribe(activities => {
      this.activities = activities;
    });
  }
}
