import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
  }

  login() {
    const postData = {
      username: this.username,
      password: this.password
    };
  
    this.http.post('http://192.168.0.77:3000/login', postData, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.log('User registered successfully');
          this.router.navigate(['home']);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      },
      error: (error) => {
        if (error.status === 401) {
          // Fehlermeldung vom Server auslesen und anzeigen
          console.error('Login failed:', error.error);
          // Optional: Fehlermeldung in der Benutzeroberfläche anzeigen
          this.presentAlert();
        } else  {
          // Andere Fehler behandeln
          console.error('An unexpected error occurred:', error);
          // Optional: Allgemeine Fehlermeldung anzeigen
          this.loginError = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
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
}
