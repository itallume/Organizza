import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Organizza';
  isAuthPage = false;

  constructor(private router: Router) {
    // Monitora mudanças de rota para verificar se é página de autenticação
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAuthPage = this.checkIfAuthPage(event.url);
      });
  }

  ngOnInit() {
    // Verificação inicial da rota atual
    this.isAuthPage = this.checkIfAuthPage(this.router.url);
  }

  private checkIfAuthPage(url: string): boolean {
    const authRoutes = ['/', '/register'];
    return authRoutes.includes(url);
  }
}
