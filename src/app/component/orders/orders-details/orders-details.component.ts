import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { OrderHistoryService } from '../orders.service';
import {SingletonService} from '../../../services/singleton.service';
import * as _ from "lodash";
@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  orderDetail:any;
  usSpecific:boolean;
  outofstock:boolean;
  outofstockMessage:any;
  isocode:string;
  picknmix6:string
  picknmix3:string
  baseSite:any;
  countrySite:string;
  constructor(
    public router: Router,
    public route :ActivatedRoute, 
    public singletonServ:SingletonService,
    private _orderHistoryService: OrderHistoryService ) {
      const baseSite = this.singletonServ.catalogVersion;
      this.countrySite=(baseSite.isoCode=="GB")?"Molton Brown UK":"Molton Brown "+baseSite.isoCode;
   }

  ngOnInit() {
    const that=this;
    const orderId = this.route.snapshot.queryParamMap.get("orderId");
    const baseSite=this.singletonServ.catalogVersion;
    this.baseSite=baseSite;
    this.isocode=baseSite.lngCode;
    if(baseSite.isoCode == "US"){
       this.usSpecific=true;
    }
    if(orderId){
      if(this.singletonServ.getStoreData(baseSite.reg)){
        const user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        if(user.token){
      this._orderHistoryService.getOrderHistoryDetailService(baseSite,user.token,user.email,orderId).subscribe((response)=>{
      if(response){
        this.setOrderDetails(response);
       }
      },(err:any)=>{
        if(err.error["errors"][0]['type']== "InsufficientStockError"){
            that.outofstock=true;
            that.outofstockMessage= err.error["errors"][0]['message'];
        }
      })
    }else{
      this._orderHistoryService.generateOrderToken(baseSite).subscribe(respose=>{
        const token = respose["access_token"];
        const user =JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
        user['token']=token;
        this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(user));
        this._orderHistoryService.getOrderHistoryDetailService(baseSite,user.token,user.email,orderId).subscribe((response)=>{
          if(response){
            this.setOrderDetails(response);
           }
          },(err:any)=>{
            if(err.error["errors"]){
            if(err.error["errors"][0]['type']== "InsufficientStockError"){
              that.outofstock=true;
              that.outofstockMessage= err.error["errors"][0]['message'];
            }
           }
          });


      },err=>{

      }) 
    }
    }
  }
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  onShowProductDtls(searchItem) {
    let url = "/store" + searchItem.url.replace("/p/", "/");
    this.router.navigate([url]);
  }

  setOrderDetails(data){
    const baseSite=this.singletonServ.catalogVersion;
    const cart=this.nestedCopy(data);
    if(cart.entries){
    const bundleNo =_.groupBy(cart.entries, 'bundleNo');
    const entries= _.filter(cart.entries, function(o
          ) {
              return (o.bundleNo==0);
          });
for(let k in bundleNo){
  if(k != '0'){
const bundle={
           product:bundleNo[k],
           bundleTemplateId:bundleNo[k][0]['bundleTemplateId'],
           bundleNo:bundleNo[k][0]['bundleNo'],
           bundlePrice:bundleNo[k][0]['bundlePrice'],
           quantity:1,
           isBundle:true
          }
          entries.push(bundle);
  }
}


   cart.entries=entries;
   cart.entries.sort((a,b)=>{
    return a.entryNumber - b.entryNumber;
  });
  }
  if (baseSite.isoCode != "DE") {
    if(cart.productTaxDE){
      delete cart.productTaxDE; 
    }
 }
  this.orderDetail=cart;
  }

  getBundleContent(text){
    const baseSite=this.singletonServ.catalogVersion;
    if(baseSite.isoCode == "DE"){
     this.picknmix6="Pick & Mix für die Reise x 6";
     this.picknmix3="Pick & Mix für die Reise x 3";
 
    }
    else{
     this.picknmix6="Pick & Mix Travel x 6";
     this.picknmix3="Pick & Mix Travel x 3";
    }
    if (text.bundleTemplateId.indexOf("6") != -1) {
      return this.picknmix6;
    } else   if (text.bundleTemplateId.indexOf("3") != -1) {
      return  this.picknmix3;
    } else {
      return "Fragrance Finder Samples";
    }
   return  this.picknmix3;
  }
  getProdPrice(entry){
    if(entry.product.price){

      if(entry.product.price.value !=0){
        return entry.product.price.formattedValue
      } else{
          return 'FREE'
      }

    }else{
      
      if(entry.totalPrice.value !=0){
        return entry.totalPrice.formattedValue
      }else{ 
        return 'FREE';
      }

    }
  }
  getTotalPrice(entry){
    if(entry.totalPrice.value !=0){return entry.totalPrice.formattedValue}else{ return 'FREE'}
  }
  getBundlePrice(data){
    const _bundlePrice= data.product.filter((obj)=>{
      return obj.product.isSample
    });
    if(_bundlePrice.length !=0){
      return _bundlePrice[0]['basePrice']['formattedValue'];
    }
  }
  getBundleTotalPrice(data){
    const _bundlePrice= data.product.filter((obj)=>{
      return obj.product.isSample
    });
    if(_bundlePrice.length !=0){
      return _bundlePrice[0]['totalPrice']['formattedValue'];
    }
  }

  getPixMixImage(entry) {
    if (entry.bundleTemplateId) {
      if (entry.bundleTemplateId.indexOf("6") != -1) {
        return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel6_uk_pick-mix-travel-6_image_01?$smallImg$&amp;fmt=webp";
      } else if (entry.bundleTemplateId.indexOf("3") != -1)  {
        return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=webp";
      }else{
        return "https://media.moltonbrown.co.uk/i/moltonbrown/FFDummySKU_uk_Fragrance-Finder-Samples_image_01?$thImg$&fmt=webp"
      }
    }
    return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=webp";
  }
  getPixMixImageJpg(entry){
    if(entry.bundleTemplateId){
      if(entry.bundleTemplateId.indexOf('6') !=-1 ){
        return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel6_uk_pick-mix-travel-6_image_01?$smallImg$&amp;fmt=jpg"
      }else if(entry.bundleTemplateId.indexOf('3') !=-1 ){
        return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=jpg"
      }else{
        return "https://media.moltonbrown.co.uk/i/moltonbrown/FFDummySKU_uk_Fragrance-Finder-Samples_image_01?$thImg$&fmt=jpg"
      }
    }
      return "https://media.moltonbrown.co.uk/i/moltonbrown/PickMixTravel3_uk_pick-mix-travel-3_image_01?$smallImg$&amp;fmt=jpg"
    
   }
  onRepeatOrder(event){
  const baseSite=this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
      const _user=JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if(_user.code){
        this._orderHistoryService.repeatOrder(baseSite,_user.token,_user.email,this.orderDetail.code,_user.code).subscribe((response)=>{
          this.singletonServ.sendMessage({updateCart:true});
          this.router.navigate(["store", "mbcart"]);
        },err=>{

        }); 
      }else{
        this._orderHistoryService.generateCartId(baseSite,_user.token,_user.email).subscribe((data)=>{
          this.singletonServ.sendMessage({updateCart:true});
          _user['code']= data['code'];
          _user['guid']=data['guid'];
          this.singletonServ.setStoreData(baseSite.reg,JSON.stringify(_user));
          this._orderHistoryService.repeatOrder(baseSite,_user.token,_user.email,this.orderDetail.code,_user.code).subscribe((response)=>{
        
            this.router.navigate(["store", "mbcart"]);
          },err=>{
  
          }); 
        },err=>{

        });
      }
    }
  }


}
