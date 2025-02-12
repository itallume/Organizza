import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Activity } from '../../../shared/model/Activity';

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
  selected = model<Date | null>(null);
  atividade: Activity =  new Activity(new Date('2025-02-14'));

  constructor(){
    console.log(this.atividade)
  }
}
