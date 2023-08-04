import { Inject,Injectable, NgZone,PLATFORM_ID, RendererFactory2, ViewEncapsulation  } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { SCREEN_SIZE } from './screen-size.enum';
import * as _ from "lodash";
declare var window: any;
declare var $:any;
declare var crl8:any;
@Injectable()
export class SingletonService {
  basketTab:boolean;
  sampleTab:boolean;
  checkOutTab:boolean;

  welcomeTab:boolean;
  shippingTab:boolean;
  confirmationtab:boolean;
  
  private subject = new Subject<any>();
  sessionStarts:boolean;
  menudata: Array<any>;
  mbStores:Array<any>;
  gfsData:any;
  loggedIn: boolean = false;
  cartCount: number;
  checkoutStatus: boolean;
  totalAmount: any;
  googleScriptKey:string="https://maps.googleapis.com/maps/api/js?libraries=geometry,places&key=AIzaSyDHfkdOsaMspf8lm0fNW_GyGb7MdAM5gs0";
  catalogVersionId: string = "moltonbrown-gb";
  catalogVersion: any;
  cartObj: any;
  userDetail:any;
  confirmOrderObj: any;
  giftObj: any;
  favourites: Array<any>;
  cartStatus: boolean;
  storeDetail: any;
  pickPackCategories:any;
  footerLinks:any;
  homepage:any;
  cardList:Array<any>;
  cardData:any;
  myMessage = new Subject<string>();
  appLocaleData:any;
  portalStoreName:string;
  redirectUrl:string;
  captchaCode:any;
  interval:any;
  facets:Array<any>;
  giftWithcardForm:FormGroup;
  giftcardForm:FormGroup;
  giftBoxWithMessageForm:FormGroup;
  sizes = [
    {
      id: SCREEN_SIZE.XS, name: 'xs',
      css: `d-block d-sm-none`
    },
    {
      id: SCREEN_SIZE.SM, name: 'sm',
      css: `d-none d-sm-block d-md-none`
    },
    {
      id: SCREEN_SIZE.MD, name: 'md',
      css: `d-none d-md-block d-lg-none`
    },
    {
      id: SCREEN_SIZE.LG, name: 'lg',
      css: `d-none d-lg-block d-xl-none`
    },
    {
      id: SCREEN_SIZE.XL, name: 'xl',
      css: `d-none d-xl-block`
    },
  ];
  constructor(
     @Inject(PLATFORM_ID) public platformId: Object,   
     @Inject(DOCUMENT) public dom,
     public zone: NgZone,
     public router: Router,
     private rendererFactory: RendererFactory2,
     private cookieService: CookieService
     ) {
     window.angularComponentRef = {
      zone: this.zone,
      componentFn: value => this.updateCart(value),
      component: this
    };
  }
  openInNextPage(url){
    // this.window.open(url);
  }
  sessionExpired(){
    this.alarmTime =undefined;
    localStorage.clear();
    this.setStoreData("prefered_lng", JSON.stringify(this.catalogVersion));
    this.router.navigate(['store','global',"sessionExpired"]);
   }
  createCaptcha(id){
    this.dom.getElementById(id).innerHTML = "";
    var charsArray ="6LcNKZ0UAAAAAKbLLIOM2xNQ6pfgURd_0GlBUgIZ";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Charthis.acters
      var index = Math.floor(Math.random() * charsArray.length + 1); //get the next charthis.acter from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = this.dom.createElement("canvas");
    canv.id = "captcha";
    canv.width = 100;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "25px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    this.captchaCode=captcha.join("");
    this.dom.getElementById(id).appendChild(canv);
  }
  setCrossDomainCookie(cname,cvalue,query) {
    this.cookieService.set(cname,cvalue,24,'/',query);
    // this.dom.cookie = cname+'='+cvalue+';path=/;domain='+query;
    // this.dom.cookie = [
    //   cname,
    //   "=",
    //   JSON.stringify(cvalue),
    //   "; domain=",
    //   query,
    //   "; path=/;"
    // ].join("");
  }
  setCookie(cname, cvalue) {
    this.dom.cookie = [
      cname,
      "=",
      JSON.stringify(cvalue),
      "; domain=.",
      window.location.host,
      "; path=/;"
    ].join("");
  }
  getCrossDomainCookie(cname) {
    const name = cname + "=";
    const ca = this.dom.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  getCookie(cname) {
    const name = cname + "=";
    const ca = this.dom.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  clearItem() {
    localStorage.clear();
  }

  removeItem(name) {
    localStorage.removeItem(name);
  }
  setStoreData(name,obj) {
    localStorage.setItem(name,obj);
  }
  clearToken(name){
     if(localStorage.getItem(name)){
       if(this.catalogVersion['guest'] == name){
         localStorage.removeItem(name); 
         this.router.navigate(['store','global','sessionExpired']);
       } else{
        if(this.catalogVersion['reg'] == name){
          const _user= JSON.parse(localStorage.getItem(name)); 
          delete _user.token;
          localStorage.setItem(name,JSON.stringify(_user));
          this.router.navigate(['store','global','sessionExpired']);
        }
       }
     }
  }
  scrollToTarget(id){
    $('html,body').animate({
      scrollTop: $(id).offset().top
    },{
      duration: 'slow',
      easing: 'swing'
    });
  }
  scrollToDeliverytarget(id){
    $('html, body').animate({
      scrollTop: $(id).offset().top-15
    }, 100);
  }
  
  
  scrollToTargetFindStoreElement(id){
    const _pos=$(id).offset().top - 1.5;
    $('html, body').animate({
      scrollTop: _pos
    },1000);
  }
  scrollToTargetElement(id){
    $('html, body').animate({
      scrollTop: $(id).offset().top - 200
    }, 500);
  }
  scrollToElWithinC(container,id){
    if($(container)[0]){

          const _elmnt=$(id).offset();
          $(container).animate({
            scrollTop: $(container).scrollTop() + _elmnt.top - $(container).offset().top
          }, {
            duration: 'slow',
            easing: 'swing'
          });

    }
  }

  getStoreData(name){
    if(localStorage.getItem(name)){
    return localStorage.getItem(name);
   }else{
    //  return this.getCookie(name);
   }
  }
  updateCart(value) {
    const that = this;
    if (value == "updateCart") {
      that.sendMessage({
        updateCart: true,
        showCartPopUp: true
      });
    }
  }
  sendMessage(message: any) {
    if (message.siteid) {
      this.catalogVersionId = message.siteid;
    } else {
      this.subject.next(message);
    }
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }

  setupEntryStream(data){
    let cart=this.nestedCopy(data);
    cart['bundles']=[];
    if(cart.entries){
    const bundleNo =_.groupBy(cart.entries, 'bundleNo');
    const entries= _.filter(cart.entries, function(o
          ) {
              return (o.bundleNo==0);
          });
        for(let k in bundleNo){
        if(k != '0'){
          const _entryNumber:any=_.maxBy(bundleNo[k], function(o) { return o.entryNumber; });
          if(bundleNo[k][0]['bundleTemplateId']== "Pick And Mix_Pick2" || bundleNo[k][0]['bundleTemplateId'].indexOf("2") !=-1){
              const bundle={
                entryNumber:_entryNumber.entryNumber,
                product:bundleNo[k],
                bundleTemplateId:bundleNo[k][0]['bundleTemplateId'],
                bundleNo:bundleNo[k][0]['bundleNo'],
                bundlePrice:bundleNo[k][0]['bundlePrice'],
                isBundle:true,
                giveAway:true,
                fragrance:true
                };
                bundle['stock']= (this.getBundleStock(bundle))?this.getBundleStock(bundle):{stockLevelStatus:'inStock'};
              if(bundle.bundleTemplateId){
                  bundle['quantity']=_entryNumber.quantity ;
              } 
              entries.push(bundle);
          } else {
            const bundle={
              entryNumber:_entryNumber.entryNumber,
              product:bundleNo[k],
              bundleTemplateId:bundleNo[k][0]['bundleTemplateId'],
              bundleNo:bundleNo[k][0]['bundleNo'],
              bundlePrice:bundleNo[k][0]['bundlePrice'],
              isBundle:true
              }
              bundle['stock']= (this.getBundleStock(bundle))?this.getBundleStock(bundle):{stockLevelStatus:'inStock'};
            if(bundle.bundleTemplateId){
              const _products=bundle.product.filter((obj)=>{
                return !obj.product.isSample;
              })
                if(bundleNo[k][0]['bundleTemplateId'].indexOf("3") !=-1){
                  bundle['quantity']=this.getBundleQuantity(_products)/3;
                }else if(bundleNo[k][0]['bundleTemplateId'].indexOf("6") !=-1){
                  bundle['quantity']=this.getBundleQuantity(_products)/6;
                }
               
             } 
             entries.push(bundle);
          }
        }
        }
        entries.map((prod)=>{
          if(!prod.isBundle){
             if(prod.pickAgain){
                prod['disableCounterAction']=true;
             }else if(prod.giveAway){
               prod['disableCounterAction']=true;
            }else{
                prod['disableCounterAction']=false;
             }
          }
     });
  cart.entries=entries;
  cart.entries.sort((a,b)=>{
    return a.entryNumber - b.entryNumber;
  });
  } 
  return cart;
}
getBundleQuantity(entry){
   var total = 0;
    for(var i=0;i<entry.length;i++){
      total += parseInt(entry[i].quantity);
  }
  return total
}

getBundleStock(entry){
  let i;
  for (i = 0; i < entry["product"].length; i++) {
    if(entry["product"][i]['product'].stock){
    if (
      entry["product"][i]['product'].stock.stockLevelStatus !='inStock'
    ) {
          return entry["product"][i]['product'].stock
      break;
    }
  }
  }
}
loadScript(src) {
  return new Promise((onFulfilled, onRejected) => {
    try {
      const renderer = this.rendererFactory.createRenderer(this.dom, {
          id: '-1',
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: {}
      });
      let loaded;
      const script = renderer.createElement('script');
      const head = this.dom.head;

      if (head === null) {
          throw new Error('<head> not found within DOCUMENT.');
      }
      renderer.setAttribute(script,'type','text/javascript');
      renderer.setAttribute(script, 'src', src);
      
      renderer.appendChild(head, script);
      script.onreadystatechange = script.onload = () => {
        if (!loaded) {
            onFulfilled(script);
        }
        loaded = true;
      };
      script.onerror = function() { };
    } catch (e) {
        console.error('Error in loadScript : ', e);
    }
  });
}
isMyScriptLoaded(url) {
  const scripts = this.dom.getElementsByTagName('script');
  for (let i = scripts.length; i--;) {
      if (scripts[i].src == url) return true;
  }
  return false;
}
sessionTime:number=30;
curTime:string;
alarmTime:any;
 GetTime() {
    const dt = new Date();
    this.curTime = (this.IfZero(dt.getHours()) + ":" + this.IfZero(dt.getMinutes()));
    if (this.alarmTime == this.curTime) {
      this.sessionExpired();
    }
  }
  IfZero(num) {
  return ((num <= 9) ? ("0" + num) : num);
  }


/*Card Number validations  start*/
checkCardNumber(number){
  // const _num =number;
  // const _statemet=(this.getSize(_num) >= 13 &&  
  // this.getSize(_num) <= 16); 
  // &&  
  // (this.prefixMatched(_num, 4) ||  
  // this.prefixMatched(_num, 5) ||  
  // this.prefixMatched(_num, 37) ||  
  // this.prefixMatched(_num, 6));

  // const _splitNumber=number.split('');
  // console.log(_splitNumber);
  // _splitNumber.splice(_splitNumber.length-1,1);
  // console.log(_splitNumber);
  // const _spliceNumber=_splitNumber.reverse();
  // console.log(_spliceNumber);
  // _spliceNumber.map((obj,i)=>{
  //   if(i%2==0){
  //     let _number=obj*2;
  //     if(_number>9){
  //       const _val=  _number-9;
  //       _spliceNumber[i]=_val;
  //     }else{
  //       _spliceNumber[i]=_number;
  //     }
     
  //   }else{
  //     _spliceNumber[i]=parseInt(obj);
  //   }
  // });
  // console.log("_spliceNumber",_spliceNumber);
  // const _sum= _spliceNumber.reduce((a, b) => a + b, 0);
  // console.log("sum",_sum);
  // const _totalCardCheck=_sum%2==0;

  return true;
}
luhn_checksum(code) {
  var len = code.length
  var parity = len % 2
  var sum = 0
  for (var i = len-1; i >= 0; i--) {
      var d = parseInt(code.charAt(i))
      if (i % 2 == parity) { d *= 2 }
      if (d > 9) { d -= 9 }
      sum += d
  }
  return sum % 10
}

getDigit(number){ 
    if (number < 9) 
        return number; 
    return number / 10 + number % 10; 
} 

prefixMatched(number, d) 
{ 
    return this.getPrefix(number, this.getSize(d)) == d; 
} 
getPrefix(number:string, k) 
{ 
    if (this.getSize(number) > k)  
    { 
        const num:string = number + ""; 
        return parseInt(num.substring(0, k)); 
    } 
    return number; 
}
getSize(d) 
{ 
    const num = d + ""; 
    return num.length; 
} 
runExperience(tag){
 
}
}
