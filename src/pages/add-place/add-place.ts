import { Component } from '@angular/core';
import { IonicPage, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { Geolocation } from "@ionic-native/geolocation";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';

import { SetLocationPage } from "../set-location/set-location";
import { Location } from "../../models/location";
import { PlacesService } from "../../services/places";

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
  imageUrl = '';

  constructor(private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toasCtrl: ToastController,
    private camera: Camera,
    private placesService: PlacesService,
    private file: File) { }

  onSubmit(form: NgForm) {
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    this.location = {
      lat: -21.0,
      lng: -47.0
    };
    this.imageUrl = '';
    this.locationIsSet = false;
    form.reset;
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, { location: this.location, isSet: this.locationIsSet });
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

    this.camera.getPicture(options)
      .then(imageData => {
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';
        this.file.moveFile(path, currentName, this.file.dataDirectory, newFileName)
          .then(
            (data: Entry) => {
              this.imageUrl = data.nativeURL;
              this.camera.cleanup();
              // this.file.removeFile(path, currentName);
            }
          )
          .catch(
          (err: FileError) => {
            this.imageUrl = '';
            const toast = this.toasCtrl.create({
              message: 'Não foi possível salvar a imagem. Por favor, tente novamente',
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          }
          );
        this.imageUrl = imageData;
      }).catch(
      err => {
        this.imageUrl = '';
        const toast = this.toasCtrl.create({
          message: 'Não foi possível obter a imagem. Por favor, tente novamente',
          duration: 2500
        });
        toast.present();
        this.camera.cleanup();
      }
      );
  }

}
