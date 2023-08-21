import { Injectable } from '@angular/core';
import { Event } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async toast(title: string, position: any = 'top'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: title,
      position,
      duration: 3000,
    });
    await toast.present();
  }

  async alert(title: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: title,
      message,
      buttons: ['Ok'],
      backdropDismiss: false,
    });
    await alert.present();
  }

  async confirm(title: string, message: string, callback: any): Promise<any> {
    const alert = await this.alertCtrl.create({
      header: title,
      message,
      buttons: [
        {
          text: 'Não',
          role: 'Cancel',
          handler: () => {
            alert.dismiss(false);
            callback(false);
          },
        },
        {
          text: 'Sim',
          role: 'Ok',
          handler: () => {
            alert.dismiss(true);
            callback(true);
          },
        },
      ],
    });
    await alert.present();
    return await alert.onDidDismiss();
  }

  async codeAuthorization(): Promise<any> {
    let code;
    const auth = await this.alertCtrl.create({
      header: 'Código de Autorização',
      inputs: [
        {
          name: 'codVoucher',
          placeholder: 'Código',
          cssClass: 'code-auth',
          attributes: {
            maxlength: 6,
          },
        },
      ],
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: (alertData) => {
            auth.dismiss(alertData.codVoucher);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (alertData) => {
            auth.dismiss(alertData);
          },
        },
      ],
    });
    await auth.present();
    await auth.onDidDismiss().then((res) => {
      console.log('Valor data = ', res);
      code = res;
    });
    console.log('Retorno data=', code);
    return code;
  }
}
