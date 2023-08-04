import {
  Inject,
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChange,
  AfterViewInit,
  EventEmitter
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import {
  trigger, 
  transition, 
  state, 
  animate, 
  style, 
  AnimationEvent,
  group 
 } from '@angular/animations';
import { Router, ActivatedRoute } from "@angular/router";
import { SingletonService } from "../../services/singleton.service";
import { DeliveryComponentService } from "../delivery/delivery.service";
import { HeaderComponentService } from "../../component/header/header.service";
import { GtmMethodService } from '../../services/gtmmethods.service';
import * as _ from "lodash";
@Component({
  selector: "app-order-summary",
  animations: [
    trigger('accordionItemContentAnimation',[
      state('isOpen', style({height: '*'})),
      state('isClose', style({height: 0})),
      transition('isOpen <=> isClose', group([animate('500ms')])),      
    ]),
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        display: 'block',
        visibility: 'visible',
         animationDuration: '1s',
         animationDelay: '1s',
         maxHeight: '175px'
      })),
      state('closed', style({
        display: 'none',
        visibility: 'hidden',
        maxHeight: '0px',
        opacity: 0,
        animationDuration: '1s',
        animationDelay: '1s'
       })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('1s')
      ]),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('0.5s')
      ]),
      transition('open <=> closed', [
        animate('0.5s')
      ]),
      transition ('* => open', [
        animate ('1s',
          style ({ opacity: '*' }),
        ),
      ]),
      transition('* => *', [
        animate('1s')
      ]),
    ])
  ],
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class OrderSummaryComponent implements OnInit, OnChanges,AfterViewInit {  
  @Input() logging = false;
  @Input() updateCart: any;
  @Input() osDetail: any;
  @Output() postCartData: EventEmitter<any> = new EventEmitter<any>();
  expandContent: boolean;
  giftMessage: string;
  editMessage: boolean;
  textlength: number;
  cartData: any;
  showCart: boolean;
  bundleCount: number = 0;
  bundleProductCount: number = 0;
  mergeCart: boolean = false;
  callFailTime: number = 0;
  usSpecific: boolean;
  usSaleTax: boolean;
  controlMouseDown:boolean;
  deSiteSpecific:boolean;
  isGTMStep2:boolean;
  isocode:string;
  picknmix6:string;
  picknmix3:string;
  yourOrder:string;
  constructor(
    @Inject(DOCUMENT) public dom,
    public singletonServ: SingletonService,
    public headerServ: HeaderComponentService,
    public deliveryServ: DeliveryComponentService,
    public router: Router,
    public route: ActivatedRoute,
    public gtmServe: GtmMethodService
  ) {
    this.editMessage = false;

   }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.isocode=baseSite.lngCode;
      if (baseSite.isoCode == "DE") {
        this.deSiteSpecific = true;
      } else {
        this.deSiteSpecific = false;
      }
 }
 ngAfterViewInit(){
  this.singletonServ.getMessage().subscribe(message => {
    if(message.viewOrdersummary){
      this.showCart =message.viewOrdersummary.status;
      this.singletonServ.sendMessage({toggleOverlay:{status:message.viewOrdersummary.status}});
      if(message.viewOrdersummary.status){   
        this.dom.querySelector('body').style.overflowY="hidden";
      }else{
        this.dom.querySelector('body').style.overflowY="auto";
      }
    }
  });
}
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    const baseSite = this.singletonServ.catalogVersion;
    if (changes["osDetail"]) {
      if (changes["osDetail"]["currentValue"] != undefined) {
        const _osdt:any = changes["osDetail"]["currentValue"];
        that.fetchCartDetail(_osdt);
        if (baseSite.isoCode == "US") {
          this.usSpecific = true;
        }
      }
    }

  }
  getSampleHidden(entry){
      if(entry.pickAgain){
          if(entry.product.isSample){
            return true
          }
      }else if(!entry.product.isSample){
          return true
      }else{
        if(entry.product.isSample){
          return false
        }
     }
  }
  getHidden(entry){
    if(entry.pickAgain){
        if(entry.product.isSample){
          return false
        }
    }else{
     if(entry.product.isSample){
       return true
     }
    }
    return false
 }
  onReturnCheckOut() {
    this.showCart = false;
    this.dom.querySelector('body').style.overflowY="auto";
    this.singletonServ.sendMessage({toggleOverlay:{status:false}});
  }


  getBundleProductQuntity(entry, bottle) {
    return bottle.quantity / entry.quantity;
  }
  getBundleContent(text) {
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
      return this.picknmix3;
    } else {
      return "Fragrance Finder Samples";
    }
    return this.picknmix3;
  }

  onChangeText(event) {
    let textLength = event.target.value.length;
    this.textlength = 250 - textLength;
  }
  onViewMessage(data) {
    this.editMessage = true;
    this.textlength = 250-this.cartData.giftBoxMessage.length;
    this.giftMessage = this.cartData.giftBoxMessage;
  }
  onChangeMessage() {
    const baseSite = this.singletonServ.catalogVersion;
    const body = {
      giftBoxMessage: this.giftMessage
    };
    this.editMessage = false;
    this.cartData.giftBoxMessage=this.giftMessage; 
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.deliveryServ
        .giftMessage(baseSite,user.token, body, user.email, user.code)
        .subscribe( response => {              
            const _obj = { updatFullCart: true }
            this.singletonServ.sendMessage(_obj);
          },
          err => { }
        );
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const user = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.deliveryServ
          .giftMessage(baseSite,user.token, body, 'anonymous', user.guid)
          .subscribe(
            response => {
              let _obj = { updatFullCart: true }
              this.singletonServ.sendMessage(_obj);
            },
            err => { }
          );
      }
    }
  }

  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  fetchCartDetail(data) {
    const cart=this.singletonServ.setupEntryStream(data);
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode == "DE") {
       if( cart.deliveryCost){
        cart['vat']=((cart.totalPrice.value -cart.deliveryCost.value)*20)/100+'&nbsp;&euro;';
        cart['vat'].replace('.',',');
       }else{
        cart['vat']=((cart.totalPrice.value)*20)/100+'&nbsp;&euro;';
        cart['vat'].replace('.',',');
       }
    }
      if (baseSite.isoCode != "DE") {
         if(cart.productTaxDE){
           delete cart.productTaxDE; 
         }
      }
    this.cartData = cart;
    this.giftMessage =this.cartData.giftBoxMessage;  
    this.singletonServ.cartObj = cart;
    this.singletonServ.sendMessage({discardDlMethodLoader:true});
    this.postCartData.emit(cart);
    if(!this.isGTMStep2){
      this.isGTMStep2=true;
      this.gtmServe.gtmSetFeed(cart,"2");
    }   
  }

  getBundleTotalPrice(data) {
    const _bundlePrice= data.product.filter((obj)=>{
      return obj.product.isSample
    });
    if(_bundlePrice.length !=0){
      return _bundlePrice[0]['totalPrice']['formattedValue'];
    }
  }
  getBundleQuantity(entry) {
    let p = 0;
    let i;
    for (i = 0; i < entry.product.length; i++) {
      if (!entry.product[i]['product']['isSample']) {
        let qty = entry.product[i].quantity;
        p = p + qty;
      }
    }

    if (entry.bundleTemplateId) {
      if (entry.bundleTemplateId.indexOf("6") != -1) {
        p = p / 6
      } else {
        p = p / 3
      }
    }
    return p;
  }
  getTotalPrice(entry) {
    if (entry.totalPrice.value != 0) { return entry.totalPrice.formattedValue } else { return 'FREE' }
  }


  getBundlePrice(data) {
    const _bundlePrice= data.product.filter((obj)=>{
      return obj.product.isSample
    });
    if(_bundlePrice.length !=0){
      return _bundlePrice[0]['totalPrice']['formattedValue'];
    }
  }
  onEditBasket(event) {
    event.preventDefault();
    if(event.ctrlKey && event.which === 1){
      window.open("store/mbcart/mbBasket");
    } else {
      this.router.navigate(["store","mbcart","mbBasket"]);
    }
  }
  goToBasket() {
    if(this.controlMouseDown){
      window.open("store/mbcart");
    }else{
      this.router.navigate(["store","mbcart"]);
    }
  }


  setGuestUserSetUp() {
    const baseSite = this.singletonServ.catalogVersion;
    const _obj = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
    this.mergeCart = true;
    this.deliveryServ.generateCartId(baseSite,_obj.token, 'anonymous').subscribe(
      response => {
        const guid = response["guid"];
        this.mergeGuestCart(_obj.token, guid, _obj.guid);
      },
      error => {
        if(this.controlMouseDown){
          window.open("store/mbcart");
        }else{
          this.singletonServ.removeItem(baseSite.guest);
          this.goToBasket();
        }
       
      }
    );
  }

  mergeGuestCart(token, code, oldCode) {
    const baseSite = this.singletonServ.catalogVersion;
    this.deliveryServ.mergeCart(baseSite,token, code, oldCode).subscribe((response) => {
      const _obj = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
      _obj['token']=token;
      _obj['guid']=code;
      this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(_obj));
      this.goToBasket();
    }, err => {
      this.singletonServ.removeItem(baseSite.guest);
      this.goToBasket();
    });
  }
  onAnimationEvent ( event: AnimationEvent ) {
    if (!this.logging) {
      return;
    }
  }
  onExpandContent(){
  this.expandContent =!this.expandContent;
  }
}
