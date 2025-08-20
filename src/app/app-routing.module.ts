import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './user/login/login.component';
import {RegisterComponent} from './user/register/register.component';
import {CalendarComponent} from './home/calendar/calendar.component';
import {CalendarCardComponent} from './home/calendar-card/calendar-card.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ActivityListComponent } from './home/activity-list/activity-list.component';
import { ActivityFormComponent } from './home/activity-form/activity-form.component';
import { CalendarioAnualComponent } from './home/calendario-anual/calendario-anual.component';

const routes: Routes =
  [
    { path :'',
      component: LoginComponent
    },
    { path : 'register',
      component: RegisterComponent
    },
    { path : 'home',
      component: CalendarCardComponent,
      canActivate: [AuthGuard]
    },
    { path : 'activities',
      component: ActivityListComponent,
      canActivate: [AuthGuard]
    },
    { path : 'calendar',
      component: CalendarComponent,
      canActivate: [AuthGuard]
    },
    { path : 'activity-register',
      component: ActivityFormComponent,
      canActivate: [AuthGuard]
    },
    { path : 'calendario-anual',
      component: CalendarioAnualComponent,
      canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
