import {
    Component,
    OnInit,
    EventEmitter,
    ViewEncapsulation,
    Output,
    ViewChild,
    ElementRef,
    NgZone
  } from "@angular/core";
  import { StorePointComponentService } from "./storepoint.service";
  import * as _ from "lodash";
  import { SingletonService } from "../../../services/singleton.service";
  import { ShipmentForm } from '../../../forms/shipmentForm.form';
  import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
  import { TranslateServiceSubService } from "../../../pipe/translate-service-sub.service";  
  import { GtmMethodService } from '../../../services/gtmmethods.service';
  declare const google: any;
  declare var conv_clickCollect_viewList:number; 
  declare var conv_clickCollect_mapView:number;
  declare var _conv_q:any; 

  @Component({
    selector: "app-storepoint",
    templateUrl: "./storepoint.component.html",
    styleUrls: ["./storepoint.component.scss"],
    encapsulation: ViewEncapsulation.None
  })
  export class StorepointComponent implements OnInit {
    storePointForm:FormGroup;
    listView: boolean;
    mbPointOfServices: any;
    pointOfServices: any;
    storesList: Array<any> = [];
    emptyStores:boolean;
    pointService: boolean;
    mbpointService: boolean;
    showStores: boolean;
    postCode: string;
    submitted:boolean;
    addressData:any;
    openHourWindow:any;
    renderPost:boolean;
    mbStores:boolean;
    loadGMscript:boolean;
    storeLoad:boolean;
    storeInfo:any;
    ukSite:boolean;
    @Output() selectedStore: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("search") searchElementRef: ElementRef;
    storeTypeList=[
      {
        name:'Molton Brown Stores - <strong> FREE </strong>(1-4 working days)',
        sortBy:'MBSTORES',
        img:"https://www.moltonbrown.co.uk/MBExternalBinary/DeliveryServiceimages/mb-cc.png",
        checked:true
      },
      {
        name:'Local collection points - £3.95 or <strong>FREE</strong> over £49 (2-3 working days)',
        sortBy:'GFSSTORE',
        img:"https://www.moltonbrown.co.uk/MBExternalBinary/DeliveryServiceimages/DPD-cc.png",
        checked:true
      }];
    constructor(
      public singletonServ: SingletonService,
      public storeServ: StorePointComponentService,
      private zone: NgZone,
      public shipmentForm:ShipmentForm,
      private fb: FormBuilder,
      private translate: TranslateServiceSubService,
      public gtmServ:GtmMethodService,
      private el: ElementRef
    ) {
      this.storePointForm = this.fb.group(shipmentForm.storePoint());
      this.listView = true;
      this.showStores = false;
      this.emptyStores=false;
      this.pointService=true;
      this.mbpointService=true;
    }
  
    ngOnInit() {
       const that=this;
       let checkExist = setInterval(function() {
        if (typeof google === 'object' && typeof google.maps === 'object') {
          that.loadGMscript=true;
           clearInterval(checkExist);
        }
     }, 100);
       const gfsData=this.singletonServ.gfsData;
       const baseSite:any=this.singletonServ.catalogVersion;
       if(baseSite.isoCode == "GB"){
         this.ukSite=true;
       }else{
        this.ukSite=false;
       }
       if(gfsData){
        that.emptyStores=false;
        that.showStores=true;
        that.storesList = gfsData.stores;
        that.storeTypeList=gfsData.storeTypeList;
        this.storePointForm.controls['zipcode'].patchValue(gfsData.postCode);
        }  
        if(baseSite){
          this.setLang(baseSite.lngCode);
        }
     }
     setLang(lang: string) {
      this.translate.use(lang);
    }
    setAddress(addrObj) {
      const that = this;
      const _input=this.searchElementRef.nativeElement.value; 
      this.storeLoad=true;
      this.zone.run(() => {
        this.searchElementRef.nativeElement.blur();
        that.storePointForm.controls['zipcode'].patchValue(_input);
        that.postCode = addrObj.postal_code;
        this.addressData=addrObj;
        const _obj={
          postCode:addrObj.postal_code,
          latitude:addrObj.latitude,
          longitude:addrObj.longitude
       } 
    
       if(_obj.postCode){
          that.showGfS(_obj);
        } else  {
          that.getPostCodeByLatLng(addrObj.latitude,addrObj.longitude,addrObj.postal_code);
        }
      });
    }

        onFocus(){
          this.emptyStores=false;
        }
  
  
    emitselectedStore(data) {
      this.selectedStore.emit(data);
    }
    onChangePostcode(event){
      this.emptyStores=false;
    }
    onSearchKeyDown(event) {
      this.emptyStores=false;
     if (event.key === "Enter" ) {
        event.target.blur();
        if(this.storePointForm.valid){
          this.storePointForm.controls['zipcode'].patchValue(event.target.value);
          this.storeLoad=true;
          this.onPostCodeClick(event);
        }
      }
   }
   
    onPostCodeClick(event) {      
      event.preventDefault();  
      const that=this;  
      if(this.storePointForm.valid){
        conv_clickCollect_viewList=1;
        _conv_q = _conv_q || [];
        _conv_q.push(["run","true"]);
    
        const geocoder = new google.maps.Geocoder();
        const _input=this.storePointForm.value.zipcode;  
        this.storesList=[];      
        geocoder.geocode( { 'address': _input}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {   
          if(results.length !=0){
                const _obj={
                  postCode:_input,
                  latitude:results[0].geometry.location.lat(),
                  longitude:results[0].geometry.location.lng()
                }
                const data = results.filter((obj)=>{
                  return  obj['types'][0] =="postal_code"       
                });
                if(data.length !=0){
                  for (let i = 0; i < data.length; i++) {
                    if (data[i]['types'][0] =="postal_code" ) {
                      
                      const _obj={
                        latitude:data[i].geometry.location.lat(),
                        longitude:data[i].geometry.location.lng()
                     } 
                     const _postCoder= data[i].address_components.filter((obj)=>{
                       return  obj['types'][0] =="postal_code"       
                     });
                     if(_postCoder.length !=0){
                        _obj['postCode']=_postCoder[0]['short_name'];
                     }
                      that.storeLoad=true;
                      that.showGfS(_obj);  
                      break;
                    }
                  }
                } else {
                  that.getPostCodeByLatLng(results[0].geometry.location.lat() ,results[0].geometry.location.lng(),_input);
                }
              }	 else { 
                that.storeLoad=false;
                that.emptyStores=true;
                that.storesList=[];
              }     
          } else {  
              that.storeLoad=false;       
              that.emptyStores=true;
              that.storesList=[];
          }
        });     
        that.submitted = true;   
    } else {
      that.validateAllFormFields(that.storePointForm); 
      setTimeout(()=>{              
        this.setCheckFormFocus(that.storePointForm);
      });
    }
    }
  
    getPostCodeByLatLng(lan ,longe,postal_code) {
      const that=this;
      const latlng = new google.maps.LatLng(lan,longe);
      const geocoderrr = new google.maps.Geocoder();
      that.storeLoad=true;
      geocoderrr.geocode({'latLng': latlng}, function(results1, status) {
          if (status == google.maps.GeocoderStatus.OK) {
           const data = results1.filter((obj)=>{
             return  obj['types'][0] =="postal_code"       
            });
            if(data.length !=0){
              for (let i = 0; i < data.length; i++) {
                if (data[i]['types'][0] =="postal_code" ) {
                  
                  const _obj={
                    latitude:data[i].geometry.location.lat(),
                    longitude:data[i].geometry.location.lng()
                 } 
                 const _postCoder= data[i].address_components.filter((obj)=>{
                   return  obj['types'][0] =="postal_code"       
                 });
                 if(_postCoder.length !=0){
                    _obj['postCode']=_postCoder[0]['short_name'];
                 }else{
                  _obj['postCode']=postal_code;
                 }
                  that.storeLoad=true;
                  that.showGfS(_obj);  
                  break;
                }
              }
      
           } else {
             that.storeLoad=false;
             that.emptyStores=true;
             that.storesList=[];
           }
       }else{
        that.storeLoad=false;
        that.emptyStores=true;
        that.storesList=[];
       }
          if (status == "ZERO_RESULTS") {
           that.emptyStores=true;
           this.storeLoad=false;
           that.storesList=[];
          }
        });
}


    showGfS(storeInfo) {
      const baseSite = this.singletonServ.catalogVersion;
      this.storeInfo=storeInfo;
      this.storesList=[];
      this.mbPointOfServices=[];
      this.pointOfServices=[];
      this.storeLoad=true; 
      if (this.singletonServ.getStoreData(baseSite.reg)) {
        const data = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        this.getGfsData(data.token,data.email,data.code, storeInfo);  
      } else {      
        if (this.singletonServ.getStoreData(baseSite.guest)) {
          const data = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
          this.getGfsData(data.token,'anonymous',data.guid, storeInfo);
        }
      }
    }

    getGfsData(token,email,code, storeInfo){
      const that=this;
      this.showStores = false;
      const baseSite=this.singletonServ.catalogVersion;
      this.storeServ.getGFSData(baseSite,token,email,code, storeInfo).subscribe(
        resp => {
          that.storeLoad=false;
          that.mbStores=true;     
          const stores =_.filter(resp['pointOfServices'], function(o) {             
            return (o.storeType =='MBSTORES' ||o.storeType =='GFSSTORE');           
          });
          stores.map((obj,k) => {
            const  storeAssetInfo=that.getImageIcon(obj['storeType']);
            obj["storeIcon"]=storeAssetInfo.image;
            obj["iconUrl"]=storeAssetInfo.icon;
            obj['address']['id']='GFSSTORE'+k; 
          });
          stores.sort((a,b)=>{
            if (a['storeType'] > b['storeType']) {
              return -1;
          }
          if (b['storeType'] > a['storeType']) {
              return 1;
          }
          return 0;
        });
        that.storeTypeList.map((item)=>{
          if(item.sortBy=='MBSTORES'){
              const _mbStoreData= stores.filter((_obj)=>{
                return _obj.storeType=='MBSTORES'
            }); 
            item['stores']=_mbStoreData;
            if(that.storesList){
              item['checked']=(_mbStoreData.length !=0)?true:false;
            }
          }else {
            const _GfsStoreData= stores.filter((_obj)=>{
                return _obj.storeType=='GFSSTORE'
            }); 
            item['stores']=_GfsStoreData;
            if(that.storesList){
              item['checked']=(_GfsStoreData.length !=0)?true:false;
            }
          }
      });  
      that.getStores(stores,storeInfo);        
        },
        (err:any) => {
          that.storeLoad=false;
          that.storesList=[]; 
          if(err.error){
            if(err.error["errors"]){
              if(err.error["errors"][0]){
                if(err.error["errors"][0]['type']== "InvalidTokenError") {
                  that.storeServ.generateCartToken(baseSite).subscribe(
                    (resp:any) => {
                            const user=JSON.parse(that.singletonServ.getStoreData(baseSite.guest));
                            user.token= resp["access_token"];
                            that.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                            that.getGfsData(resp["access_token"],email,code, storeInfo);                        
                        });
                }else  if(err.error.errors[0]['message']=="No sotres found"){
                  that.mbStores=false;
                  that.emptyStores=true;
                  that.storesList=[];
                }
              }
              }
             }   

        }
      );
    }


    getImageIcon(_storeType){
      
      if(_storeType =='MBSTORES'){
     const _obj={
         image: "../../../../assets/imgs/mb-cc.png",
         icon:{
         url: "../../../../assets/imgs/MBstore_pinicon.png",
         scaledSize: {
           height: 56,
           width: 47
         }}
         
     }
        return _obj
      }else if(_storeType =='GFSSTORE'){
       const _obj={
         image:'../../../../assets/imgs/DPD-cc.png',
         icon:{
         url: "../../../../assets/imgs/DPD-cc.png",
         scaledSize: {
           height: 40,
           width: 40
         }
        }
     }
        return _obj
      }

    }
      
    getStores(stores,storeInfo){
      const _input=this.searchElementRef.nativeElement.value; 
      // let actionCarriedOut = 'Search Store';
      // let storedetails = _input;
      // this.gtmServ.gtmStoreLocator(actionCarriedOut,storedetails); 
      if(stores){
            this.storesList = stores;
            this.emptyStores=false;
            this.showStores=true;
      }
      this.singletonServ.gfsData={
        storeInfo:storeInfo,
        storeTypeList:this.storeTypeList,
        postCode:this.storePointForm.controls['zipcode'].value
      }
      this.singletonServ.gfsData['stores']=(stores)?stores:[];
    }
    onShowStoreList(bol) {
      if(bol == false){
        conv_clickCollect_mapView=1;
        _conv_q = _conv_q || [];
        _conv_q.push(["run","true"]);
      }
      this.listView = bol;
    }

    checkMBStores(event,data,k){  
      event.preventDefault();
      const that=this;
      this.storeTypeList[k]['checked']=event.target.checked;
      if(event.target.checked){
         const _list= _.unionBy(that.storesList, data.stores);
        _.uniq(_list);
        _list.sort((a,b)=>{
          if (a['storeType'] > b['storeType']) {
            return -1;
        }
        if (b['storeType'] > a['storeType']) {
            return 1;
        }
        return 0;
      });
        that.storesList=_list;
       }else{
        that.storesList = that.storesList.filter(function( obj ) {
           return data.sortBy !== obj.storeType;
         });
         that.storesList.sort((a,b)=>{
          if (a['storeType'] > b['storeType']) {
            return -1;
        }
        if (b['storeType'] > a['storeType']) {
            return 1;
        }
        return 0;
      });
       }
     }

    onShowMapsOpenHour(data){
      this.listView=false;
      this.openHourWindow=data;
   }
   setCheckFormFocus(form){
    const formGroupInvalid = this.el.nativeElement.querySelectorAll('.has-error');
    if(formGroupInvalid.length !=0){
      (<HTMLInputElement>formGroupInvalid[0]).focus();
         this.validateAllFormFields(form);
       }
  }
    
  validateAllFormFields(formGroup: FormGroup) {        
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {      
        this.validateAllFormFields(control);            
      }
    });
}
}
