import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() { }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    const postData = {
      username: this.username,
      email: this.email, // Falls du die E-Mail auch benötigst
      password: this.password
    };
  
    this.http.post('http://192.168.0.77:3000/register', postData, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.status === 201) {
          console.log('User registered successfully');
          this.router.navigate(['login']);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      },
      error: (error) => {
        if (error.status === 400) {
          // Fehlermeldung vom Server auslesen und anzeigen
          console.error('Registration failed:', error.error);
          // Optional: Fehlermeldung in der Benutzeroberfläche anzeigen
          this.presentAlert();
        } else if (error.status === 201){
          console.error('User created!!!');
          this.router.navigate(['login']);
        } else  {
          // Andere Fehler behandeln
          console.error('An unexpected error occurred:', error);
          // Optional: Allgemeine Fehlermeldung anzeigen
          this.registrationError = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  
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
