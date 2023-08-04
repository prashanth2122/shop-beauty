import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild,ViewChildren,ElementRef } from '@angular/core';
import {FFCatalogService} from "./ff-landingpage.service";
import {SingletonService} from "../services/singleton.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, FormControl, Validators  } from "@angular/forms";
import { Router} from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
declare var tcsCheck:boolean;
declare var emailIsValid:boolean;
@Component({
  selector: 'app-ff-landingpage',
  templateUrl: './ff-landingpage.component.html',
  styleUrls: ['./ff-landingpage.component.scss']
})
export class FfLandingpageComponent implements OnInit,AfterViewInit,OnDestroy {
  @ViewChildren('primaryCheckBox') primaryCheckBox: ElementRef;
  @ViewChild("frEmail") emailEl: ElementRef;
  @ViewChild('termsCheckbox')termsCheckbox :ElementRef;
  profileImgUrl:string="https://media.moltonbrown.co.uk/i/moltonbrown/WBB944_uk_Russian-Leather-Eau-de-Parfum-Sample_image_01?$pickAndMixImg$&fmt=webp";
  primaryResults:boolean;
  secondaryResults:boolean;
  ffCategorySubscription:Subscription;
  profileType:any;
  secondaryProductCB0:boolean;
  secondaryProductCB1:boolean; 
  secProdNotAvailable0:boolean;
  secProdNotAvailable1:boolean;
  secProdSelected0:boolean;
  secProdSelected1:boolean;
  secProdCB0:boolean;
  secProdCB1:boolean;
  primaryProfile:any;
  secondaryProfile:Array<any>;
  primaryProductCB:boolean;
  priProdCB:boolean;
  priProdSelected:boolean;
  priProdNotAvailable:boolean;
  showResults:boolean;
  primary:any={
    checked:false
  };
  showSteps:boolean;
  gdprCheck:boolean;
  secondary={
    copy:false
  }
  email:string;
  loadResults:boolean;
  checkoutProducts:boolean;
  fragranceCopy:any;
  profileSecType:any;
  profileDesc:any;
  profileDescTwo:any;
  fragranceName:any;
  identityCopy:any;
  fragranceObj:any;
  check1:boolean;
  gdprPopUp:boolean;
  getBGImg:any = { 
    blackPepper: false,bushukan: false, coastalCypress:false, floraLuminaire:false, geranium:false, 
    gingerlily:false, jasmineSunRose:false, orangeBergamot:false, oudh:false,
    pinkPepper:false, rosaAbsolute:false, russianLeather:false, suedeOrris:false, 
    tobaccoAbsolute:false, vetiverGrapefruit:false, active:false, resultsPage:false, initialProfile:false, finalProfile:false }
    primaryStatus:any;
    fragranceFinderForm: FormGroup;
    sentEmail:boolean;
  constructor(
    public titleService: Title,
    public ffCatService:FFCatalogService,
    public singletonServ: SingletonService,
    private fb: FormBuilder,
    public router: Router,
    public location: Location
    ) {
    this.primaryResults=false;
    this.secondaryResults=true;
    this.fragranceFinderForm=this.fb.group({
      primary:new FormControl('', {validators:[Validators.required]}),
      secondary0:new FormControl('',{validators:[Validators.required]}),
      secondary1:new FormControl('',{validators:[Validators.required]}),
    });
   }
   showGDPR () {
    this.gdprPopUp = true;
}
onTermClick(){
  window.open('/store/terms-conditions');
}
onPrivacyClick(){
  window.open('/store/terms-conditions');
}
onFindStoreClick(event){
  // this.router.navigate(['store','company','stores']);
  window.open('/store/company/stores');
}
  ngOnInit() {
    const baseSite=this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.personaId)){
      const personaId=JSON.parse(this.singletonServ.getStoreData(baseSite.personaId));
      this.getPersonality(personaId._id, personaId._identity );
      this.ffCategorySubscription=this.ffCatService.getMbProdDetails(baseSite,personaId._id).subscribe((persona:Array<any>)=>{
      if(persona.length !=0){
      this.primaryProfile=persona[0];
        this.secondaryProfile=[persona[1],persona[2]];
        this.secondaryProfile.map((obj)=>{
          obj['secondaryProductCB']=true;
          obj['secProdCB']=true;
          obj['secProdSelected']=false;
          obj['secProdNotAvailable']=false;
          obj['checked']=false;
      });
    }

      }); 
  }
  }
  ngAfterViewInit(){
    const that=this;
    const _path=this.location.path().slice(1).split("/");
    const _catId=_path[2];
    const _catData = this.singletonServ.menudata;
    if (_catData) {
    for (let obj of _catData) {
      const result = this.getCatalogtree(obj, _catId);
      if (result) {
        that.fragranceObj = result;
        break;
      }
    }
  }
  this.singletonServ.getMessage().subscribe(message => {
    if (message.catgories) {
      for (let obj of message.catgories) {
        const result = this.getCatalogtree(obj, _catId);
        if (result) {
          that.fragranceObj = result;
          break;
        }
      }
    }
  });
  const baseSite = this.singletonServ.catalogVersion;
  const title=(baseSite.isoCode=="GB")?'Fragrance Finder | Find Your Signature Scent Quiz | Molton Brown\u00AEUK':'Fragrance Finder | Find Your Signature Scent Quiz | Molton Brown\u00AE'+baseSite.isoCode;
  this.titleService.setTitle(title);
  }
  primaryCheckbox(event) {
 
 
		if(event.target.checked) {
			// check1 = true;

      this.secondaryProfile.forEach((obj,key)=>{
				if(this.secondaryProfile[0].checked ) {
					
					this.priProdCB = false;
					this.priProdSelected = true;

          this.checkoutProducts = false;
          
          this.secondaryProfile[0].secProdCB=false;
          this.secondaryProfile[1].secProdCB=false;
          this.secondaryProfile[0].secProdSelected=true;
          this.secondaryProfile[1].secProdNotAvailable=true;
          this.secondaryProfile[1].secondaryProductCB=true;
          
          

				} else if( this.secondaryProfile[1].checked) {
					
					this.priProdCB = false;
					this.priProdSelected = true;

          this.checkoutProducts = false;
          this.secondaryProfile[0].secProdCB=false;
          this.secondaryProfile[1].secProdCB=false;

          this.secondaryProfile[1].secProdSelected=true;
          this.secondaryProfile[0].secProdNotAvailable=true;
          this.secondaryProfile[0].secondaryProductCB=false;
          
          
				}
			});
		} else {
			// check1 = false;

      this.secondaryProfile.forEach((obj,key)=>{
				if(this.secondaryProfile[0].checked || this.secondaryProfile[1].checked  ) {
					
					this.priProdCB = true;
					this.priProdSelected = false;
					this.primaryProductCB = true;
          this.checkoutProducts = true;
          
          this.secondaryProfile[0].secProdCB=true;
          this.secondaryProfile[1].secProdCB=true;

          this.secondaryProfile[0].secProdSelected=false;
          this.secondaryProfile[1].secProdSelected=false;

          this.secondaryProfile[0].secProdNotAvailable=false;
          this.secondaryProfile[1].secProdNotAvailable=false;

          this.secondaryProfile[0].secondaryProductCB=true;
          this.secondaryProfile[1].secondaryProductCB=true;
				}
			});
		}
		
	}
  onSecondaryChange(secondary,k){
    const check1=this.primary.checked;
    this.secondaryProfile[k].checked=!this.secondaryProfile[k].checked;
    this.secondaryProfile.forEach((obj,key)=>{
    const secondaryCB = this.secondaryProfile[key].checked;
    if(secondaryCB) {			
      if(this.secondaryProfile[0].checked && check1) {
       this.priProdCB = false;
       this.priProdSelected = true;
       this.checkoutProducts = false;

       this.secondaryProfile[0].secProdCB=false;
       this.secondaryProfile[0].secProdSelected=true;
       this.secondaryProfile[1].secProdCB=false;
       this.secondaryProfile[1].secProdNotAvailable=true;
       this.secondaryProfile[1].secondaryProductCB=false;
      

      } else if(this.secondaryProfile[1].checked && check1) {
       this.priProdCB = false;
       this.priProdSelected = true;
       this.checkoutProducts = false;

       this.secondaryProfile[0].secProdCB=false;
       this.secondaryProfile[0].secProdNotAvailable=true;
       this.secondaryProfile[0].secondaryProductCB=false;

       this.secondaryProfile[1].secProdCB=false;
       this.secondaryProfile[1].secProdSelected=true;

      } else if (this.secondaryProfile[0].checked &&this.secondaryProfile[1].checked) {
        
       this.priProdCB = false;
       this.priProdNotAvailable = true;
       this.primaryProductCB = false;
      this.checkoutProducts = false;

       this.secondaryProfile[0].secProdCB=false;
       this.secondaryProfile[1].secProdCB=false;

       this.secondaryProfile[0].secProdSelected=true;
       this.secondaryProfile[1].secProdSelected=true;
      }
      
    } else {
      if (this.secondaryProfile[0].checked && !check1 && !this.secondaryProfile[1].checked) {
       this.priProdCB = true;
       this.priProdSelected = false;
       this.priProdNotAvailable = false;
       this.primaryProductCB = true;

       this.checkoutProducts = true;

       this.secondaryProfile[0].secProdCB=true;
       this.secondaryProfile[0].secProdSelected=false;
       this.secondaryProfile[0].secProdNotAvailable=false;
       this.secondaryProfile[0].secondaryProductCB=true;


       this.secondaryProfile[1].secProdCB=true;
       this.secondaryProfile[1].secProdSelected=false;
       this.secondaryProfile[1].secProdNotAvailable=false;
       this.secondaryProfile[1].secondaryProductCB=true;



      } else if (this.secondaryProfile[1].checked && !check1 && !this.secondaryProfile[0].checked) {
       this.priProdCB = true;
       this.priProdSelected = false;
       this.priProdNotAvailable = false;
       this.primaryProductCB = true;

       this.checkoutProducts = true;

       this.secondaryProfile[0].secProdCB=true;
       this.secondaryProfile[0].secProdSelected=false;
       this.secondaryProfile[0].secProdNotAvailable=false;
       this.secondaryProfile[0].secondaryProductCB=true;


       this.secondaryProfile[1].secProdCB=true;
       this.secondaryProfile[1].secProdSelected=false;
       this.secondaryProfile[1].secProdNotAvailable=false;
       this.secondaryProfile[1].secondaryProductCB=true;

      } else if (!this.secondaryProfile[1].checked && check1 && !this.secondaryProfile[0].checked) {
       this.priProdCB = true;
       this.priProdSelected = false;
       this.priProdNotAvailable = false;
       this.primaryProductCB = true;

       this.checkoutProducts = true;

       this.secondaryProfile[0].secProdCB=true;
       this.secondaryProfile[0].secProdSelected=false;
       this.secondaryProfile[0].secProdNotAvailable=false;
       this.secondaryProfile[0].secondaryProductCB=true;


       this.secondaryProfile[1].secProdCB=true;
       this.secondaryProfile[1].secProdSelected=false;
       this.secondaryProfile[1].secProdNotAvailable=false;
       this.secondaryProfile[1].secondaryProductCB=true;
      }
    }
    
  });
  }
 ngOnDestroy(){
    if(this.ffCategorySubscription){
      this.ffCategorySubscription.unsubscribe();
    }
 }
  getPersonality(profile, identity ) {
		const that=this;
  this.loadResults = true;
  this.getBGImg.active = true;
  this.showResults = false;
  this.showSteps = false;

    this.loadResults = false;
    this.showResults = true;
    this.primaryResults = true;
    this.getBGImg.active = false;
    this.getBGImg.initialProfile = false;
    this.getBGImg.finalProfile = false;
    this.getBGImg.resultsPage = true;
    const baseSite = this.singletonServ.catalogVersion;
    let mbQuizResultsJSON = 'assets/resource/data/gb/quiz-results.json';
    if (baseSite.catalogversionId=='moltonbrown-us')
    {
        //console.log('going to fetch for US from a different location for mbQuizResultsJSON');
        mbQuizResultsJSON = 'assets/resource/data/states/quiz-results.json';
    }
    //this request calls the json which holds ALL the products and profiles
   this.ffCatService.getQuizContent(mbQuizResultsJSON).subscribe((res:any)=> {
        var fragID = res.results.persona;
        this.secProdCB0 = true;
        this.secProdCB1 = true;
        this.priProdCB = true;
        this.primaryProductCB = true;
        this.secondaryProductCB0 = true;
        this.secondaryProductCB1 = true;
        this.checkoutProducts = true; //this button is disabled until the user checks 2 samples
        this.gdprCheck = true; //this button is disabled until the user checks BOTH GDPR boxes

        fragID.filter(function (persona)  {
   
          if(persona.id === profile) {
            let mainProfile = persona.profile[0];
            let fragrance = persona.fragrance[0];

            
            that.profileType = mainProfile.type;
            that.profileSecType = mainProfile.secondary_type;
            that.profileDesc = mainProfile.copy_one.replace(/\n/g, "<br />");
            that.profileDescTwo = mainProfile.copy_two.replace(/\n/g, "<br />");
            that.profileImgUrl = persona.imgUrl;

            that.fragranceName = fragrance.name.replace(/\n/g, "<br />");
            that.fragranceCopy = fragrance.copy;

            // that.secondaryProfile = persona.secondary;

            const scentID = persona.identity;
              scentID.filter(function (user) {
                  if(user.id === identity) {
                    that.identityCopy = user.copy;
                  }
              });

              //sets the background image depending on the users profile
              const backgroundImg = persona.bgImg;

              switch(backgroundImg) {
                case "blackPepper":
                  that.getBGImg.blackPepper = true;
                break;
                case "bushukan":
                  that.getBGImg.bushukan = true;
                break;
                case "coastalCypress":
                  that.getBGImg.coastalCypress = true;
                break;	
                case "floraLuminaire":
                  that.getBGImg.floraLuminaire = true;
                break;
                case "geranium":
                  that.getBGImg.geranium = true;
                break;
                case "gingerlily":
                  that.getBGImg.gingerlily = true;
                break;
                case "jasmineSunRose":
                  that.getBGImg.jasmineSunRose = true;
                break;	
                case "orangeBergamot":
                  that.getBGImg.orangeBergamot = true;
                break;
                case "oudh":
                  that.getBGImg.oudh = true;
                break;
                case "pinkPepper":
                  that.getBGImg.pinkPepper = true;
                break;
                case "rosaAbsolute":
                  that.getBGImg.rosaAbsolute = true;
                break;	
                case "russianLeather":
                  that.getBGImg.russianLeather = true;
                break;
                case "suedeOrris":
                  that.getBGImg.suedeOrris = true;
                break;
                case "tobaccoAbsolute":
                  that.getBGImg.tobaccoAbsolute = true;
                break;
                case "vetiverGrapefruit":
                  that.getBGImg.vetiverGrapefruit = true;
                break;
              }
              
            }
        });
    },function(err) {
    });

}
onAddToBasket(event){  
  event.preventDefault();
  const that=this;
  const baseSite = this.singletonServ.catalogVersion;
const _secondaryprod=this.secondaryProfile.filter((obj:any)=>{
  return obj.checked;
});
  const _obj={
    "productcodes":[that.primaryProfile.code],
    "isBag":false
    }
    if(_secondaryprod.length !=0){
      _obj['productcodes'].push(_secondaryprod[0]['code']);
    }
    this.checkoutProducts=true;
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
  that.ffCatService.generateToken(baseSite).subscribe((response)=>{
  const token =  response['access_token'];
  this.ffCatService
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
  that.ffCatService .addBundleToCart(baseSite,token,email,code,_obj).subscribe((resp)=>{
    const obj = { updateCart: true };
    that.singletonServ.sendMessage(obj);
    if(this.singletonServ.getStoreData(baseSite.reg)){
        if(this.singletonServ.cartObj){
          if(this.singletonServ.cartObj.entries){
            if(this.singletonServ.cartObj.entries.length !=0){
              this.router.navigate(["store", "mbcart"]);
            }else{
              this.router.navigate(["checkout", "shipping"]);
            }
        }else{
          this.router.navigate(["checkout", "shipping"]);
        }
    }else{
      this.router.navigate(["checkout", "shipping"]);
    }
     
   }else{
    if(this.singletonServ.cartObj){
      if(this.singletonServ.cartObj.entries){
      if(this.singletonServ.cartObj.entries.length !=0){
        this.router.navigate(["store", "mbcart"]);
      }else{
        this.router.navigate(["checkout", "login"]);
      }
    }else{
      this.router.navigate(["checkout", "login"]);
    }
    }else{
      this.router.navigate(["checkout", "login"]);
    }
   }

},(err)=>{
  
})  
}
getCatalogtree(obj, targetId) {
  if (obj.name.toLowerCase() === targetId.toLowerCase()) {
    return obj;
  }
  if (obj.subcategories) {
    for (let item of obj.subcategories) {
      let check = this.getCatalogtree(item, targetId);
      if (check) {
        return check;
      }
    }
  }
  return null;
}
getRouterPath(){
  const _path=this.fragranceObj.url;
  const url = "/store" + _path.replace("/c/", "/");
  return url;
}
  restartExp(){
  const _path=this.fragranceObj.url;
  const url = "/store" + _path.replace("/c/", "/");
  this.router.navigate([url]);
  }

    // 	// Email validation
	// 	var validateEmail = function(e) {
	// 		var emailAddress = (e != undefined)?$(e.currentTarget).val():"";
	// 		var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	// 		emailIsValid = pattern.test(emailAddress);
			
	// 		//If email is valid and T&Cs checkbox ticked
	// 		if( emailIsValid && $('#email-cb-2').prop('checked'))
	// 		{
	// 			that.gdprCheck = false;
	// 			that.$apply(); //force model to update
	// 		}
	// 		else
	// 		{
	// 			that.gdprCheck = true;
	// 			that.$apply(); //force model to update
	// 		}
	// 	};

		// Check happening on key up as well as focus in/out
		// $("[name*='emailInput']").keyup(validateEmail);
		// $("[name*='emailInput']").focusin(validateEmail);
		// $("[name*='emailInput']").focusout(validateEmail);
 tcs(event) {
   const that=this;
		if(event.target.checked) {
			tcsCheck = true;
			
      // if T&Cs checked, verify if email is valid
      			let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		      	emailIsValid = pattern.test(that.emailEl.nativeElement.value);
			if(emailIsValid) {
        that.sentEmail=false;
				// All good to go!
        that.gdprCheck = false;
			} else {
				that.gdprCheck = true;
			}
		} else {
			tcsCheck = false;
			that.gdprCheck = true;
		}
  }
  submitEmail(){
    this.termsCheckbox.nativeElement.checked=false;
    this.sentEmail=true;
    this.gdprCheck = true;
  }
}
