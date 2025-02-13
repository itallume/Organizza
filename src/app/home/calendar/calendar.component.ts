import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ActivityService} from '../../shared/services/activity.service';


/** @title Datepicker inline calendar example */
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrl: 'calendar.component.css',
  standalone: false,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  constructor(protected activityService: ActivityService) {
  }
  onDateChange() {
    this.activityService.updateActivities();
  }
}
