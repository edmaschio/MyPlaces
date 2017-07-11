import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Location } from "../../models/location";

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {

  location: Location;
  marker: Location;

  locationIsSet = false;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.location = this.navParams.get('location');
    this.locationIsSet = this.navParams.get('isSet');

    if (this.locationIsSet) {
      this.marker = this.location;
    }
  }

  onSetMarker(event: any) {
    this.marker = new Location(event.coords.lat, event.coords.lng);
    this.locationIsSet = true;
  }

  onConfirm() {
    this.viewCtrl.dismiss({location: this.marker});
  }

  onAbort() {
    this.viewCtrl.dismiss();
  }

}
