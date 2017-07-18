import { Place } from "../models/place";
import { Location } from "../models/location";

export class PlacesService {
    private places: Place[] = [];

    addPlace(title: string, descriprion: string, location: Location, imageUrl: string) {
        const place = new Place(title, descriprion, location, imageUrl);
        this.places.push(place);
    }

    loadPlaces() {
        return this.places.slice();
    }
}