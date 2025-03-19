import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from "@angular/material/icon";
import {UserServiceIF} from '../shared/services/user-serviceIF';
import {UserService} from '../shared/services/user.service';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButton,
        RouterLink,
        ReactiveFormsModule,
        MatIcon,

    ]
})
export class UserModule { }
