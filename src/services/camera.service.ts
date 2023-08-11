import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  photo: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  async addNewToGallery(): Promise<Photo> {
    // --- Take a photo
    const capturePhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      allowEditing: true,
      quality: 100
    });

    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(capturePhoto && (capturePhoto.dataUrl));
    // return this.photo;

    return capturePhoto;

  }

}
