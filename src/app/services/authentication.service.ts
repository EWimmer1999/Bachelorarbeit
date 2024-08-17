import { Injectable } from '@angular/core';
import{StorageService} from './storage.service'
import { CapacitorHttp} from '@capacitor/core';
import { Router } from '@angular/router';
import {jwtDecode, JwtPayload} from "jwt-decode";
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoginPage } from '../login/login.page';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	token = '';
  public isValidToken=false;
  

  constructor(
    private storageService:StorageService, 
    private router:Router,
    private http: HttpClient,
    ) 
    {}

    
  async isAuthenticatedUser()
    {
      const token=await this.storageService.get("token");  
      if(!token) 
      return false;
      
      var isExpired=this.isTokenExpired(token);  
      if (isExpired) {
        return false;
      } else {
        return true;
      } 
    }
    
    private isTokenExpired(token: string): boolean {
      try {
          // Dekodieren des Tokens und Verwendung der JwtPayload Schnittstelle
          const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
          
          // Sicherstellen, dass das exp-Feld vorhanden ist
          if (decodedToken.exp === undefined) {
              throw new Error('Token does not contain an expiry date');
          }
  
          // Extrahieren des Ablaufdatums
          const expiry = decodedToken.exp;
          
          // Berechnen, ob das Token abgelaufen ist
          const isExpired = Math.floor((new Date).getTime() / 1000) >= expiry;
          
          return isExpired;
      } catch (error) {
          // Fehlerbehandlung, falls das Token ungültig ist
          console.error('Token decoding failed:', error);
          return true; // Token als abgelaufen betrachten, falls es ungültig ist
      }
  }
    
  async register(postData: any) {

    this.http.post<{ token: string }>('http://192.168.0.77:3000/register', postData, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.status === 201) {
          console.log('User registered successfully');
          this.router.navigate(['home']);
          this.storageService.set("token", response.body?.token);
          this.isAuthenticated.next(true);
        } 
      },      
      error: (error) => {
        if (error.status) {
          console.error('Login failed:', error.error);
        }
      }
    });
  }
  
  async login(postData: any) {

    this.http.post<{ token: string }>('http://192.168.0.77:3000/login', postData, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.log('User registered successfully');
          this.router.navigate(['home']);
          this.storageService.set("token", response.body?.token);
          this.isAuthenticated.next(true);
        } 
      },      
      error: (error) => {
        if (error.status) {
          console.error('Login failed:', error.error);
        }
      }
    });
  }

  async logout() {
		this.isAuthenticated.next(false);
		await this.storageService.remove("token");
    this.router.navigateByUrl('/login', { replaceUrl: true });
	}  
 
  public async checkAuthentication(){

    const token=await this.storageService.get("token"); 
    if(!token)  return false;    

    var isExpired=this.isTokenExpired(token);
    console.log("isExpired  " +isExpired)
    if (isExpired) return false;
    
    var isValidToken=false;  
    isValidToken=await this.validateToken(token);
    console.log("isValidToken" +isValidToken)
       
    if(!isValidToken)
      return false;      
    else
      return true;      

  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response$ = this.http.post<{ valid: boolean }>(
        'http://192.168.0.77:3000/authenticate',
        {}, // Body kann leer sein
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}` // Token im Authorization Header senden
          }),
          observe: 'response' // Vollständige Antwort zurückgeben
        }
      );
  
      // Umwandlung des Observables in ein Promise
      const response: HttpResponse<{ valid: boolean }> = await lastValueFrom(response$);
  
      // Überprüfen, ob der Status der Antwort 200 ist und ob der Token als gültig bestätigt wurde
      if (response.status === 200 && response.body?.valid) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
  
}
