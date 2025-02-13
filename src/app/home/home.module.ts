import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivityService } from '../shared/services/activity.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CalendarCardComponent } from './calendar-card/calendar-card.component';



@NgModule({
  declarations: [
    CalendarComponent,
    ActivityCardComponent,
    CalendarCardComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    HttpClientModule,
  ],
  exports: [
    CalendarComponent,
    ActivityCardComponent,
    CalendarCardComponent,
  ]
})
export class HomeModule {
 }
