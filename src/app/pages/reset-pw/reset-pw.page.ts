import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication.service';
import { AlertController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-reset-pw',
  templateUrl: './reset-pw.page.html',
  styleUrls: ['./reset-pw.page.scss'],
})

export class ResetPwPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  registrationError: string | null = null; 

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private alertController: AlertController,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.themeService.applyTheme();
   }

  sendEmail(){
    const postData = {
      email: this.email
    }

    this.authService.sendEmail(postData);

    this.router.navigate(['login']); //ToDo: Only redirect if the email request was sucessful
  }

  
}

