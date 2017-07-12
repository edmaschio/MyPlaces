import { Component } from '@angular/core';
import { IonicPage, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { Geolocation } from "@ionic-native/geolocation";
import { Camera, CameraOptions } from '@ionic-native/camera';

import { SetLocationPage } from "../set-location/set-location";
import { Location} from "../../models/location";

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  location: Location = {
    lat: -21.0,
    lng: -47.0
  };

  locationIsSet = false;

  constructor(private modalCtrl: ModalController,
              private geolocation: Geolocation, 
              private loadingCtrl: LoadingController, 
              private toasCtrl: ToastController, 
              private camera: Camera ) {}

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
          console.log(this.location);
        }
      }
    );
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Buscando sua localização...'
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then(
        location => {
          loader.dismiss();
          this.location.lat = location.coords.latitude;
          this.location.lng = location.coords.longitude;
          this.locationIsSet = true;
        }
      )
      .catch(
        error => {
          loader.dismiss();
          const toast = this.toasCtrl.create({
            message: 'Não foi possível obter sua localização. Por favor selecione manualmente!',
            duration: 2500
          });
          toast.present();
        }
      );
  }

  onTakePhoto() {
    const options: CameraOptions = {
      quality: 100, 
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then(imageData => {
      console.log(imageData);
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }).catch(
      err => {
        console.log(err);
      }
    );
  }

}
