import { Injectable } from '@angular/core';
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
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            auth.dismiss(true);
            // callback(true);
          },
        },
        {
          text: 'Cancelar',
          role: 'Cancel',
          handler: () => {
            auth.dismiss(false);
            // callback(false);
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Código',
          cssClass: 'code-auth',
          attributes: {
            maxlength: 6,
          },
        },
      ],
    });
    await auth.present();
    await auth.onDidDismiss().then((data) => {
      console.log('Valor data = ', data);
      code = data;
    });
    console.log('Retorno data=', code);
    return code;
  }
}
