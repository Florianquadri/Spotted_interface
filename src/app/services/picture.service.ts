import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Image } from '../models/pictures';

/**
 * Service to take pictures and upload them 
 */
@Injectable({ providedIn: 'root' })
export class PictureService {
  constructor(private http: HttpClient) {}

  /**
   * Takes a picture, uploads it to the API, and returns the created image.

   */
  takeAndUploadPicture$(): Observable<Image> {
    // Take a picture.
    // This creates an observable of picture data.
    return this.takePicture().pipe(
      // Once the picture has been taken, upload it to the API.
      // This returns a new observable of the resulting Image object.

      switchMap((data) => this.uploadPicture(data.base64String)),
      // Once the picture has been uploaded, log a message to the console
      // indicating that all went well.
      // This does not change the observable stream and you can delete this
      // if you don't want to log the URL to the image
      tap((image) =>
        console.log(`Successfully uploaded picture to ${image.url}`)
      )
    );
  }

  /**
   * Launches the camera to take a picture.
   *
   * Returns an observable that will emit the raw picture data as a string
   * once the picture has been taken. An error may be emitted instead if the
   * user does not take a picture.
   */
  private takePicture(): Observable<Photo> {
    
    // Prepare camera options.
    const options: ImageOptions = {
      quality: 50,
      resultType: CameraResultType.Base64,
      // You could also user Photos (to select from the gallery)
      // or Prompt to let the user decide. Your choice.
      source: CameraSource.Camera,
    };

    // Start taking a picture.
    // The promise will be resolved when the user has snapped and validated the picture.
    // It may be rejected if the user does not take a picture.
    const pictureDataPromise = Camera.getPhoto(options);

    // Convert the promise to an observable and return it.
    return from(pictureDataPromise);
  }

  /**
  * Uploads raw picture data to the API.
   *
   * Returns an observable that will emit the created Image object.
 
   * An error may be emitted instead if the upload fails.
   */

  private uploadPicture(base64: string | ArrayBuffer): Observable<Image> {
    console.log(base64)
    const requestBody = {
      data: base64,
    };
    console.log(requestBody)
    const requestOptions = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
       
      },
    };
   
    return this.http.post<Image>(
      
      `${environment.apiUrl}/places/placeId/pictures`,
      requestBody,
      requestOptions
    );
    
  }

  uploadImage(image: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      this.http.post('your api endpoint', {image: imageData}, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      }).subscribe(response => {
        console.log(response);
       /*  this.imageUrl = response.dataUrl; */
      });
    };
    reader.readAsDataURL(image);
  }

  
}