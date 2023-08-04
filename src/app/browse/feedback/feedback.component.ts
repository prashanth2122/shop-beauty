import { Component, ViewChild, OnInit, ElementRef, SimpleChange, AfterViewInit } from '@angular/core';
import {
  countries,
  EUROPEAN_COUNTRIES,
  DE_COUNTRIES,
  US_COUNTRIES
} from "../../app.constant";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,

} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import * as _ from "lodash";
import { SingletonService } from "../../services/singleton.service";
import {EnquiryFormData} from "./feedback.constant";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { FeedbackFormserviceService } from "../feedback-formservice.service";
import {
  Router,
  ActivatedRoute
} from "@angular/router";
import { ContactFeedbackEnquiry } from "../../forms/contact-feedback-enquiry.form"
import { patternValidator } from '../../forms/pattern-validator';
import { DeviceDetectorService } from "ngx-device-detector";


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @ViewChild('myInput') myInput: ElementRef;
  feedbackFormSubmit: boolean;
  feedbackFormSubmits: boolean;
  feedbackQueries: Array<any> = EnquiryFormData;
  postCodeError: boolean;
  enquiryList: Array<any>;
  submitted: boolean;
  usHeading:boolean;
  ukLoopBtnStatus: boolean;
  pageLoad:boolean;
  postalcodeerror:boolean;
  ukSpecificForm: boolean;
  usSpecificForm: boolean; deviceInfo: any;
  desktopDevice: boolean;
  countries: Array<any>;
  stateList: Array<any> = [];
  contactEnquiryForm: FormGroup;
  mobileDevice: any;
  checkOnlineOrderType: any;
  postCodeStatus: boolean;
  postalAddresses: any;
  recaptchaErr:boolean;
  csServiceContact:string;
  isoCode:string;
  constructor(
    public fb: FormBuilder,
    public titleService: Title,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public deviceService: DeviceDetectorService,
    public customerForm: ContactFeedbackEnquiry,
    public translate: TranslateServiceSubService,
    public feedbackservice: FeedbackFormserviceService
  ) {
    this.isoCode=singletonServ.catalogVersion.isoCode;
    this.checkOnlineOrderType = {
      header: 'Online Order Enquiry',
      name: 'Orders',
      selected: true,
      route: '/store/browse/feedback/feedback',
      queryParams: 'orderfeedback',
      enableElements: {
        Order_Number: true,
        addressFields: true,
        addressValidation: false,
        bussinesType: false,
        hotelEmenity: false,
        GiftSection: false,
        faxNumberSection: false,
        webSiteSection: false,
        Hotel_Name: false,
        orderPara: true,
        complimentsPara: false,
        complaintsPara: false,
        productEnPara: false,
        productFeedbackPara: false,
        hotelAmenities: false,
        spaHotelPara: false

      }
    };
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.contactEnquiryForm = this.fb.group(customerForm.enquiryForm());
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.setCountry();
    if (changes["contactEnquiryForm"]) {
      if (changes["contactEnquiryForm"]["currentValue"] != undefined) {
        let _data = changes["contactEnquiryForm"]["currentValue"];
        this.contactEnquiryForm.patchValue(_data);
        const _isoCode = changes["contactEnquiryForm"]["currentValue"]["Country"]["isocode"];
        const _index = _.findIndex(this.countries, function (o) {
          return o.isocode == _isoCode;
        });

        if (_index != -1) {
          this.contactEnquiryForm.controls["Country"].patchValue(
            this.countries[_index]
          );
          if (_isoCode != "GB") {
            this.ukLoopBtnStatus = false;
          } else {
            this.ukLoopBtnStatus = true;
          }
        }
        this.patchCountry(_data);
      }
    }
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.feedbackFormSubmits=true;
    if(baseSite.isoCode=="US"){
      this.titleService.setTitle('Molton Brown | US-Official Online Store');
      this.csServiceContact="uscustomerservice@moltonbrown.com"
      this.usHeading=true;

    }
    else if(baseSite.isoCode=="GB"){
      this.titleService.setTitle('Molton Brown | UK-Official Online Store');
      this.csServiceContact="customerservice@moltonbrown.com"
      this.usHeading=false;
    }
    else if(baseSite.isoCode=="EU"){
      this.titleService.setTitle('Molton Brown | Europe-Official Online Store');
    }
    else{
      this.titleService.setTitle('Molton Brown Deutschland – Offizieller Online-Handel');
    }
    
    const queryStatus = this.route.snapshot.queryParamMap.get("type");
    if (queryStatus != "requestID") {
      const _index = _.findIndex(this.feedbackQueries, (obj) => {
        return obj.queryParams == queryStatus
      });
      if (_index != -1) {
        const _orderType = this.feedbackQueries[_index];
        this.checkOnlineOrderType = _orderType;
        this.contactEnquiryForm.controls["Order_Type"].patchValue(
          this.feedbackQueries[_index]
        );
        const _objValidate = [
          { name: 'Country', validator: [Validators.required], updateOn: 'blur' },
       
        ];

        if (_orderType.enableElements.bussinesType) {
          const _obj = [
            {
              name: 'Job_Title',
              // validator: [Validators.required], updateOn: 'blur'
            },
            {
              name: 'Company_name',
              validator: [Validators.required], updateOn: 'blur'
            },
            {
              name: 'Business_Type',
              validator: [Validators.required], updateOn: 'blur'
            },
          ];
          const _list = _.unionBy(_obj, _objValidate);
          _.uniq(_list);
          this.setFormValidator(_list);
        }
      }
      this.constructSiteCountry();
    } else {
      this.feedbackFormSubmits = false;
      this.feedbackFormSubmit = true;
      this.pageLoad=false;

    }
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }

    if( (this.checkOnlineOrderType.name == 'Orders') ||
     (this.checkOnlineOrderType.name == 'Order Returns') ||
     (this.checkOnlineOrderType.name == 'Compliments')||
     (this.checkOnlineOrderType.name == 'Complaints')||
     (this.checkOnlineOrderType.name == 'Product Enquiry')||
     (this.checkOnlineOrderType.name == 'Product Feedback')||
     (this.checkOnlineOrderType.name == 'Stockist Enquiry')) {
      this.contactEnquiryForm.controls["Job_Title"].setValidators(null);
      this.contactEnquiryForm.controls['Job_Title'].updateValueAndValidity();
      this.contactEnquiryForm.controls["Company_name"].setValidators(null);
      this.contactEnquiryForm.controls['Company_name'].updateValueAndValidity();
      this.contactEnquiryForm.controls["Business_Type"].setValidators(null);
      this.contactEnquiryForm.controls['Business_Type'].updateValueAndValidity();
      this.contactEnquiryForm.controls["Hotel_Name"].setValidators(null);
      this.contactEnquiryForm.controls['Hotel_Name'].updateValueAndValidity();

    }
    if(
    (this.checkOnlineOrderType.name == 'Spa hotel')||
    (this.checkOnlineOrderType.name == 'Partnership Enquiry')||
    (this.checkOnlineOrderType.name == 'Corporate Gifting -EMEA')
    ){
      this.contactEnquiryForm.controls["Job_Title"].setValidators(null);
      this.contactEnquiryForm.controls['Job_Title'].updateValueAndValidity();
      this.contactEnquiryForm.controls["Company_name"].setValidators([Validators.required]);
      this.contactEnquiryForm.controls['Company_name'].updateValueAndValidity();
      this.contactEnquiryForm.controls["Business_Type"].setValidators([Validators.required]);
      this.contactEnquiryForm.controls['Business_Type'].updateValueAndValidity();
       this.contactEnquiryForm.controls["Hotel_Name"].setValidators(null);
      this.contactEnquiryForm.controls['Hotel_Name'].updateValueAndValidity();
    }

 if( (this.checkOnlineOrderType.name == 'Distribution Enquiry -EMEA')||
 (this.checkOnlineOrderType.name == 'Distribution Enquiry - UK & Ireland')||
 
  (this.checkOnlineOrderType.name == 'Agency Enquiry')||
  (this.checkOnlineOrderType.name == 'Hotel Amenities')){
    
    this.contactEnquiryForm.controls["Job_Title"].setValidators(null);
    this.contactEnquiryForm.controls['Job_Title'].updateValueAndValidity();
    this.contactEnquiryForm.controls["Company_name"].setValidators([Validators.required]);
    this.contactEnquiryForm.controls['Company_name'].updateValueAndValidity();
    this.contactEnquiryForm.controls["Business_Type"].setValidators([Validators.required]);
    this.contactEnquiryForm.controls['Business_Type'].updateValueAndValidity();
     this.contactEnquiryForm.controls["Hotel_Name"].setValidators(null);
    this.contactEnquiryForm.controls['Hotel_Name'].updateValueAndValidity();

  }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  constructSiteCountry() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode === "GB") {
      this.ukLoopBtnStatus = true;
      this.ukSpecificForm = true;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(countries);
      const _isoCode = baseSite.isoCode;
      if (_isoCode != -1) {
        const _index = _.findIndex(this.countries, function (o) {
          return o.isocode == _isoCode;
        });
        this.contactEnquiryForm.controls["Country"].patchValue(
          this.countries[_index]
        );
      }
    } else if (baseSite.isoCode === "EU") {
      this.ukLoopBtnStatus = false;
      this.ukSpecificForm = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(EUROPEAN_COUNTRIES);
    } else if (baseSite.isoCode === "DE") {
      this.ukLoopBtnStatus = false;
      this.ukSpecificForm = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(DE_COUNTRIES);
      this.contactEnquiryForm.controls["Country"].patchValue(this.countries[0]);
      this.contactEnquiryForm.controls["Phone_Number"].setValidators([
        Validators.required,
        patternValidator(/^[0-9 ]{8,14}$/)
      ]);
      this.contactEnquiryForm.controls["Phone_Number"].updateValueAndValidity();
    } else if (baseSite.isoCode === "US") {
      this.ukLoopBtnStatus = false;
      this.ukSpecificForm = false;
      this.usSpecificForm = true;
      this.countries = this.nestedCopy(US_COUNTRIES);
      const _isoCode = baseSite.isoCode;
      const _index = _.findIndex(this.countries, function (o) {
        return o.isocode == _isoCode;
      });
      this.contactEnquiryForm.controls["Country"].patchValue(this.countries[_index]);
      const _states = _.find(this.countries, function (o) {
        return o.isocode == _isoCode;
      });
      this.stateList = _states.states;
    }
    this.getDeviceInfo();
    // if (baseSite.isoCode === "US") {
    //   const _index = _.findIndex(this.countries, function (o) {
    //     return o.isocode == baseSite.isoCode;
    //   });
    //   if (this.countries[_index].isocode === "US") {
    //     this.contactEnquiryForm.controls["Postcode"].setValidators([Validators.required, patternValidator(/^[0-9]{5,6}$/)]);
    //     this.contactEnquiryForm.controls['Postcode'].updateValueAndValidity();
    //   } else {
    //     this.contactEnquiryForm.controls["Postcode"].setValidators([Validators.required, patternValidator(/^[a-zA-Z0-9 ]{3,8}$$/)]);
    //     this.contactEnquiryForm.controls['Postcode'].updateValueAndValidity();
    //   }
    //   this.contactEnquiryForm.controls["State"].setValidators([Validators.required]);
    //   this.contactEnquiryForm.controls['State'].updateValueAndValidity();
    // }
  }
  setCountry() {
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite.isoCode === "GB") {
      this.ukSpecificForm = true;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(countries);
      const _isoCode = baseSite.isoCode;
      const _index = _.findIndex(this.countries, function (o) {
        return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.contactEnquiryForm.controls["Country"].patchValue(
          this.countries[_index]
        );

      }
    } else if (baseSite.isoCode === "EU") {
      this.ukSpecificForm = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(EUROPEAN_COUNTRIES);
    } else if (baseSite.isoCode === "DE") {
      this.ukSpecificForm = false;
      this.usSpecificForm = false;
      this.countries = this.nestedCopy(DE_COUNTRIES);
      this.contactEnquiryForm.controls["Country"].patchValue(this.countries[0]);
    } else if (baseSite.isoCode === "US") {
      this.ukSpecificForm = false;
      this.usSpecificForm = true;
      this.countries = this.nestedCopy(US_COUNTRIES);
      const _isoCode = baseSite.isoCode;

      const _index = _.findIndex(this.countries, function (o) {
        return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.contactEnquiryForm.controls["Country"].patchValue(
          this.countries[_index]
        );
      }
      // this.contactEnquiryForm.controls["State"].setValidators([Validators.required]);
      // this.contactEnquiryForm.controls['State'].updateValueAndValidity();


    }
  }
  setFormValidator(data) {
    data.map((obj) => {
      let _validate = obj.validator;
      if (_validate) {
        this.contactEnquiryForm.controls[obj.name].setValidators(_validate);
        this.contactEnquiryForm.controls[obj.name].updateValueAndValidity();
      } else {
        this.contactEnquiryForm.controls[obj.name].setValidators(null);
        this.contactEnquiryForm.controls[obj.name].updateValueAndValidity();
      }
    });
  }
  patchCountry(userData) {
    if (userData) {
      const _isoCode = userData.Country.isocode;
      const _index = _.findIndex(this.countries, function (o) {
        return o.isocode == _isoCode;
      });
      if (_index != -1) {
        this.contactEnquiryForm.controls["Country"].patchValue(
          this.countries[_index]
        );
      }
      if (userData.Country.isocode == "US") {
        this.contactEnquiryForm.controls["Postcode"].setValidators([
          Validators.required,
          patternValidator(/^[0-9 ]{5,6}$/)
        ]);
        this.contactEnquiryForm.controls["Postcode"].updateValueAndValidity();
      } else {
        this.contactEnquiryForm.controls["Postcode"].setValidators([
          Validators.required,
          patternValidator(/^[a-zA-Z0-9 ]*$/)
        ]);
        this.contactEnquiryForm.controls["Postcode"].updateValueAndValidity();
      }
    }
  }
  onChangeEnquire(event) {
    const _index = event.target.selectedIndex;
    this.checkOnlineOrderType = this.feedbackQueries[_index];
    this.router.navigate([this.checkOnlineOrderType.route], {
      queryParams: { type: this.checkOnlineOrderType.queryParams },
      queryParamsHandling: "merge"
    });
  }

  resetAddressFields(data) {
    data.map((obj) => {
      this.contactEnquiryForm.controls[obj.name].reset();
    });
    this.contactEnquiryForm.controls['State'].setValue('');
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }


  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
    } else {
      this.mobileDevice = false;
    }
    if (isDesktopDevice) {
      this.desktopDevice = true;
    } else {
      this.desktopDevice = false;
    }
  }
  onChangeCountry(event) {
    const baseSite = this.singletonServ.catalogVersion;
    const _index = event.target.selectedIndex - 1;
    const Country = this.countries[_index];
    if (_index != -1) {
      const _obj = [
        { name: 'line1', validator: null },
        { name: 'line2', validator: null },
        { name: 'Postcode', validator: null },
        { name: 'Town', validator: null },
        { name: 'State', validator: null }
      ];
      this.resetAddressFields(_obj);
      if (this.countries[_index].isocode === "US" || baseSite.isoCode == "US") {
        const _usCode = this.countries[_index].isocode;
        // const _pattern = (_usCode == "US") ? [
        //   Validators.required,
        //   patternValidator(/^[0-9 ]{5,6}$/)
        // ] : [
        //     Validators.required,
        //     patternValidator(/^[a-zA-Z0-9 ]*$/)
        //   ];
        // this.contactEnquiryForm.controls["Postcode"].setValidators(_pattern);
        // this.contactEnquiryForm.controls["Postcode"].updateValueAndValidity();
        // this.contactEnquiryForm.controls["State"].setValidators([
        //   Validators.required
        // ]);
        // this.contactEnquiryForm.controls["State"].updateValueAndValidity();
        this.usSpecificForm = true;
        this.ukSpecificForm = false;

      } else {
        this.usSpecificForm = false;
        // this.contactEnquiryForm.controls["State"].setValidators(null);
        // this.contactEnquiryForm.controls["State"].updateValueAndValidity();
        // this.contactEnquiryForm.controls["Postcode"].setValidators([
        //   Validators.required,
        //   patternValidator(/^[a-zA-Z0-9 ]*$/)
        // ]);
        // this.contactEnquiryForm.controls["Postcode"].updateValueAndValidity();
        // this.contactEnquiryForm.controls["State"].setValidators(null);
        // this.contactEnquiryForm.controls["State"].updateValueAndValidity();
      }
      if (Country.states) {
        this.stateList = Country.states;
        this.usSpecificForm = true;
      } else {
        this.stateList = undefined;
      }
      if (this.countries[_index]["isocode"] == "GB") {
        this.ukSpecificForm = true;
        this.ukLoopBtnStatus = true;
        this.usSpecificForm = false;
      } else {
        this.ukSpecificForm = false;
        this.ukLoopBtnStatus = false;
        this.postalAddresses = undefined;
        this.contactEnquiryForm.controls["Address"].setValidators(null);
        this.contactEnquiryForm.controls["Address"].updateValueAndValidity();
      }

    }
  }
  onSearchKeyUp(event) {
    const baseSite = this.singletonServ.catalogVersion;
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (baseSite.isoCode == "GB") {
        this.contactEnquiryForm.controls['Postcode'].patchValue(event.target.value);
        this.myInput.nativeElement.focus();
        this.onLookupAddress(event);
      }
    }
  }

  onLookupAddress(event) {
    this.findAddress(event);
  }
  findAddress(event) {
    event.preventDefault();
    const val = this.contactEnquiryForm.value;
    this.myInput.nativeElement.focus();
    if (this.contactEnquiryForm.controls['Postcode'].valid) {
      this.postCodeError = false;
      const postcode = val["Postcode"];
      this.feedbackservice.getPostCode(postcode).subscribe(
        response => {
          if (response["Items"][0]) {
            if (response["Items"][0]["Error"]) {
              this.postCodeStatus = false;
              this.postalcodeerror=true;

            } else {
              this.postCodeStatus = true;
              this.postalcodeerror=false;
              this.postalAddresses = response["Items"];
              let i;
              for (i = 0; i < response["Items"].length; i++) {
                if (
                  response["Items"][i]["StreetAddress"].indexOf(val["line1"]) !=
                  -1
                ) {
                  this.contactEnquiryForm.controls["Address"].setValue("");
                  this.contactEnquiryForm.controls["line1"].setValue("");
                  break;
                }
              }
            }
          } else {
            this.myInput.nativeElement.focus();
            this.postCodeError = true;
            this.postCodeStatus = false;
          }
        },
        error => { }
      );
    }
    else {
      this.postCodeError = true;
      this.myInput.nativeElement.focus();
    }
  }
  onSelectPlace(val) {
    const id = val;
    this.feedbackservice.retrievePostalAddress(id).subscribe(
      resp => {
        this.postalAddresses = undefined;
        let _addresses = resp["Items"][0];
        if (_addresses["Company"].length == 0) {
          this.contactEnquiryForm.controls["line1"].setValue(_addresses["Line1"]);
          this.contactEnquiryForm.controls["line2"].setValue(_addresses["Line2"]);
        } else {
          this.contactEnquiryForm.controls["line1"].setValue(
            _addresses["Company"]
          );
          this.contactEnquiryForm.controls["line2"].setValue(_addresses["Line1"]);
        }
        this.contactEnquiryForm.controls["Postcode"].setValue(_addresses["Postcode"]);
        this.contactEnquiryForm.controls["State"].setValue(_addresses["County"]);
        this.contactEnquiryForm.controls["Town"].setValue(_addresses["PostTown"]);
      },
      err => { }
    );
  }
  getStoreData(name) {
    return localStorage.getItem(name);
  }
  removeEmptyOrNull = (obj) => {
    Object.keys(obj).forEach(k =>
      (obj[k] && typeof obj[k] === 'object') && this.removeEmptyOrNull(obj[k]) ||
      (!obj[k] && obj[k] !== undefined) && delete obj[k]
    );
    return obj;
  };


  onSubmit(event) {
    event.stopPropagation();
    const baseSite = this.singletonServ.catalogVersion;
    const _feedbackData: any = this.contactEnquiryForm.value;
    const CountryFeed = this.contactEnquiryForm.controls['Country'].value.isocode;
    const stateValueISO = this.contactEnquiryForm.controls['State'].value.isocode;
    const stateValue = this.contactEnquiryForm.controls['State'].value;
    const StateFeed = (stateValueISO)?stateValueISO:stateValue;
    if (this.contactEnquiryForm.valid) {
      this.recaptchaErr=false;
      this.feedbackFormSubmits = false;
      this.pageLoad=true;
      if (this.checkOnlineOrderType.name == 'Orders') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Order Returns') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Compliments') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = _feedbackData.Country.isocode;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Complaints') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Product Enquiry') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Product Feedback') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Stockist Enquiry') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Hotel Amenities') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Distribution Enquiry - EMEA') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Distribution Enquiry - UK & Ireland') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Agency Enquiry') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Partnership Enquiry') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Corporate Gifting - EMEA') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
      if (this.checkOnlineOrderType.name == 'Spa hotel') {
        delete _feedbackData.captcha;
        delete _feedbackData.Confirm_Email;
        delete _feedbackData.Order_Type;
        _feedbackData.Country = CountryFeed;
        _feedbackData.State = StateFeed;
      }
    } else{
      this.validateAllFormFields(this.contactEnquiryForm); 
      const data=this.contactEnquiryForm.controls;
      const _filterData:Array<any>=Object.entries(data).filter((value)=>{
        return data[value[0]]['status']=="INVALID"
       });
      if(_filterData.length ==1){
         if(_filterData[0][0] == "captcha"){
          this.recaptchaErr=true;
       }
      }
    }
    

    //   const data1 = this.contactEnquiryForm.value;
    var data = this.removeEmptyOrNull(_feedbackData);
    //  var data3 = data2
    //  data3.captcha = '';
    //  data3.Country = '';
    //   var data4 = this.removeEmptyOrNull(data3);
    //   data4.Country = CountryFeed;    
    //   var data = this.removeEmptyOrNull(data4);
    // for(let obj in CountryFeed){
    //   _data=Object.assign({},obj)
    // }
    // if (this.singletonServ.getStoreData(baseSite.reg)) {
    //   const data = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
    //   if (data.token) {
    //     this.feedbackservice
    //       .getFeedback(baseSite,data.token)
    //       .subscribe(resp => {
    //         this.router.navigate([this.checkOnlineOrderType.route], {
    //           queryParams: { type: this.checkOnlineOrderType.queryParams },
    //           queryParamsHandling: "merge"
    //         });
    //       });
    //   }
    // }
    const _route = '/store/browse/feedback/feedback';
    const formType = this.checkOnlineOrderType.name;
    this.feedbackservice.generateCartToken(baseSite).subscribe((resp: any) => {
      this.feedbackservice
        .getFeedback(baseSite, resp['access_token'], _feedbackData, formType)
        .subscribe(resp => {
          this.router.navigate([_route], {
            queryParams: { type: 'requestID' },
            queryParamsHandling: "merge"
          });
        });
    });

    if (this.contactEnquiryForm.valid) {


      this.submitted = true;
    } else {
      this.validateAllFormFields(this.contactEnquiryForm);
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
