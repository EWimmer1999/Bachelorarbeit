import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-new-pw',
  templateUrl: './new-pw.page.html',
  styleUrls: ['./new-pw.page.scss'],
})
export class NewPWPage implements OnInit {

  password: string = '';
  token: string = '';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private alertController: AlertController, private route: ActivatedRoute,) { }

  ngOnInit() { 
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  setPW(){
    const postData = {
      password: this.password,
      token: this.token
    }

    this.authService.resetPW(postData);

    this.router.navigate(['login']); //ToDo: Only redirect if successful
  }
}
