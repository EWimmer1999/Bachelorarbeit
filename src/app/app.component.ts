import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu = true;

  constructor(private router: Router, private menu: MenuController, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showMenu = !['/login'].includes(this.router.url); // Menü nicht auf der Login-Seite anzeigen
    });
  }

  closeMenu() {
    this.menu.close();
  }

  logout(){
    this.authService.logout();
  }
}
