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
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButton, MatButtonModule, MatFabButton} from '@angular/material/button';
import { ActivityRegisterComponent } from './activity-register/activity-register.component';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule} from '@angular/material/core';
import { ActivityDeleteComponent } from './activity-delete/activity-delete.component';

@NgModule({
  declarations: [
    CalendarComponent,
    ActivityCardComponent,
    CalendarCardComponent,
    ActivityRegisterComponent,
    ActivityDeleteComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    HttpClientModule,
    MatRadioButton,
    MatIcon,
    MatButton,
    MatFabButton,
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatCheckbox,
    MatDialogActions,
    MatDialogClose,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatNativeDateModule

  ],

  exports: [
    CalendarComponent,
    ActivityCardComponent,
    CalendarCardComponent,
    ActivityRegisterComponent,
    ActivityDeleteComponent,
  ]
})
export class HomeModule {
 }
