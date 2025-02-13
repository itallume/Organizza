import {ChangeDetectionStrategy, Component, Input, signal, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { ActivityService } from '../../shared/services/activity.service';
import {Activity} from '../../shared/model/activity';
import {Observable} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/model/user';
import {MatDialog} from '@angular/material/dialog';
import {ActivityRegisterComponent} from '../activity-register/activity-register.component';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'activity-card-component',
  templateUrl: 'activity-card.component.html',
  standalone: false,
})
export class ActivityCardComponent implements OnInit {
  readonly panelOpenState = signal(false);

  public activities: Array<Activity> = [];
  public user!: User ;

  constructor(
    public activityService: ActivityService,
    public userService: UserService,
    private dialog: MatDialog
  ) {

    this.user = this.userService.getCurrentUser();

  }

  ngOnInit(): void {

    this.activityService.updateActivities();
  }

  addActivity() {


    // Abre o modal
    const dialogRef = this.dialog.open(ActivityRegisterComponent, {
      height: '800px',
      width: '1000px', // Defina o tamanho do modal
      data: {} // Passe dados adicionais, se necessário
    });

    // Quando o modal é fechado, você pode capturar os dados retornados
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // Aqui você pode adicionar a lógica para salvar a atividade
        this.activityService.register(new Activity(result.id,
          this.user.id,
          result.title,
          result.description,
          `${result.date.getFullYear() + '-' + (result.date.getMonth() + 1) + '-' + result.date.getDate()}`,
          result.address,
          result.clientNumber,
          result.clientName,
          result.price,
          result.pricePayed, // Garante um valor padrão caso seja undefined
          result.done,
          result.paied )).subscribe(newActivity => console.log(newActivity)); // Exemplo: adicionar a atividade ao serviço
      }
    });
  }
}
