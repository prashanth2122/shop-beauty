import { Directive, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
declare const google: any;
@Directive({
  selector: '[googlePlaces]'
})
export class GooglePlacesDirective implements AfterViewInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;

  constructor(elRef: ElementRef) {
    //elRef will get a reference to the element where
    //the directive is placed
    this.element = elRef.nativeElement;
  }

  getFormattedAddress(place) {
    //@params: place - Google Autocomplete place object
    //@returns: location_obj - An address object in human readable format
    let location_obj = {};
    for (let i in place.address_components) {
      const item = place.address_components[i];
      location_obj['latitude']=place.geometry.location.lat();
      location_obj['longitude']=place.geometry.location.lng();
     location_obj['formatted_address'] = place.formatted_address;
      if(item['types'].indexOf("locality") > -1) {
        location_obj['locality'] = item['long_name']
      } else if (item['types'].indexOf("administrative_area_level_1") > -1) {
        location_obj['admin_area_l1'] = item['short_name']
      } else if (item['types'].indexOf("street_number") > -1) {
        location_obj['street_number'] = item['short_name']
      } else if (item['types'].indexOf("route") > -1) {
        location_obj['route'] = item['long_name']
      } else if (item['types'].indexOf("country") > -1) {
        location_obj['country'] = item['long_name']
      } else if (item['types'].indexOf("postal_code") > -1) {
        location_obj['postal_code'] = item['short_name']
      }  else if(item['types'].indexOf("geometry") > -1){

      }
     
    }
    return location_obj;
  }

  ngAfterViewInit() {
    const that=this;
    let checkExist = setInterval(function() {
      if (typeof google === 'object' && typeof google.maps === 'object') {
        that. constructGoogleAutocomplete();
         clearInterval(checkExist);
      }
    },100);
  }
  constructGoogleAutocomplete(){
    const that=this;
    const autocomplete = new google.maps.places.Autocomplete(this.element);
    //Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', (event) => {
    //Emit the new address object for the updated place
    const _query = that.getFormattedAddress(autocomplete.getPlace());
    if(Object.keys(_query).length !=0){
      that.onSelect.emit(_query);
     }
  });
  }

}
