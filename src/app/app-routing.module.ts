import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './user/login/login.component';
import {RegisterComponent} from './user/register/register.component';
import {CalendarCardComponent} from './home/calendar-card/calendar-card.component';

const routes: Routes =
  [
    { path :'',
      component: LoginComponent
    },
    { path : 'register',
      component: RegisterComponent
    },
    { path : 'home',
      component: CalendarCardComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
