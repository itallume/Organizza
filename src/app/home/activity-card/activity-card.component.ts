import {ChangeDetectionStrategy, Component, Input, signal, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { ActivityService } from '../../shared/services/activity.service';
import {Activity} from '../../shared/model/activity';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'acticity-card-component',
  templateUrl: 'activity-card.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityCardComponent {
  readonly panelOpenState = signal(false);
  public activities:Array<Activity> = [];

  constructor(private activityService:ActivityService){

  }
  ngOnInit():void{
    this.activityService.getActivityPerDay().subscribe(
      activities => this.activities = activities
    )
    console.log(this.activities)
  }
}
