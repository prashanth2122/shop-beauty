import { 
   Inject,
   Component, 
   OnInit,
   Input,
   Output,
   EventEmitter,
   HostListener,
   OnChanges,
   SimpleChange,
   ViewChild,
   ElementRef
   } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DeviceDetectorService } from "ngx-device-detector";
import { BasketPageComponentService } from "../basketpage/basketpage.service";
import { SingletonService } from "../../services/singleton.service";
declare var $:any;
@Component({
  selector: 'app-sample-carousel',
  templateUrl: './sample-carousel.component.html',
  styleUrls: ['./sample-carousel.component.scss']
})
export class SampleCarouselComponent implements OnInit,OnChanges {
  @ViewChild('pickerSelect')pickerSelect:ElementRef;
  @ViewChild('pickerModalEl') pickerModalEl:ElementRef;
@Input() slides:any;
@Input() quantityRestriction:any;
@Output() onAddSample: EventEmitter<any> = new EventEmitter<any>();
@Output() onRemoveSample: EventEmitter<any> = new EventEmitter<any>();
@Output() onSelectSample:EventEmitter<any>=new EventEmitter<any>();
@Output() onAddMultiproducts:EventEmitter<any>=new EventEmitter<any>();
@HostListener('document:click')
clickout() {
  if(this.slides){
  this.slides.map((obj, k) => {
      obj["action"] = false;
  });
}
}
@HostListener("window:resize", [])
onResize(event) {
  if(this.slideConfig){
  this.slideConfig.unslick();
  if (window.innerWidth <=874) {
    this.slideConfig.config['slidesToShow']=1;
    this.slideConfig.config['slidesToScroll']=1;
  }else{
    this.slideConfig.config['slidesToShow']=4;
    this.slideConfig.config['slidesToScroll']=1;
    this.slideConfig.config['dots']=false;
    this.slideConfig.config['infinite']=false;
  }
 this.slideConfig.initSlick();
 this.slideConfig.init;
}
}
slideConfig: any;
 deviceInfo:any;
 pickAgainErrMsg:boolean;
 pickAgainErrContent:string;
 isSlickCarouselExits:boolean;
  constructor(
    @Inject(DOCUMENT) public dom,
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService,
    public basketServ: BasketPageComponentService,
    public elementRef:ElementRef

  ) { }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that=this;
    if (changes["slides"]) {
      if (changes["slides"]["currentValue"]) {
          const _cartObj=changes["slides"]["currentValue"];
          that.pickAgainErrMsg=false;
          that.pickAgainErrContent='';
      }
    }
  }
  ngOnInit() {
    this.testimonialsSlick();
  }
  testimonialsSlick() {
    const that=this;
    let slickInterval = window.setInterval(()=>{
     if (typeof $.fn.slick == 'function') {
           that.isSlickCarouselExits=true;       
           that.getDeviceInfo();
           clearInterval(slickInterval)
     }else{
       const htmlScriptElement = document.createElement('script');
       htmlScriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js';
       that.elementRef.nativeElement.appendChild(htmlScriptElement);
     }
    }, 300);

}
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
      this.slideConfig = {
        dots: false,
        infinite: true
      };
    } else {
      this.slideConfig = {
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: false,
        infinite: false,
        swipe:false
      };
    }
  }

  showTooltip(event, index) {
    event.stopPropagation();
    event.preventDefault();
    this.slides.map((obj, k) => {
      if (index == k) {
        obj["action"] =!obj["action"];
      } else {
        obj["action"] = false;
      }
    });
  }
  onAddItem(event,data) {
    event.stopPropagation();
    event.preventDefault();
    this.onAddSample.emit(data);
  }
  onRemoveItem(event,data) {
    event.stopPropagation();
    event.preventDefault();
    this.onRemoveSample.emit(data);
  }
  onChangeQuant(event,k){
     this.slides[k]['selectedQuantity']=event.target.value;
  }
  getAllowedQuatity () {
    let total = 0
    var getAllowedQuatity = 0;
    this.slides.map((x)=>{
      if(x.selectedQuantity){
       total+=parseInt(x.selectedQuantity);
      }
    }
      )
    return total
  }
  
  onAddMultiSample(event){
    const that=this;
    const selectQuantity=this.getAllowedQuatity(); 
    const baseSite = this.singletonServ.catalogVersion;
    if(selectQuantity===this.quantityRestriction.allowedQuantity){
       this.pickAgainErrContent=""
       this.pickAgainErrMsg=false;
       this.addToBasket();
    }else if(selectQuantity>this.quantityRestriction.allowedQuantity){
     const _pickerModal=  this.dom.getElementById('pickCarouselModal');
     let selectPickerEl= _pickerModal.querySelectorAll('select');
     selectPickerEl.forEach((element,i) => {
      const pickerModal=  that.dom.getElementById('pickCarouselModal');
      let _selectPickerEl= pickerModal.querySelectorAll('select');
       _selectPickerEl[i].selectedIndex=0
     });
      this.pickerSelect.nativeElement.value=0;
      this.slides.map((obj, k) => {
        obj.selectedQuantity=0;
      });
      
      if(baseSite.isoCode == "DE"){
        this.pickAgainErrContent=" Entschuldigung, Sie haben zu viele ausgewählt. Bitte wählen Sie erneut."
      }
      else{
        this.pickAgainErrContent="Sorry, you have chosen too many. Please choose again."
      }
       
       this.pickAgainErrMsg=true;
       this.singletonServ.scrollToElWithinC(".orders-container","#pick-header");
    }else if(selectQuantity<this.quantityRestriction.allowedQuantity){
      const _pickerModal=  this.dom.getElementById('pickCarouselModal');
      let selectPickerEl= _pickerModal.querySelectorAll('select');
      selectPickerEl.forEach((element,i) => {
        const pickerModal=  that.dom.getElementById('pickCarouselModal');
        let _selectPickerEl= pickerModal.querySelectorAll('select');
        _selectPickerEl[i].selectedIndex=0
      });
      this.pickerSelect.nativeElement.value=0
      this.slides.map((obj, k) => {
        obj.selectedQuantity=0;
      });
      if(baseSite.isoCode == "DE"){
      this.pickAgainErrContent="Bitte wählen Sie mindestens 3 Produkte aus dem Angebot aus."
      }
      else{
        this.pickAgainErrContent="Please select at least 3 from the offer products."
      }
      this.pickAgainErrMsg=true;
      this.singletonServ.scrollToElWithinC(".orders-container","#pick-header");
    }
  }
  addToBasket(){
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
           const _user:any = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          this.createCart(_user.email,_user.token,_user.code)
    } else  {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
         const _guestuser:any = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
         this.createCart('anonymous',_guestuser.token,_guestuser.guid);
     }
  }
}
  createCart(email,token,code){
    const that=this;
    const _body={
      "productList":[
   ]
 }
 this.slides.map((x:any)=>{
  if(x.selectedQuantity){
    if(x.selectedQuantity !=0 ||x.selectedQuantity !="0"){
        const _data={
          "productCode":x.code,
          "quantity":x.selectedQuantity
        }
        _body.productList.push(_data);
    }
  }
}
  );
    const baseSite = this.singletonServ.catalogVersion;
     this.basketServ.addPickerSample(baseSite,token,_body,email,code).subscribe((response:any)=>{
      that.onAddMultiproducts.emit();
     });
  }
}
