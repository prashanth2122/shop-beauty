import { Injectable } from "@angular/core";
// import { MapsAPILoader } from "@agm/core";
import { Observable, Subject } from 'rxjs';
import {of,bindCallback} from 'rxjs'
declare const google: any;
@Injectable()
export class PlacePredictionService {
  public autocompleteService;

  // constructor(public mapsAPILoader: MapsAPILoader) {

  //   this.mapsAPILoader.load().then(() => {
  //     this.autocompleteService = new 
  //       google.maps.places.AutocompleteService();
  //   });

  // }

  // Wrapper for Google Places Autocomplete Prediction API, returns 
  observable

  getPlacePredictions(term: string): Observable<any[]> {
    return Observable.create(observer => {
    // API Call

    this.autocompleteService.getPlacePredictions({ input: term }, data => {
      let previousData: Array<any[]>;

      // Data validation

      if (data) {
        previousData = data;
        observer.next(data);
        observer.complete();
      }

      // If no data, emit previous data

      if (!data) {
        observer.next(previousData);
        observer.complete();

        // Error Handling

      } else {
        observer.error(status);
      }

    });

    });

    }
  }