import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { serverUrl } from 'src/environments/environment';

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

  url = serverUrl;

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
      const response = await lastValueFrom(this.http.post<{ token: string }>(`${this.url}/register`, postData, { observe: 'response' }));
      if (response.status === 201) {
        console.log('User registered successfully');
        await this.storageService.set("token", response.body?.token);
        await this.storageService.set("demographicTag", "false");
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
      const response = await lastValueFrom(this.http.post<{token: string, demographic: boolean }>(`${this.url}/login`, postData, { observe: 'response' }));
      if (response.status === 200) {
        console.log('User logged in successfully');
        await this.storageService.set("token", response.body?.token);
        await this.storageService.set("demographicTag", response.body?.demographic.toString());
        this.isAuthenticated.next(true);
        this.router.navigate(['home']);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.error('Login failed:', error.error);
      }
    }
  }

  async updateToken(): Promise<void> {
    try {
      const currentToken = await this.storageService.get("token");
      
      const response = await lastValueFrom(this.http.post<{ token: string }>(
        `${this.url}/update-token`,
        {}, 
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${currentToken}`
          }),
          observe: 'response'
        }
      ));
  
      if (response.status === 200 && response.body?.token) {
    
        const newToken = response.body.token;
  
        await this.storageService.remove("token");
        await this.storageService.set("token", newToken);
  
        this.isAuthenticated.next(true);
        
        console.log("Token erfolgreich aktualisiert: " + newToken);
      } else {
        console.error("Token-Aktualisierung fehlgeschlagen. Serverantwort ungültig.");
      }
    } catch (error) {
      console.error("Fehler bei der Token-Aktualisierung:", error);
    }
  }
  
  
  async sendEmail(postData: any): Promise<void> {
    try {
      const response = await lastValueFrom(this.http.post<{ token: string }>(`${this.url}/reset-password-request`, postData, { observe: 'response' }));
      if (response) {
        console.log('Password reset email sent');
      }
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  async resetPW(postData: any): Promise<void> {
    try {
      const response = await lastValueFrom(this.http.post<{ token: string }>(`${this.url}/reset-password`, postData, { observe: 'response' }));
      if (response) {
        console.log('Password reset successfully');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  }

  async logout(): Promise<void> {
    this.isAuthenticated.next(false);
    await this.storageService.clear();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }  

  public async checkAuthentication(): Promise<boolean> {
    const token = await this.storageService.get("token"); 
    if (!token) return false;    

    const isExpired = this.isTokenExpired(token);
    if (isExpired) return false;

    return true;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(this.http.post<{ valid: boolean }>(
        `${this.url}/authenticate`,
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
