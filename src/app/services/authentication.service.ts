import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';

  constructor(
    private storageService: StorageService, 
    private router: Router,
    private http: HttpClient
  ) {}

  async isAuthenticatedUser(): Promise<boolean> {
    const token = await this.storageService.get("token");  
    if (!token) return false;

    const isExpired = this.isTokenExpired(token);  
    return !isExpired;
  }
    
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
      if (decodedToken.exp === undefined) {
        throw new Error('Token does not contain an expiry date');
      }
      const expiry = decodedToken.exp;
      return Math.floor((new Date).getTime() / 1000) >= expiry;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return true;
    }
  }

  async register(postData: any): Promise<void> {
    try {
      const response = await lastValueFrom(this.http.post<{ token: string }>('http://192.168.0.77:3000/register', postData, { observe: 'response' }));
      if (response.status === 201) {
        console.log('User registered successfully');
        await this.storageService.set("token", response.body?.token);
        this.isAuthenticated.next(true);
        this.router.navigate(['home']);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.error('Registration failed:', error.error);
      }
    }
  }
  
  async login(postData: any): Promise<void> {
    try {
      const response = await lastValueFrom(this.http.post<{ token: string }>('http://192.168.0.77:3000/login', postData, { observe: 'response' }));
      if (response.status === 200) {
        console.log('User logged in successfully');
        await this.storageService.set("token", response.body?.token);
        this.isAuthenticated.next(true);
        this.router.navigate(['home']);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.error('Login failed:', error.error);
      }
    }
  }

  async sendEmail(postData: any): Promise<void> {
    try {
      const response = await lastValueFrom(this.http.post<{ token: string }>('http://192.168.0.77:3000/reset-password-request', postData, { observe: 'response' }));
      if (response) {
        console.log('Password reset email sent');
      }
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  async resetPW(postData: any): Promise<void> {
    try {
      const response = await lastValueFrom(this.http.post<{ token: string }>('http://192.168.0.77:3000/reset-password', postData, { observe: 'response' }));
      if (response) {
        console.log('Password reset successfully');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  }

  async logout(): Promise<void> {
    this.isAuthenticated.next(false);
    await this.storageService.remove("token");
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }  

  public async checkAuthentication(): Promise<boolean> {
    const token = await this.storageService.get("token"); 
    if (!token) return false;    

    const isExpired = this.isTokenExpired(token);
    if (isExpired) return false;

    const isValidToken = await this.validateToken(token);
    return isValidToken;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(this.http.post<{ valid: boolean }>(
        'http://192.168.0.77:3000/authenticate',
        {}, 
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`
          }),
          observe: 'response'
        }
      ));

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
