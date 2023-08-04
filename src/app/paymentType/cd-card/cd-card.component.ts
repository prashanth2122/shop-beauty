import { Component, OnInit, Input,SimpleChange, Output,EventEmitter,ViewChild,ElementRef, OnChanges, AfterViewInit } from '@angular/core';
import {  FormGroup, Validators } from "@angular/forms";
import { patternValidator } from '../../forms/pattern-validator';
import { DeviceDetectorService } from "ngx-device-detector";
import { SingletonService } from "../../services/singleton.service";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import * as _ from "lodash";
declare var $:any;
@Component({
  selector: 'app-cd-card',
  templateUrl: './cd-card.component.html',
  styleUrls: ['./cd-card.component.scss']
})
export class CdCardComponent implements OnInit,OnChanges,AfterViewInit {
  @Input() group: FormGroup;
  @Input() newCard:boolean;
  @Input() isValidFormSubmitted: boolean;
  @Output() changeCard: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('monthEl') monthEl: ElementRef;
  expireMonth: Array<any>;
  expireYear: Array<any>;
  mobileDevice: boolean;
  deviceInfo: any;
  maxLength: any;
  cardType: Array<any> = [
    {
      content:'Visa',
      value:'visa',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^4(?:[0-9]{12}|[0-9]{15})$/)
      ]
    },
    {
      content:'Visa Debit',
      value:'visa',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^4(?:[0-9]{12}|[0-9]{15})$/)
      ]
    },
    {
      content:'V-Pay',
      value:'vpay',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^4(?:[0-9]{12}|[0-9]{15})$/)
      ]
    },
    {
      content:'Mastercard', 
      value:'master',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required, 
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^5[1-5][0-9]{14}$/)
      ]
    },
    {
      content:'MasterCard Debit', 
      value:'master',
      secureCode:3,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{3,3}$/)],
      validators:[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        patternValidator(/^5[1-5][0-9]{14}$/)
      ]
    },
    {
      content:'American Express', 
      value:'amex',
      secureCode:4,
      cvvValidation:[Validators.required,patternValidator(/^[0-9]{4,4}$/)],
      validators:[
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15),
        patternValidator(/^3[47][0-9]{13}$/)
      ]
    }
  ];
  constructor(
    public translate: TranslateServiceSubService,
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService
  ) {
    this.maxLength = 3;
    const monthBox = [];
    const yearBox = [];
    for (let i = 1; i <= 12; i++) {
      if (i >= 10) {
        const obj = { month: '' + i };
        monthBox.push(obj);
      } else {
        const obj = { month: '0' + i };
        monthBox.push(obj);
      }
    }
    this.expireMonth = monthBox;
    const date = new Date();
    for (let k = 0; k <= 24; k++) {
      const obj = { year: date.getFullYear() + k };
      yearBox.push(obj);
    }
    this.expireYear = yearBox;
  }
ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["group"]) {
      if (changes["group"]["currentValue"] != undefined) {

      }
    }
  }


  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.getDeviceInfo();
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }
  ngAfterViewInit(){
        const _paymentCard=this.group.controls;
        const _expireMonthId=_.findIndex(this.expireMonth,(obj)=>{
          return obj.month ==_paymentCard.month.value
        });
        if(_expireMonthId !=-1){
          this.group['controls'].month.patchValue(this.expireMonth[_expireMonthId].month);
        }
        const _expireYearId=_.findIndex(this.expireYear,(obj)=>{
          return obj.year ==_paymentCard.year.value
        });
        if(_expireYearId !=-1){
          this.group['controls'].year.patchValue(this.expireYear[_expireYearId].year);
        }
    //     $('.select-month').selectpicker();
    //     $('.select-month').selectpicker({
    //       dropupAuto: false
    //   });
    //   $('.select-year').selectpicker();
    //   $('.select-year').selectpicker({
    //     dropupAuto: false
    // });
  }
  onChangeMonthOpt(event){
    // $('.select-month').selectpicker('render');
    if(event){
      if(this.group['controls'].month.value ==''){
        this.group['controls'].month.setErrors({required:true});
      }
    }
  }
  onChangeOpt(event){
  if(event){
     if(this.group['controls'].year.valid){
          if(!this.group['controls'].month.valid){
           if(this.group['controls'].month.value.month !=''){
               this.group['controls'].month.setErrors(null);
               this.group['controls'].year.setErrors(null);
          }
         }
      }
      if(this.group['controls'].month.value ==''){
        this.group['controls'].month.setErrors({required:true});
     }
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
    } else {
      this.mobileDevice = false;
    }
  }
  onChangeCardType(event){
     const _id=event.target.selectedIndex-1;
     const _cardType=this.cardType;
      if(!this.newCard ){
        this.group['controls']["cardNumber"].setValidators(_cardType[_id].validators);
        this.maxLength=_cardType[_id].secureCode;
        this.group['controls']["cvv"].setValidators(_cardType[_id].cvvValidation);
      } else {
        this.group['controls']["cardNumber"].setValidators(_cardType[_id].validators);
        this.group['controls']["cvv"].setValidators(_cardType[_id].cvvValidation);
        this.group['controls']["cvv"].setValidators(null);
      }
    this.group['controls']["cardNumber"].updateValueAndValidity();
    this.group['controls']["cvv"].updateValueAndValidity(); 
  }
}
