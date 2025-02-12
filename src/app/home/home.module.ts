import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    CalendarComponent,
    ActivityCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
  ],
  exports: [
    CalendarComponent,
    ActivityCardComponent
  ]
})
export class HomeModule { }
