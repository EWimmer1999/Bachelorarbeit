import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateService } from 'src/app/services/update.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-change-pw',
  templateUrl: './change-pw.page.html',
  styleUrls: ['./change-pw.page.scss'],
})
export class ChangePWPage {

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordMismatch: boolean = false;

  constructor(
    private updateService: UpdateService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async changePassword() {
    this.passwordMismatch = this.newPassword !== this.confirmNewPassword;
    
    if (this.passwordMismatch) {
      await this.showAlert('Error', 'New passwords do not match.');
      return;
    }
  
    const result = await this.updateService.changePassword(this.currentPassword, this.newPassword);
    
    if (result.success) {
      // Bei Erfolg zur Einstellungsseite navigieren
      this.router.navigate(['settings']);
    } else {
      // Fehlerbehandlung basierend auf dem Fehlercode
      const message = result.errorCode === 401 ? 
        'The current password is wrong. Please try again.' : 
        'Unable to change password. Please try again later.';
      await this.showAlert('Error', message);
    }
  }
  

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
