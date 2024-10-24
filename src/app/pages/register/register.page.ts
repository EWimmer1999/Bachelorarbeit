import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  registrationError: string | null = null; 

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private alertController: AlertController) { }

  ngOnInit() { }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    const postData = {
      username: this.username,
      email: this.email,
      password: this.password
    };
  
    this.authService.register(postData);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Registration failed',
      message: 'The username is already in use. Please try again with a different username.',
      buttons: ['Action'],
    });

    await alert.present();
  }
  
}
