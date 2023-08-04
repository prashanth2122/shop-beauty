import { Component, OnInit,OnChanges, SimpleChange,Output, EventEmitter,HostListener,Input,ElementRef, ViewChild } from "@angular/core";
import { SingletonService } from "../../services/singleton.service";
import { PickMixTravelComponentService } from "../pick-mix-travel.service";
import { Location } from "@angular/common";
import { Router} from "@angular/router";
import { GtmMethodService } from '../../services/gtmmethods.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
@Component({
  selector: "app-pick-buy",
  templateUrl: "./pick-buy.component.html",
  styleUrls: ["./pick-buy.component.scss"]
})
export class PickBuyComponent implements OnInit, OnChanges {
  @Input() collection:Array<any>;
  @ViewChild("bagform") bagform: ElementRef;
  @Output()  onChangeCollection: EventEmitter<any> = new EventEmitter<any>();
  products:Array<any>;
  allItems:any;
  totalPackPrice:string;
  bag:boolean;
  infoPopup:boolean=false;
  disableAction:boolean;
  @HostListener('document:click')
  checkout() {
    if(this.products){
      if(this.infoPopup){
      this.products.map((obj)=>{
          obj['selected']=false;
      });
    }
    }
  }
  pickForm: FormGroup;
  constructor(
    public singletonServ: SingletonService,
    public pickMixServ:PickMixTravelComponentService,
    public location: Location,
    public router: Router,
    public gtmServ:GtmMethodService,
    private fb: FormBuilder
    ) {
       this.pickForm = this.fb.group({pick:['noBag']});
  }

  ngOnInit() {
    const travelBag = '';
    this.gtmServ.gtmSetPickandMixSteps("Pack & Buy",travelBag);
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["collection"]) {
      if (changes["collection"]["currentValue"] != undefined) {
        const _data=changes.collection.currentValue.data;
        this.totalPackPrice=changes.collection.currentValue.price;
        const _arr = this.nestedCopy(_data);
        this.allItems= this.nestedCopy(_data);
        this.products= _arr.filter((obj)=>{
          return obj.selection
        });
        if(this.products.length === 6) {
          this.products.map((obj,i)=>{
              if(i==0 || i==1){
                obj['left'] = true; 
              } else if(i==4 || i==5){
                obj['right'] = true;
              }
          });
        }
      }
    }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
}
  onEditPick() {
    const _obj={
      data:this.allItems,
      packPrice:this.totalPackPrice
    }
    this.onChangeCollection.emit(_obj);
  }

  onAddToBasket(event){  
    event.preventDefault();
    const baseSite = this.singletonServ.catalogVersion;
    const _val =this.pickForm.value;
    const _obj={
      "productcodes":[],
      "isBag":(_val.pick =='Bag')?true:false
      }
      this.products.map((obj,k)=>{
      _obj['productcodes'].push(obj.code);
      
    });
    this.disableAction=true;
    if(this.singletonServ.getStoreData(baseSite.reg)){
            const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));           
            if(_user.code){
              this.addBundleToBasket(_user.token,_user.email,_user.code,_obj);
            } else{
              this.addBundleEmptyCart(_user.email,_obj);
            }   
  }else{
    if(this.singletonServ.getStoreData(baseSite.guest)){
      const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      if(_user.guid){
       this.addBundleToBasket(_user.token,'anonymous',_user.guid,_obj); 
      } else{
        this.addBundleEmptyCart('anonymous',_obj);
      } 
   }else{
    this.addBundleEmptyCart('anonymous',_obj);
   }
}



  }
  addBundleEmptyCart(email,obj){
    const that=this;
    const _emptyObj={}
    const baseSite = this.singletonServ.catalogVersion;
        that.pickMixServ.generateToken(baseSite).subscribe((response)=>{
      const token =  response['access_token'];
    this.pickMixServ
    .creatEmptyCart(baseSite,token, _emptyObj, email)
    .subscribe(
      cart => {
        if(this.singletonServ.getStoreData(baseSite.reg)){
          const _user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          _user['code']=cart['code'];
          _user['token']=token;
          this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
          that.addBundleToBasket(token,_user.email,cart['code'],obj); 
        }else{
          const _user={code:''}
          _user['code']=cart['code'];
          _user['guid']=cart['guid'];
          _user['token']=token;
          this.singletonServ.setStoreData(baseSite.guest,JSON.stringify(_user));
          that.addBundleToBasket(token,'anonymous',cart['guid'],obj);  
        
      }
      })
      },err=>{

});
  }
  addBundleToBasket(token,email,code,_obj){
   const that= this;
   const baseSite = this.singletonServ.catalogVersion;
    that.pickMixServ.addBundleToCart(baseSite,token,email,code,_obj).subscribe((resp)=>{
      const obj = { updateCart: true };
      that.singletonServ.sendMessage(obj);
      if(this.singletonServ.getStoreData(baseSite.reg)){
        if( this.singletonServ.getStoreData(baseSite.regPickMix)){
            this.singletonServ.removeItem(baseSite.regPickMix);
        }
     }else{
           if(this.singletonServ.getStoreData(baseSite.guestPickMix)){
              this.singletonServ.removeItem(baseSite.guestPickMix);
          }
     }
      const gtmTravelBag = _obj;
      const travelBagAdded = gtmTravelBag.isBag;
      this.gtmServ.gtmSetPickandMixSteps("pick and mix basket",travelBagAdded);
      that.disableAction=false;
      that.router.navigate(["store", "mbcart"]);
  },(err)=>{
    this.disableAction=false;
  })  
  }
  showTooltip(event,code,k){
    event.stopPropagation();
    event.preventDefault();
    let _arr=this.nestedCopy(this.products);
    this.infoPopup=true;
    _arr.map((obj,id)=>{      
      if((obj.code==code)&&(id==k)){ 
         obj['selected']=  !obj['selected'];
      }else{
        obj['selected']=  false;
      }
    });
    this.products=_arr;
  }
}
