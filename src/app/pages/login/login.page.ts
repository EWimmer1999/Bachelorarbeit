import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  loginError: string | null = null;

  form!: FormGroup;

  constructor(private router: Router, private http: HttpClient, 
    private cdr: ChangeDetectorRef, private authService: AuthService, private alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.clearFields()
  }

  login() {
    const postData = {
      username: this.username,
      password: this.password
    };

    this.authService.login(postData);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'The username or password is incorrect. Please try again!',
      buttons: ['Action'],
    });

    await alert.present();
  }

  register() {
    this.router.navigate(['register']);
  }

  resetPw(){
    this.router.navigate(['reset-pw']);
  }

  clearFields() {
    this.username = '';
    this.password = '';
  }
}
