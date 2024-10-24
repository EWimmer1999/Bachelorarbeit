import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private themeService: ThemeService,
    private updateService: UpdateService
  ) { }

  ngOnInit() {
    this.themeService.applyTheme();
  }

  ionViewWillEnter(){
    this.themeService.applyTheme();
    this.updateService.updateApp()
  }

  ionViewDidEnter(){
    this.updateService.updateApp()
  }



}
