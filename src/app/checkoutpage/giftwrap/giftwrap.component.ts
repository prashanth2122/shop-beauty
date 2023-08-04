import { Location } from "@angular/common";
import { AfterViewInit,OnChanges,SimpleChange, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { GuestForm } from "../../forms/guestForm.form";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { SingletonService } from "../../services/singleton.service";
import { BasketPageComponentService } from "../basketpage/basketpage.service";
import { animation, trigger, state, transition, animate, style, group, query, useAnimation, stagger } from '@angular/animations';
@Component({
  selector: 'app-giftwrap',
  animations: [
    trigger('accordionItemContentAnimation',[
      state('isOpen', style({height: '*'})),
      state('isClose', style({height: 0})),
      transition('isOpen <=> isClose', group([animate('500ms')])),      
    ])  
  ],
  templateUrl: './giftwrap.component.html',
  styleUrls: ['./giftwrap.component.scss']
})
export class GiftwrapComponent implements OnInit,OnChanges,AfterViewInit {
  @Input() logging = false;
  @ViewChild("isGifBoxElement") isGifBoxElement: ElementRef;
  @ViewChild("giftMsgEl") giftMsgEl: ElementRef;
  @Input() cart:any;
  @Input() giftMessageForm: FormGroup;
  @Output() onShowtextArea: EventEmitter<any> = new EventEmitter<any>();
  tooltipMsg: boolean;
  giftBox: boolean;
  giftMsg: boolean;
  giftText: string;
  isValidSubmit:boolean;
  disableGiftBox:boolean;
  textlength:number;
  giftEligibleLabel:boolean;
  showGiftBox:boolean;
  deSpecificDate:any;
  public state: string = 'isClose';
  private _isOpen: boolean = false;
  set isOpen(value: boolean) {
    this._isOpen = value;
    this.state = this._isOpen ? 'isOpen' : 'isClose';
  }
  get isOpen(): boolean {
    return this._isOpen;
  }
  constructor(
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService,
    public location: Location,
    public _giftMessageDetails: GuestForm,
    private title: Title,
    public router: Router,
    public route: ActivatedRoute,
    public basketServ: BasketPageComponentService,
    private translate: TranslateServiceSubService
  ) { 
    this.giftBox = false;
    this.tooltipMsg = false;
    this.textlength = 250;

  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that=this;
    if (changes["cart"]) {
      if (changes["cart"]["currentValue"]) {
        if(!that.checkControlsAsTouched()){
                const _cartObj=changes["cart"]["currentValue"];
                that.giftBox = _cartObj.isGiftBox;
                that.giftMsg = _cartObj.isGiftBoxMessage;
                if(_cartObj.disableGiftBox){
                  that.disableGiftBox = _cartObj.disableGiftBox;
                  that.giftEligibleLabel=true;
                }else{
                  that.disableGiftBox=false;
                }
                if(_cartObj.isGiftBox){
                  that.giftMessageForm ['controls']['preferGift'].patchValue("yesgiftwrap");
                  that.showGiftBox=true;
                }else{
                 that.giftMessageForm ['controls']['preferGift'].patchValue("nogiftwrap");
                  that.showGiftBox=false;
                }
               if(_cartObj.isGiftBoxMessage){
                   that.tooltipMsg =true;
               }
              if (that.giftBox || that.disableGiftBox ) {
                that.giftBox=true;
              } else {
                that.giftMsg = false;
                that.tooltipMsg = false;
              }
      }
     }
    }
  }
  checkControlsAsTouched(){
    const _group=this.giftMessageForm['controls'];
    for(let key in _group){
      if(_group[key].touched){
      return true;
     }
    }
    return null;
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      this.setLang(baseSite.lngCode);
    }
    if(baseSite.isoCode=="DE"){
      this.deSpecificDate="deContent";
    }
    else{
      this.deSpecificDate="nonDeContent";
    }
    this.singletonServ.checkoutStatus = true;
    const obj = { checkoutStatus: true, store: true };
    this.singletonServ.sendMessage(obj);
  }
  onAnimationEvent ( event: AnimationEvent ) {
    if (!this.logging) {
      return;
    }
  }
  onChangeText(event) {
    let textLength = event.target.value.length;
    this.textlength = 250 - textLength;
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  onGiftBoxSChecked(event) {
    if(event.target.checked){
      this.giftMessageForm.controls['giftBox'].patchValue(true);
    }else{
      this.giftMessageForm.controls['giftBox'].patchValue(null);
    }
  }
  showTextarea(event) {
    this.tooltipMsg = !this.tooltipMsg;
    this.isOpen = this.isOpen? false : true;
    if(event.target.checked){
      this.giftMessageForm.controls['giftMsg'].setValue(true);
      this.giftMessageForm.controls['giftMsg'].setValidators([Validators.required]);
      this.giftMessageForm.controls['giftMessage'].setValidators([Validators.required]);
      this.giftMessageForm.controls['giftMessage'].updateValueAndValidity();
      this.giftMessageForm.controls['giftMsg'].updateValueAndValidity();
    }else{
      this.giftMessageForm.controls['giftMessage'].reset();
      this.giftMessageForm.controls['giftMsg'].setValidators(null);
      this.giftMessageForm.controls['giftMessage'].setValidators(null);
      this.giftMessageForm.controls['giftMessage'].updateValueAndValidity();
      this.giftMessageForm.controls['giftMsg'].updateValueAndValidity();
      this.giftMessageForm.controls['giftMsg'].setValue('');
    }
  }
  ngAfterViewInit() {

    this.singletonServ.getMessage().subscribe(message => {
      if (message.sample) {
        let _cartObj=message.cartObj;      
        if (_cartObj) {
          this.giftBox = _cartObj.isGiftBox;
          this.giftMsg = _cartObj.isGiftBoxMessage;
          this.disableGiftBox = _cartObj.disableGiftBox;
          if(_cartObj.disableGiftBox){
            this.disableGiftBox = _cartObj.disableGiftBox;
            this.giftMessageForm.controls['giftBox'].disable();
           }else{
            this.giftMessageForm.controls['giftBox'].enable();
           }
          if(this.giftBox){
            this.giftMessageForm.controls['giftBox'].patchValue(true);
          }
          if(this.giftMsg){            
             this.tooltipMsg =true;
            if(_cartObj.giftBoxMessage){
             this.giftMessageForm.controls.giftMessage.patchValue(_cartObj._cartObj)
            }
          }
          if (this.giftBox ||this.disableGiftBox) {
            this.giftBox=true;
          } else {
            this.giftMsg = false;
            this.tooltipMsg = false;
          }
        }
      }
    });
  }
  onTapHeader(event){
    
  }
  onChangePreference(status) {
    if (status.target.value == "yesgiftwrap") {
      this.showGiftBox=true;
      this.tooltipMsg = false;
      this.giftMessageForm.controls['giftMessage'].reset();
      this.giftMessageForm.controls['giftMsg'].setValidators(null);
      this.giftMessageForm.controls['giftMessage'].setValidators(null);
      this.giftMessageForm.controls['giftMessage'].updateValueAndValidity();
      this.giftMessageForm.controls['giftMsg'].updateValueAndValidity();
      this.giftMessageForm.controls['giftMsg'].setValue(false);
    } else {
      this.showGiftBox=false;
      this.giftMessageForm.controls['giftMessage'].reset();
      this.giftMessageForm.controls['giftMsg'].setValidators(null);
      this.giftMessageForm.controls['giftMessage'].setValidators(null);
      this.giftMessageForm.controls['giftMessage'].updateValueAndValidity();
      this.giftMessageForm.controls['giftMsg'].updateValueAndValidity();
      this.giftMessageForm.controls['giftMsg'].setValue('');
    }
  }
}
