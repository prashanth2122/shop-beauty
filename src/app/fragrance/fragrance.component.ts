import { Component, OnInit,	Inject,Renderer2,
	ViewEncapsulation,
	HostListener, OnDestroy, AfterViewInit, ViewChildren,ElementRef } from '@angular/core';
import {FFCatalogService} from "../ff-landingpage/ff-landingpage.service";
import {SingletonService} from "../services/singleton.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, FormControl, Validators  } from "@angular/forms";
import { Router} from "@angular/router";
import { Location } from "@angular/common";
import {FragranceService} from "./fragrance.service";
  import { DOCUMENT } from '@angular/common';
  import {MetaService} from "../services/meta.service";
  import { ResizeService } from '../services/resize.service';
  import { CookieService } from 'ngx-cookie-service';
  import { SCREEN_SIZE } from '../services/screen-size.enum';
  import {ActivatedRoute} from "@angular/router";
  import { Title } from "@angular/platform-browser";
  import { GtmMethodService } from '../services/gtmmethods.service';
  import * as _ from "lodash";
declare let $:any;
declare let gtag:any;
@Component({
  selector: 'app-fragrance',
  templateUrl: './fragrance.component.html',
  styleUrls: ['./fragrance.component.scss']
})
export class FragranceComponent implements OnInit,AfterViewInit {
    prefArray:Array<any>=[];
    charactarArray:Array<any>=[];
    sampleArray:any = [];
    mindsetArray:any = [];
    fragArray:any = [];
	prefQuestionFour :boolean;
	charQuestionFour :boolean;
	mindsetTQuestions :boolean;
	mindsetPQuestions :boolean;
	welcomeStep :boolean; 
	check1 :boolean;
	commsCheck :boolean;
	tcsCheck :boolean;
	getBGImg:any = {
		blackPepper: false,
		bushukan: false,
		coastalCypress: false,
		floraLuminaire: false,
		geranium: false,
		gingerlily: false,
		jasmineSunRose: false,
		orangeBergamot: false,
		oudh: false,
		pinkPepper: false,
		rosaAbsolute: false,
		russianLeather: false,
		suedeOrris: false,
		tobaccoAbsolute: false,
		vetiverGrapefruit: false,
		active: false,
		resultsPage: false,
		initialProfile: false,
		finalProfile: false //this is to keep the gif looping
	
	  };
	  gifUrl:string;
	  chosen:boolean;
	  emailIsValid:boolean = false;







	  prefix = 'is-';
  checkExist:any;
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
    }
  ];
  currentSize:any;
  @HostListener("window:resize", [])
  onResize() {

 }
 @HostListener("window:scroll", ["$event"])
 windowScroll() {
   const that=this;
   const currentSize = this.sizes.find(x => {
	 const el = that.elementRef.nativeElement.querySelector(`.${that.prefix}${x.id}`);

	 const isVisible = window.getComputedStyle(el).display != 'none';
	 return isVisible;
   });
   that.currentSize=currentSize;
if(currentSize.name== "lg" || currentSize.name== "xl" || currentSize.name== "md"){  
 }
 }
 gdprCheck:boolean;
 preference:any;
 prefQOne:any;
 prefQTwo:any;
 prefQThree:any;
 prefQFour:any;
 attraction:any;
 attrQOne:any;
 attrQTwo:any;
 attrQThree:any;
 attrQFour:any;
 secondaryResults:boolean;
 identityCopy:any;

 gifURL:any;
 attrIndQ:any;
    attrIndQEdt:any;
    attrIndQEdp:any;
    attrIndMindQOne:any;
    attrIndMindQTwo:any;
    attrIndMindQThree:any;
    attrIndMindQFour:any;
    attrBalMindQOne:any;
    attrBalMindQTwo:any;
    attrBalMindQThree:any;
    attrBalMindQFour:any;
    attrGiveQ:any;
    attrGiveQEdt:any;
    attrGiveQEdp:any;
    attrGiveMindQOne:any;
    attrGiveMindQTwo:any;
    attrGiveMindQThree:any;
    attrGiveMindQFour:any;
    articulation:any;
    articuQOne:any;
    articuQTwo:any;
    articuQThree:any;
    articuQFour:any;
    articuIndQ:any;
    articuIndMindQOne:any;
    articuIndMindQTwo:any;
    articuIndMindQThree:any;
    articuIndMindQFour:any;
    articuBalQ:any;
    articuBalQEdt:any;
    articuBalQEdp:any;
    articuBalMindQOne:any;
    articuBalMindQTwo:any;
    articuBalMindQThree:any;
    articuBalMindQFour:any;
    articuGiveQ:any;
    articuGiveQEdt:any;
    articuGiveQEdp:any;
    articuGiveMindQOne:any;
    articuGiveMindQTwo:any;
    articuGiveMindQThree:any;
    articuGiveMindQFour:any;
    function:any;
    funcQOne:any;
    funcQTwo:any;
    funcQThree:any;
    funcQFour:any;
    funcBalMindQOne:any;
    funcBalMindQTwo:any;
    funcBalMindQThree:any;
    funcBalMindQFour:any;
    funcGiveQ:any;
    funcGiveQEdt:any;
    funcGiveQEdp:any;
    funcGiveMindQOne:any;
    funcGiveMindQTwo:any;
    funcGiveMindQThree:any;
    funcGiveMindQFour:any;
    showAttract:boolean;

    attractionQuestions:boolean;
    showAttractStep1:boolean;
    activeStage2:boolean;
    showArticu:boolean;
    articulationQuestions:boolean;
    showArticuStep1:boolean;
    showFunc:boolean;
    functionQuestions:boolean;
    showFuncStep1:boolean;
    attractIndulgentQuestions:boolean;
    indQuestions:boolean;
    indMainTitle:boolean;
    activeStage3:boolean;
    attractGivingQuestions:boolean;
    attractBalancedQuestions:boolean;
    balMindsetQuestions:boolean;
    showBalMindsetStep1:boolean;
    activeStage4:boolean;
    giveMainTitle:boolean;
    giveQuestions:boolean;
    showAttractStep4:boolean;
    articuIndulgentQuestions:boolean;
    articuIndMainTitle:boolean;
    articuIndQuestions:boolean;
    articuBalancedQuestions:boolean;
    articuBalMainTitle:boolean;
    articuBalQuestions:any;
    articuGivingQuestions:any;
    articuGiveMainTitle:any;
    articuGiveQuestions:any;



    
  showArticuStep4:boolean;
  funcBalancedQuestions:boolean;
  funcGivingQuestions:boolean;
  funcGiveMainTitle:boolean;
  funcGiveQuestions:boolean;
  showFuncStep4:boolean;
  finalResults:any;
  activeStage5:boolean;
  showIndMindsetStep4:boolean;
  showBalMindsetStep4:boolean;
  showGiveMindsetStep4:boolean;
  showArticuIndMindsetStep4:boolean;
  showArticuBalMindsetStep4:boolean;
  showArticuGiveMindsetStep4:boolean;
  showFuncBalMindsetStep4:boolean;
  showFuncGiveMindsetStep4:boolean;
  
  funcBalMindsetQuestions:boolean;
  showFuncBalMindsetStep1:boolean;
  gdprPopUp:true;
  showAttractStep2:boolean;
  showArticuStep2:boolean;
  showAttractStep3:boolean;
  showArticuStep3:boolean;
  showFuncStep2:boolean;
  showFuncStep3:boolean;
  indTQuestions:boolean;
  indPQuestions:boolean;
  indMindsetTitle:boolean;

  articuIndMindsetQuestions:boolean;
  indMindsetQuestions:boolean;
  showIndMindsetStep1:boolean;
  showArticuIndMindsetStep1:boolean;
  articuIndMindsetTitle:boolean;
  articuBalTQuestions:boolean;
  articuBalPQuestions:boolean;
  articuBalMindsetTitle:boolean;
  giveTQuestions:boolean;
  articuBalMindsetQuestions:boolean;
  showArticuBalMindsetStep1:boolean;
  givePQuestions:boolean;
  giveMindsetTitle:boolean;
  giveMindsetQuestions:boolean;
  showGiveMindsetStep1:boolean;
  articuGiveTQuestions:boolean;
  showIndMindsetStep2:boolean;
  showIndMindsetStep3:boolean;
  showBalMindsetStep2:boolean;
  showBalMindsetStep3:boolean;
  articuGivePQuestions:boolean;
  articuGiveMindsetTitle:boolean;
  articuGiveMindsetQuestions:boolean;
  showArticuGiveMindsetStep1:boolean;
  funcGiveTQuestions:boolean;
  funcGivePQuestions:boolean;
  funcGiveMindsetTitle:boolean;
  funcGiveMindsetQuestions:boolean;
  showFuncGiveMindsetStep1:boolean;

  showGiveMindsetStep2:boolean;
  showGiveMindsetStep3:boolean;

  showArticuIndMindsetStep2:boolean;
  showArticuIndMindsetStep3:boolean;
  showArticuBalMindsetStep2:boolean;
  showArticuBalMindsetStep3:boolean;
  showArticuGiveMindsetStep2:boolean;
  showArticuGiveMindsetStep3:boolean;
  showFuncBalMindsetStep2:boolean;
  showFuncBalMindsetStep3:boolean;
  showFuncGiveMindsetStep2:boolean;
  showFuncGiveMindsetStep3:boolean;
  beginStep:boolean;
  startStage1:boolean;
  list:any={
	  value:''
  };
  count1:number = 0;
  count2:number = 0;
  count3:number = 0;
  func:any;

  secProdCB0 :boolean;
  secProdCB1 :boolean;
  priProdCB :boolean;
  primaryProductCB :boolean;
  secondaryProductCB0 :boolean;
  secondaryProductCB1 :boolean;
  checkoutProducts :boolean;

  priProdSelected :boolean;
priProdNotAvailable :boolean;
secProdSelected0 :boolean;
secProdSelected1 :boolean;
secProdNotAvailable0 :boolean;
secProdNotAvailable1 :boolean;
personaCode :any;
profileType :any;
profileSecType :any;
profileDesc :any;
profileDescTwo :any;
profileImgUrl :any;
fragranceName :any;
fragranceCopy :any;
secondaryProfile:any;
showSteps:boolean;
startStep1:boolean;
showPref:boolean;
activeStage1:boolean;
showResults:boolean;
startStep4:boolean;
startStep2:boolean;
startStep3:boolean;
loadResults:boolean;
primaryResults:boolean;

  constructor(
	@Inject(DOCUMENT) public dom,
    public cookieService: CookieService,
    public elementRef: ElementRef, 
    public resizeSvc: ResizeService,
    private route: ActivatedRoute,
    public metaService:MetaService,
    public titleService: Title,
    public ffCatService:FFCatalogService,
    public singletonServ: SingletonService,
    private fb: FormBuilder,
    public router: Router,
    public location: Location,
	public fragranceServ:FragranceService,
	private renderer: Renderer2
  ) {
    this.chosen=true;
    this.welcomeStep=true;
    let random = (new Date()).toString();
    let gifURL= "assets/resource/img/loading.gif";
    this.gifUrl = gifURL + '?moltongif=' + random;
   }
  ngOnInit() {
 
  }
  ngAfterViewInit(){
    const baseSite = this.singletonServ.catalogVersion;
  this.retrieveQuizQuestions();
  const title=(baseSite.isoCode=="GB")?'Fragrance Finder | Find Your Signature Scent Quiz | Molton Brown\u00AEUK':'Fragrance Finder | Find Your Signature Scent Quiz | Molton Brown\u00AE'+baseSite.isoCode;
  this.titleService.setTitle(title);
  }
  retrieveQuizQuestions(){
	// this.renderer.setStyle(this.el.nativeElement, 'color', 'blue');
	const that=this;
	const currentSize = this.sizes.find(x => {
	  const el = that.elementRef.nativeElement.querySelector(`.${that.prefix}${x.id}`);
console.log(el);
	//   const isVisible = window.getComputedStyle(el).display != 'none';
 
	  return true;
	});
//  if(currentSize.name== "lg" || currentSize.name== "xl" || currentSize.name== "md"){  
//   }
	const baseSite = this.singletonServ.catalogVersion;
  let inputJSONUrl = 'assets/resource/data/gb/molton-brown.json';
  if ((baseSite.catalogversionId=='moltonbrown-gb')&&(this.currentSize=="xs"||this.currentSize=="sm"))
  {
    //console.log('going to fetch for mobileStore_gb from a different location');
    inputJSONUrl = 'assets/resource/data/gb/mobile/molton-brown.json';
  } else if(baseSite.catalogversionId=='moltonbrown-us'){
	//console.log('going to fetch for store_us from a different location');
    inputJSONUrl = 'assets/resource/data/states/molton-brown.json';
  } else if((baseSite.catalogversionId=='moltonbrown-us')&&(this.currentSize=="xs"||this.currentSize=="sm")){
	//console.log('going to fetch for mobileStore_us from a different location');
    inputJSONUrl = 'assets/resource/data/states/mobile/molton-brown.json';
  }
  this.getQuizContent(inputJSONUrl);  
  }
  detectScreenSize() {
    const currentSize = this.sizes.find(x => {
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);

      const isVisible = window.getComputedStyle(el).display != 'none';

      return isVisible;
    });

    this.resizeSvc.onResize(currentSize.id);
  }
  getQuizContent(path){
	const that=this;
	that.fragranceServ.getMoltonBrownQuiz(path).subscribe((data:any)=>{
		// Email validation
		//  let validateEmail = function validateEmail(e) {
		//   let emailAddress = e != undefined ? $(e.currentTarget).val() : "";
		//   let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		//   emailIsValid = pattern.test(emailAddress); //If email is valid and T&Cs checkbox ticked
	
		//   if (emailIsValid && $('#email-cb-2').prop('checked')) {
		// 	this.gdprCheck = false;
		// 	this.$apply(); //force model to update
		//   } else {
		// 	this.gdprCheck = true;
		// 	this.$apply(); //force model to update
		//   }
		// }; // Check happening on key up as well as focus in/out
	
	
		// $("[name*='emailInput']").keyup(validateEmail);
		// $("[name*='emailInput']").focusin(validateEmail);
		// $("[name*='emailInput']").focusout(validateEmail);
		let preference = data[0].preference;
		let attraction = data[0].preference[0].character[0].attraction;
		let articulation = data[0].preference[0].character[0].articulation;
		let functionChar = data[0].preference[0].character[0].func;
		this.gdprCheck = true;
		this.preference = preference;
		this.prefQOne = this.shuffleQuestion(preference[0].questions[0].question_one); //this is to shuffle the questions and I passed it into the view
	
		this.prefQTwo = this.shuffleQuestion(preference[0].questions[0].question_two);
		this.prefQThree = this.shuffleQuestion(preference[0].questions[0].question_three);
		this.prefQFour = this.shuffleQuestion(preference[0].questions[0].question_four);
		this.attraction = attraction;
		this.attrQOne = this.shuffleQuestion(attraction[0].questions[0].question_one);
		this.attrQTwo = this.shuffleQuestion(attraction[0].questions[0].question_two);
		this.attrQThree = this.shuffleQuestion(attraction[0].questions[0].question_three);
		this.attrQFour = this.shuffleQuestion(attraction[0].questions[0].question_four);
		this.attrIndQ = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_select);
		this.attrIndQEdt = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edt);
		this.attrIndQEdp = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edp);
		this.attrIndMindQOne = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
		this.attrIndMindQTwo = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
		this.attrIndMindQThree = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
		this.attrIndMindQFour = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);
		this.attrBalMindQOne = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
		this.attrBalMindQTwo = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
		this.attrBalMindQThree = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
		this.attrBalMindQFour = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
		this.attrGiveQ = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_select);
		this.attrGiveQEdt = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edt);
		this.attrGiveQEdp = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edp);
		this.attrGiveMindQOne = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
		this.attrGiveMindQTwo = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
		this.attrGiveMindQThree = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
		this.attrGiveMindQFour = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
		this.articulation = articulation;
		this.articuQOne = this.shuffleQuestion(articulation[0].questions[0].question_one);
		this.articuQTwo = this.shuffleQuestion(articulation[0].questions[0].question_two);
		this.articuQThree = this.shuffleQuestion(articulation[0].questions[0].question_three);
		this.articuQFour = this.shuffleQuestion(articulation[0].questions[0].question_four);
		this.articuIndQ = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].fragrance_select);
		this.articuIndMindQOne = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
		this.articuIndMindQTwo = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
		this.articuIndMindQThree = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
		this.articuIndMindQFour = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);
		this.articuBalQ = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_select);
		this.articuBalQEdt = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edt);
		this.articuBalQEdp = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edp);
		this.articuBalMindQOne = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
		this.articuBalMindQTwo = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
		this.articuBalMindQThree = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
		this.articuBalMindQFour = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
		this.articuGiveQ = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_select);
		this.articuGiveQEdt = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edt);
		this.articuGiveQEdp = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edp);
		this.articuGiveMindQOne = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
		this.articuGiveMindQTwo = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
		this.articuGiveMindQThree = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
		this.articuGiveMindQFour = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
		this.function = functionChar;
		this.funcQOne = this.shuffleQuestion(functionChar[0].questions[0].question_one);
		this.funcQTwo = this.shuffleQuestion(functionChar[0].questions[0].question_two);
		this.funcQThree = this.shuffleQuestion(functionChar[0].questions[0].question_three);
		this.funcQFour = this.shuffleQuestion(functionChar[0].questions[0].question_four);
		this.funcBalMindQOne = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
		this.funcBalMindQTwo = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
		this.funcBalMindQThree = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
		this.funcBalMindQFour = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
		this.funcGiveQ = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_select);
		this.funcGiveQEdt = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edt);
		this.funcGiveQEdp = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edp);
		this.funcGiveMindQOne = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
		this.funcGiveMindQTwo = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
		this.funcGiveMindQThree = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
		this.funcGiveMindQFour = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
	  })
  }
  shuffleQuestion(array) {
    let m = array.length,
        t,
        i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  } 



  restartExp() {
	  const that=this;
    gtag('event', 'restart', {
      'event_category': 'Restart Quiz'
    });
    let random2 = Math.random();
    that.gifUrl = this.gifURL + '?moltongif=' + random2;
    that.getBGImg = {
      blackPepper: false,
      bushukan: false,
      coastalCypress: false,
      floraLuminaire: false,
      geranium: false,
      gingerlily: false,
      jasmineSunRose: false,
      orangeBergamot: false,
      oudh: false,
      pinkPepper: false,
      rosaAbsolute: false,
      russianLeather: false,
      suedeOrris: false,
      tobaccoAbsolute: false,
      vetiverGrapefruit: false,
      active: false,
      resultsPage: false,
      initialProfile: false,
      finalProfile: false
    };
    that.welcomeStep = true;
    this.charactarArray = [];
    this.prefArray = [];
    this.sampleArray = [];
    this.fragArray = [];
	this. mindsetArray = [];
    this.prefQuestionFour = false;
    this.charQuestionFour = false;
    this.mindsetTQuestions = false;
    this.mindsetPQuestions = false;
    that.priProdCB = true;
    that.primaryProductCB = true;
    that.priProdSelected = false;
    that.priProdNotAvailable = false;
    that.secondaryProductCB0 = true;
    that.secondaryProductCB1 = true;
    that.secProdCB0 = true;
    that.secProdCB1 = true;
    that.secProdSelected0 = false;
    that.secProdSelected1 = false;
    that.secProdNotAvailable0 = false;
    that.secProdNotAvailable1 = false;
    that.checkoutProducts = true;
    that.gdprCheck = true;
    that.showSteps = false;
    that.activeStage2 = false;
    that.activeStage3 = false;
    that.activeStage4 = false;
    that.activeStage5 = false;
    that.getBGImg.active = false;
    that.showResults = false;
    that.loadResults = false;
    that.showResults = false;
    that.primaryResults = false;
    that.secondaryResults = false;
    that.getBGImg.initialProfile = false;
    that.getBGImg.finalProfile = false;
    that.getBGImg.resultsPage = false;
    that.beginStep = false;
    that.showPref = false;
    that.startStep1 = false;
    that.startStep2 = false;
    that.startStep3 = false;
    that.startStep4 = false;
    that.showAttract = false;
    that.attractionQuestions = false;
    that.showAttractStep1 = false; //to 4

    that.showAttractStep2 = false;
    that.showAttractStep3 = false;
    that.showAttractStep4 = false;
    that.attractIndulgentQuestions = false;
    that.indMainTitle = false;
    that.indMindsetTitle = false;
    that.indQuestions = false;
    that.indTQuestions = false;
    that.indPQuestions = false;
    that.indMindsetQuestions = false;
    that.showIndMindsetStep1 = false;
    that.showIndMindsetStep2 = false;
    that.showIndMindsetStep3 = false;
    that.showIndMindsetStep4 = false;
    that.attractBalancedQuestions = false;
    that.balMindsetQuestions = false;
    that.showBalMindsetStep1 = false;
    that.showBalMindsetStep2 = false;
    that.showBalMindsetStep3 = false;
    that.showBalMindsetStep4 = false;
    that.attractGivingQuestions = false;
    that.giveMainTitle = false;
    that.giveMindsetTitle = false;
    that.giveQuestions = false;
    that.giveTQuestions = false;
    that.givePQuestions = false;
    that.giveMindsetQuestions = false;
    that.showGiveMindsetStep1 = false;
    that.showGiveMindsetStep2 = false;
    that.showGiveMindsetStep3 = false;
    that.showGiveMindsetStep4 = false;
    that.showArticu = false;
    that.articulationQuestions = false;
    that.showArticuStep1 = false; //to 4

    that.showArticuStep2 = false;
    that.showArticuStep3 = false;
    that.showArticuStep4 = false;
    that.articuIndulgentQuestions = false;
    that.articuIndMainTitle = false;
    that.articuIndMindsetTitle = false;
    that.articuIndQuestions = false;
    that.articuIndMindsetQuestions = false;
    that.showArticuIndMindsetStep1 = false;
    that.showArticuIndMindsetStep2 = false;
    that.showArticuIndMindsetStep3 = false;
    that.showArticuIndMindsetStep4 = false;
    that.articuBalancedQuestions = false;
    that.articuBalMainTitle = false;
    that.articuBalMindsetTitle = false;
    that.articuBalQuestions = false;
    that.articuBalTQuestions = false;
    that.articuBalPQuestions = false;
    that.articuBalMindsetQuestions = false;
    that.showArticuBalMindsetStep1 = false;
    that.showArticuBalMindsetStep2 = false;
    that.showArticuBalMindsetStep3 = false;
    that.showArticuBalMindsetStep4 = false;
    that.articuGivingQuestions = false;
    that.articuGiveMainTitle = false;
    that.articuGiveMindsetTitle = false;
    that.articuGiveQuestions = false;
    that.articuGiveTQuestions = false;
    that.articuGivePQuestions = false;
    that.articuGiveMindsetQuestions = false;
    that.showArticuGiveMindsetStep1 = false;
    that.showArticuGiveMindsetStep2 = false;
    that.showArticuGiveMindsetStep3 = false;
    that.showArticuGiveMindsetStep4 = false;
    that.showFunc = false;
    that.functionQuestions = false;
    that.showFuncStep1 = false; //to 4

    that.showFuncStep2 = false;
    that.showFuncStep3 = false;
    that.showFuncStep4 = false;
    that.funcBalancedQuestions = false;
    that.funcBalMindsetQuestions = false;
    that.showFuncBalMindsetStep1 = false;
    that.showFuncBalMindsetStep2 = false;
    that.showFuncBalMindsetStep3 = false;
    that.showFuncBalMindsetStep4 = false;
    that.funcGivingQuestions = false;
    that.funcGiveMainTitle = false;
    that.funcGiveMindsetTitle = false;
    that.funcGiveQuestions = false;
    that.funcGiveTQuestions = false;
    that.funcGivePQuestions = false;
    that.funcGiveMindsetQuestions = false;
    that.showFuncGiveMindsetStep1 = false;
    that.showFuncGiveMindsetStep2 = false;
    that.showFuncGiveMindsetStep3 = false;
    that.showFuncGiveMindsetStep4 = false; //questions want to be refreshed upon restart, so calling the json again and populating the view again also
    // let siteID = $('#currentSiteId').val();
    // //console.log("The SITE ID is "+siteID);
    // let inputJSONUrl = 'assets/resource/data/gb/molton-brown.json';
    // if (siteID=='store_us'||siteID=='mobileStore_us')
    // {
    //     //console.log('going to fetch for US from a different location');
    //     inputJSONUrl = 'assets/resource/data/states/molton-brown.json';
	// }
	const baseSite = this.singletonServ.catalogVersion;
	let inputJSONUrl = 'assets/resource/data/gb/molton-brown.json';
	if ((baseSite.catalogversionId=='moltonbrown-gb')&&(this.currentSize=="xs"||this.currentSize=="sm"))
	{
	  //console.log('going to fetch for mobileStore_gb from a different location');
	  inputJSONUrl = 'assets/resource/data/gb/mobile/molton-brown.json';
	} else if(baseSite.catalogversionId=='moltonbrown-us'){
	  //console.log('going to fetch for store_us from a different location');
	  inputJSONUrl = 'assets/resource/data/states/molton-brown.json';
	} else if((baseSite.catalogversionId=='moltonbrown-us')&&(this.currentSize=="xs"||this.currentSize=="sm")){
	  //console.log('going to fetch for mobileStore_us from a different location');
	  inputJSONUrl = 'assets/resource/data/states/mobile/molton-brown.json';
	}
	that.fragranceServ.getMoltonBrownQuiz(inputJSONUrl).subscribe((data:any)=>{

      let preference = data[0].preference;
      let attraction = data[0].preference[0].character[0].attraction;
      let articulation = data[0].preference[0].character[0].articulation;
      let functionChar = data[0].preference[0].character[0].func;
      that.preference = preference;
      that.prefQOne = this.shuffleQuestion(preference[0].questions[0].question_one);
      that.prefQTwo = this.shuffleQuestion(preference[0].questions[0].question_two);
      that.prefQThree = this.shuffleQuestion(preference[0].questions[0].question_three);
      that.prefQFour = this.shuffleQuestion(preference[0].questions[0].question_four);
      that.attraction = attraction;
      that.attrQOne = this.shuffleQuestion(attraction[0].questions[0].question_one);
      that.attrQTwo = this.shuffleQuestion(attraction[0].questions[0].question_two);
      that.attrQThree = this.shuffleQuestion(attraction[0].questions[0].question_three);
      that.attrQFour = this.shuffleQuestion(attraction[0].questions[0].question_four);
      that.attrIndQ = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_select);
      that.attrIndQEdt = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edt);
      that.attrIndQEdp = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edp);
      that.attrIndMindQOne = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
      that.attrIndMindQTwo = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
      that.attrIndMindQThree = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
      that.attrIndMindQFour = this.shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);
      that.attrBalMindQOne = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
      that.attrBalMindQTwo = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
      that.attrBalMindQThree = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
      that.attrBalMindQFour = this.shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
      that.attrGiveQ = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_select);
      that.attrGiveQEdt = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edt);
      that.attrGiveQEdp = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edp);
      that.attrGiveMindQOne = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
      that.attrGiveMindQTwo = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
      that.attrGiveMindQThree = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
      that.attrGiveMindQFour = this.shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
      that.articulation = articulation;
      that.articuQOne = this.shuffleQuestion(articulation[0].questions[0].question_one);
      that.articuQTwo = this.shuffleQuestion(articulation[0].questions[0].question_two);
      that.articuQThree = this.shuffleQuestion(articulation[0].questions[0].question_three);
      that.articuQFour = this.shuffleQuestion(articulation[0].questions[0].question_four);
      that.articuIndQ = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].fragrance_select);
      that.articuIndMindQOne = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
      that.articuIndMindQTwo = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
      that.articuIndMindQThree = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
      that.articuIndMindQFour = this.shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);
      that.articuBalQ = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_select);
      that.articuBalQEdt = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edt);
      that.articuBalQEdp = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edp);
      that.articuBalMindQOne = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
      that.articuBalMindQTwo = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
      that.articuBalMindQThree = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
      that.articuBalMindQFour = this.shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
      that.articuGiveQ = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_select);
      that.articuGiveQEdt = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edt);
      that.articuGiveQEdp = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edp);
      that.articuGiveMindQOne = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
      that.articuGiveMindQTwo = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
      that.articuGiveMindQThree = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
      that.articuGiveMindQFour = this.shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
      that.function = functionChar;
      that.funcQOne = this.shuffleQuestion(functionChar[0].questions[0].question_one);
      that.funcQTwo = this.shuffleQuestion(functionChar[0].questions[0].question_two);
      that.funcQThree = this.shuffleQuestion(functionChar[0].questions[0].question_three);
      that.funcQFour = this.shuffleQuestion(functionChar[0].questions[0].question_four);
      that.funcBalMindQOne = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
      that.funcBalMindQTwo = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
      that.funcBalMindQThree = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
      that.funcBalMindQFour = this.shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
      that.funcGiveQ = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_select);
      that.funcGiveQEdt = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edt);
      that.funcGiveQEdp = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edp);
      that.funcGiveMindQOne = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
      that.funcGiveMindQTwo = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
      that.funcGiveMindQThree = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
      that.funcGiveMindQFour = this.shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
    }, function (err) {
      console.log(err);
    });
  }
  nextStep (num, list, type, parent, pick) {
    console.log('type',type,'num',num,'list',list,'parent',parent,'pick',pick);
    console.log(list);
    this.list={
        value:list
    }
    switch (type) {
      case "preference":
        switch (num) {
          case 1:
            this.startStep1 = false;
            this.startStep2 = true;
            this.prefArray.push(list);
            gtag('event', 'Stage 1', {
              'event_category': 'Answer 1',
              'event_label': pick
            });
            break;

          case 2:
            this.startStep2 = false;
            this.startStep3 = true;
            this.prefArray.push(list);
            gtag('event', 'Stage 1', {
              'event_category': 'Answer 2',
              'event_label': pick
            });
            break;

          case 3:
            this.startStep3 = false;
            this.prefArray.push(list);
            this.compareArray(this.prefArray, type,null);
            gtag('event', 'Stage 1', {
              'event_category': 'Answer 3',
              'event_label': pick
            });
            break;

          case 4:
            this.startStep4 = false;
            this.prefArray.push(list);
            this.compareArray(this.prefArray, type,null);
            gtag('event', 'Stage 1', {
              'event_category': 'Answer 4',
              'event_label': pick
            });
            break;
        }

        break;

      case "attraction":
        switch (num) {
          case 1:
            this.showAttractStep1 = false;
            this.showAttractStep2 = true;
            this.charactarArray.push(list);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 1',
              'event_label': pick
            });
            break;

          case 2:
            this.showAttractStep2 = false;
            this.showAttractStep3 = true;
            this.charactarArray.push(list);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 2',
              'event_label': pick
            });
            break;

          case 3:
            this.showAttractStep3 = false;
            this.charactarArray.push(list);
            this.compareArray(this.charactarArray, type,null);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 3',
              'event_label': pick
            });
            break;

          case 4:
            this.showAttractStep4 = false;
            this.charactarArray.push(list);
            this.compareArray(this.charactarArray, type,null);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 4',
              'event_label': pick
            });
            break;
        }

        break;

      case "articulation":
        switch (num) {
          case 1:
            this.showArticuStep1 = false;
            this.showArticuStep2 = true;
            this.charactarArray.push(list);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 1',
              'event_label': pick
            });
            break;

          case 2:
            this.showArticuStep2 = false;
            this.showArticuStep3 = true;
            this.charactarArray.push(list);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 2',
              'event_label': pick
            });
            break;

          case 3:
            this.showArticuStep3 = false;
            this.charactarArray.push(list);
            this.compareArray(this.charactarArray, type,null);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 3',
              'event_label': pick
            });
            break;

          case 4:
            this.showArticuStep4 = false;
            this.charactarArray.push(list);
            this.compareArray(this.charactarArray, type,null);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 4',
              'event_label': pick
            });
            break;
        }

        break;

      case "func":
        switch (num) {
          case 1:
            this.showFuncStep1 = false;
            this.showFuncStep2 = true;
            this.charactarArray.push(list);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 1',
              'event_label': pick
            });
            break;

          case 2:
            this.showFuncStep2 = false;
            this.showFuncStep3 = true;
            this.charactarArray.push(list);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 2',
              'event_label': pick
            });
            break;

          case 3:
            this.showFuncStep3 = false;
            this.charactarArray.push(list);
            this.compareArray(this.charactarArray, type,null);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 3',
              'event_label': pick
            });
            break;

          case 4:
            this.showFuncStep4 = false;
            this.charactarArray.push(list);
            this.compareArray(this.charactarArray, type,null);
            gtag('event', 'Stage 2', {
              'event_category': 'Answer 4',
              'event_label': pick
            });
            break;
        }

        break;

      case "indulgent":
        switch (parent) {
          case "attractIndulgent":
            switch (num) {
              case 6:
                this.indQuestions = false;

                if (list === "T") {
                  this.indTQuestions = true;
                  this.mindsetTQuestions = true;
                  this.mindsetPQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'T'
                  });
                } else {
                  this.indPQuestions = true;
                  this.mindsetPQuestions = true;
                  this.mindsetTQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'P'
                  });
                }

                break;

              case 9:
                this.indMainTitle = false;
                this.indMindsetTitle = true;
                this.indTQuestions = false;
                this.indPQuestions = false;
                this.indMindsetQuestions = true;
                this.showIndMindsetStep1 = true;
                this.activeStage4 = true;
                this.sampleArray.push(list);
                gtag('event', 'Stage 4', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;
            }

            break;

          case "artIndulgent":
            switch (num) {
              case 6:
                if (list === "T") {
                  this.sampleArray.push('T213');
                  this.articuIndQuestions = false;
                  this.articuIndMindsetQuestions = true;
                  this.showArticuIndMindsetStep1 = true;
                  this.articuIndMainTitle = false;
                  this.articuIndMindsetTitle = true;
                  this.activeStage4 = true;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'T213'
                  });
                } else {
                  this.sampleArray.push('P213');
                  this.articuIndQuestions = false;
                  this.articuIndMindsetQuestions = true;
                  this.showArticuIndMindsetStep1 = true;
                  this.articuIndMainTitle = false;
                  this.articuIndMindsetTitle = true;
                  this.activeStage4 = true;
                  gtag('event', 'Stage 4', {
                    'event_category': 'Answer 1',
                    'event_label': 'P213'
                  });
                }

                break;
            }

            break;
        }

        break;

      case "balanced":
        switch (parent) {
          case "artBalanced":
            switch (num) {
              case 6:
                this.articuBalQuestions = false;

                if (list === "T") {
                  this.articuBalTQuestions = true;
                  this.mindsetTQuestions = true;
                  this.mindsetPQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'T'
                  });
                } else {
                  this.articuBalPQuestions = true;
                  this.mindsetPQuestions = true;
                  this.mindsetTQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'P'
                  });
                }

                break;

              case 9:
                this.articuBalMainTitle = false;
                this.articuBalMindsetTitle = true;
                this.articuBalTQuestions = false;
                this.articuBalPQuestions = false;
                this.articuBalMindsetQuestions = true;
                this.showArticuBalMindsetStep1 = true;
                this.sampleArray.push(list);
                this.activeStage4 = true;
                gtag('event', 'Stage 4', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;
            }

            break;
        }

        break;

      case "giving":
        switch (parent) {
          case "attractGiving":
            switch (num) {
              case 6:
                this.giveQuestions = false;

                if (list === "T") {
                  this.giveTQuestions = true;
                  this.mindsetTQuestions = true;
                  this.mindsetPQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'T'
                  });
                } else {
                  this.givePQuestions = true;
                  this.mindsetPQuestions = true;
                  this.mindsetTQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'P'
                  });
                }

                break;

              case 9:
                this.giveMainTitle = false;
                this.giveMindsetTitle = true;
                this.giveTQuestions = false;
                this.givePQuestions = false;
                this.giveMindsetQuestions = true;
                this.showGiveMindsetStep1 = true;
                this.sampleArray.push(list);
                this.activeStage4 = true;
                gtag('event', 'Stage 4', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;
            }

            break;

          case "artGiving":
            switch (num) {
              case 6:
                this.articuGiveQuestions = false;

                if (list === "T") {
                  this.articuGiveTQuestions = true;
                  this.mindsetTQuestions = true;
                  this.mindsetPQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'T'
                  });
                } else {
                  this.articuGivePQuestions = true;
                  this.mindsetPQuestions = true;
                  this.mindsetTQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 1',
                    'event_label': 'P'
                  });
                }

                break;

              case 9:
                this.articuGiveMainTitle = false;
                this.articuGiveMindsetTitle = true;
                this.articuGiveTQuestions = false;
                this.articuGivePQuestions = false;
                this.articuGiveMindsetQuestions = true;
                this.showArticuGiveMindsetStep1 = true;
                this.sampleArray.push(list);
                this.activeStage4 = true;
                gtag('event', 'Stage 4', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;
            }

            break;

          case "funcGiving":
            switch (num) {
              case 6:
                this.funcGiveQuestions = false;

                if (list === "T") {
                  this.funcGiveTQuestions = true;
                  this.mindsetTQuestions = true;
                  this.mindsetPQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 2',
                    'event_label': 'T'
                  });
                } else {
                  this.funcGivePQuestions = true;
                  this.mindsetPQuestions = true;
                  this.mindsetTQuestions = false;
                  gtag('event', 'Stage 3', {
                    'event_category': 'Answer 2',
                    'event_label': 'P'
                  });

                  if (this.funcGiveQEdp.length == 1) {
                    this.funcGiveMainTitle = false;
                    this.funcGiveMindsetTitle = true;
                    this.funcGiveTQuestions = false;
                    this.funcGivePQuestions = false;
                    this.funcGiveMindsetQuestions = true;
                    this.showFuncGiveMindsetStep1 = true;
                    this.sampleArray.push('P304');
                    this.activeStage4 = true;
                    gtag('event', 'Stage 4', {
                      'event_category': 'Answer 2',
                      'event_label': 'P304'
                    });
                  }
                }

                break;

              case 9:
                this.funcGiveMainTitle = false;
                this.funcGiveMindsetTitle = true;
                this.funcGiveTQuestions = false;
                this.funcGivePQuestions = false;
                this.funcGiveMindsetQuestions = true;
                this.showFuncGiveMindsetStep1 = true;
                this.sampleArray.push(list);
                this.activeStage4 = true;
                gtag('event', 'Stage 4', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;
            }

            break;
        }

        break;

      case "mindset":
        switch (parent) {
          case "attractIndulgent":
            switch (num) {
              case 10:
                //store the analytic.express.social
                this.showIndMindsetStep1 = false;
                this.showIndMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                //console.log('next step etc');
                this.showIndMindsetStep2 = false;
                this.showIndMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showIndMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.showIndMindsetStep4 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;

          case "attractBalanced":
            switch (num) {
              case 10:
                //if parent is attraction etc then do this etc
                //store the analytic.express.social
                this.showBalMindsetStep1 = false;
                this.showBalMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                this.showBalMindsetStep2 = false;
                this.showBalMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showBalMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.showBalMindsetStep4 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;

          case "attractGiving":
            switch (num) {
              case 10:
                //store the analytic.express.social
                this.showGiveMindsetStep1 = false;
                this.showGiveMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                this.showGiveMindsetStep2 = false;
                this.showGiveMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showGiveMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.showGiveMindsetStep4 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;

          case "artIndulgent":
            switch (num) {
              case 10:
                //store the analytic.express.social
                this.showArticuIndMindsetStep1 = false;
                this.showArticuIndMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                this.showArticuIndMindsetStep2 = false;
                this.showArticuIndMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showArticuIndMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.showArticuIndMindsetStep4 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;

          case "artBalanced":
            switch (num) {
              case 10:
                //if parent is attraction etc then do this etc
                //store the analytic.express.social
                this.showArticuBalMindsetStep1 = false;
                this.showArticuBalMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                this.showArticuBalMindsetStep2 = false;
                this.showArticuBalMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showArticuBalMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.showArticuBalMindsetStep4 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;

          case "artGiving":
            switch (num) {
              case 10:
                //store the analytic.express.social
                this.showArticuGiveMindsetStep1 = false;
                this.showArticuGiveMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                this.showArticuGiveMindsetStep2 = false;
                this.showArticuGiveMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showArticuGiveMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.mindsetArray.push(list);
                this.showArticuGiveMindsetStep4 = false;
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;

          case "funcBalanced":
            switch (num) {
              case 10:
                //if parent is attraction etc then do this etc
                //store the analytic.express.social
                this.showFuncBalMindsetStep1 = false;
                this.showFuncBalMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                this.showFuncBalMindsetStep2 = false;
                this.showFuncBalMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showFuncBalMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.showFuncBalMindsetStep4 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;

          case "funcGiving":
            switch (num) {
              case 10:
                //if parent is attraction etc then do this etc
                //store the analytic.express.social
                this.showFuncGiveMindsetStep1 = false;
                this.showFuncGiveMindsetStep2 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 1',
                  'event_label': pick
                });
                break;

              case 11:
                this.showFuncGiveMindsetStep2 = false;
                this.showFuncGiveMindsetStep3 = true;
                this.mindsetArray.push(list);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 2',
                  'event_label': pick
                });
                break;

              case 12:
                this.showFuncGiveMindsetStep3 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 3',
                  'event_label': pick
                });
                break;

              case 13:
                this.showFuncGiveMindsetStep4 = false;
                this.mindsetArray.push(list);
                this.compareArray(this.mindsetArray, type, parent);
                gtag('event', 'Stage 5', {
                  'event_category': 'Answer 4',
                  'event_label': pick
                });
                break;
            }

            break;
        }

        break;
    }
  }
  prevStep = function (num, list, type, parent) {
	  const that=this;
    switch (type) {
      case "preference":
        switch (num) {
          case 1:
            that.welcomeStep = true;
            that.beginStep = true;
            that.showSteps = false;
            that.showPref = false;
            that.startStage1 = false;
            that.getBGImg.activeQuiz = false;
            that.getBGImg.initialProfile = false;
            that.prefArray = [];
            break;

          case 2:
            that.startStep2 = false;
            that.startStep1 = true;
            that.prefArray.pop();
            break;

          case 3:
            that.startStep2 = true;
            that.startStep3 = false;
            that.prefArray.pop();
            break;

          case 4:
            that.startStep3 = true;
            that.startStep4 = false;
            that.prefArray.pop();
            break;
        }

        break;

      case "attraction":
        switch (num) {
          case 1:
            that.showPref = true;

            if (that.prefQuestionFour) {
              that.startStep4 = true;
            } else {
              that.startStep3 = true;
            }

            that.activeStage2 = false;
            that.showAttract = false;
            that.attractionQuestions = false;
            that.showAttractStep1 = false;
            that.prefArray.pop();
            that.charactarArray.pop();
            that.prefQuestionFour = false;
            break;

          case 2:
            that.showAttractStep2 = false;
            that.showAttractStep1 = true;
            that.charactarArray.pop();
            break;

          case 3:
            that.showAttractStep3 = false;
            that.showAttractStep2 = true;
            that.charactarArray.pop();
            break;

          case 4:
            that.showAttractStep4 = false;
            that.showAttractStep3 = true;
            that.charactarArray.pop();
            break;
        }

        break;

      case "articulation":
        switch (num) {
          case 1:
            that.activeStage2 = false;
            that.showPref = true;
            that.startStep3 = true;
            that.showArticu = false;
            that.articulationQuestions = false;
            that.showArticuStep1 = false;
            that.prefArray.pop();
            that.charactarArray.pop();
            break;

          case 2:
            that.showArticuStep2 = false;
            that.showArticuStep1 = true;
            that.charactarArray.pop();
            break;

          case 3:
            that.showArticuStep3 = false;
            that.showArticuStep2 = true;
            that.charactarArray.pop();
            break;

          case 4:
            that.showArticuStep4 = false;
            that.showArticuStep3 = true;
            that.charactarArray.pop();
            break;
        }

        break;

      case "func":
        switch (num) {
          case 1:
            that.activeStage2 = false;
            that.showPref = true;
            that.startStep3 = true;
            that.showFunc = false;
            that.functionQuestions = false;
            that.showFuncStep1 = false;
            that.prefArray.pop();
            that.charactarArray.pop();
            break;

          case 2:
            that.showFuncStep2 = false;
            that.showFuncStep1 = true;
            that.charactarArray.pop();
            break;

          case 3:
            that.showFuncStep3 = false;
            that.showFuncStep2 = true;
            that.charactarArray.pop();
            break;

          case 4:
            that.showFuncStep4 = false;
            that.showFuncStep3 = true;
            that.charactarArray.pop();
            break;
        }

        break;

      case "indulgent":
        switch (parent) {
          case "attractIndulgent":
            switch (num) {
              case 6:
                if (that.charQuestionFour) {
                  that.showAttractStep4 = true;
                } else {
                  that.showAttractStep3 = true;
                }

                that.attractionQuestions = true;
                that.attractIndulgentQuestions = false;
                that.indQuestions = false;
                that.indMainTitle = false;
                that.charQuestionFour = false;
                that.charactarArray.pop();
                that.activeStage3 = false;
                break;

              case 9:
                that.indMainTitle = true;
                that.indMindsetTitle = false;
                that.indQuestions = true;
                that.indTQuestions = false;
                that.indPQuestions = false;
                that.indMindsetQuestions = false;
                that.showIndMindsetStep1 = false;
                break;
            }

            break;

          case "artIndulgent":
            switch (num) {
              case 6:
                if (that.charQuestionFour) {
                  that.showArticuStep4 = true;
                } else {
                  that.showArticuStep3 = true;
                }

                that.articulationQuestions = true;
                that.articuIndulgentQuestions = false;
                that.articuIndMainTitle = false;
                that.articuIndQuestions = false;
                that.charQuestionFour = false;
                that.charactarArray.pop();
                that.activeStage3 = false;
                break;
            }

            break;
        }

        break;

      case "balanced":
        switch (parent) {
          case "artBalanced":
            switch (num) {
              case 6:
                if (that.charQuestionFour) {
                  that.showArticuStep4 = true;
                } else {
                  that.showArticuStep3 = true;
                }

                that.articulationQuestions = true;
                that.articuBalancedQuestions = false;
                that.articuBalQuestions = false;
                that.articuBalMainTitle = false;
                that.charQuestionFour = false;
                that.charactarArray.pop();
                that.activeStage3 = false;
                break;

              case 9:
                that.articuBalMainTitle = true;
                that.articuBalMindsetTitle = false;
                that.articuBalQuestions = true;
                that.articuBalTQuestions = false;
                that.articuBalPQuestions = false;
                that.articuBalMindsetQuestions = false;
                that.showArticuBalMindsetStep1 = false;
                break;
            }

            break;
        }

        break;

      case "giving":
        switch (parent) {
          case "attractGiving":
            switch (num) {
              case 6:
                if (that.charQuestionFour) {
                  that.showAttractStep4 = true;
                } else {
                  that.showAttractStep3 = true;
                }

                that.attractionQuestions = true;
                that.attractGivingQuestions = false;
                that.giveQuestions = false;
                that.giveMainTitle = false;
                that.charQuestionFour = false;
                that.charactarArray.pop();
                that.activeStage3 = false;
                break;

              case 9:
                that.giveMainTitle = true;
                that.giveMindsetTitle = false;
                that.giveQuestions = true;
                that.giveTQuestions = false;
                that.givePQuestions = false;
                that.giveMindsetQuestions = false;
                that.showGiveMindsetStep1 = false;
                break;
            }

            break;

          case "artGiving":
            switch (num) {
              case 6:
                if (that.charQuestionFour) {
                  that.showArticuStep4 = true;
                } else {
                  that.showArticuStep3 = true;
                }

                that.articulationQuestions = true;
                that.articuGivingQuestions = false;
                that.articuGiveQuestions = false;
                that.articuGiveMainTitle = false;
                that.charQuestionFour = false;
                that.charactarArray.pop();
                that.activeStage3 = false;
                break;

              case 9:
                that.articuGiveMainTitle = true;
                that.articuGiveMindsetTitle = false;
                that.articuGiveQuestions = true;
                that.articuGiveTQuestions = false;
                that.articuGivePQuestions = false;
                that.articuGiveMindsetQuestions = false;
                that.showArticuGiveMindsetStep1 = false;
                break;
            }

            break;

          case "funcGiving":
            switch (num) {
              case 6:
                if (that.charQuestionFour) {
                  that.showFuncStep4 = true;
                } else {
                  that.showFuncStep3 = true;
                }

                that.functionQuestions = true;
                that.funcGivingQuestions = false;
                that.funcGiveQuestions = false;
                that.funcGiveMainTitle = false;
                that.charQuestionFour = false;
                that.charactarArray.pop();
                that.activeStage3 = false;
                break;

              case 9:
                that.funcGiveMainTitle = true;
                that.funcGiveMindsetTitle = false;
                that.funcGiveQuestions = true;
                that.funcGiveTQuestions = false;
                that.funcGivePQuestions = false;
                that.funcGiveMindsetQuestions = false;
                that.showFuncGiveMindsetStep1 = false;
                break;
            }

            break;
        }

        break;

      case "mindset":
        switch (parent) {
          case "attractIndulgent":
            switch (num) {
              case 10:
                that.indMainTitle = true;
                that.indMindsetTitle = false;
                that.indMindsetQuestions = false;
                that.showIndMindsetStep1 = false;

                if (that.mindsetTQuestions) {
                  that.indTQuestions = true;
                } else {
                  that.indPQuestions = true;
                }

                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showIndMindsetStep2 = false;
                that.showIndMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showIndMindsetStep3 = false;
                that.showIndMindsetStep2 = true;
				that.mindsetArray.pop();
                break;

              case 13:
                that.showIndMindsetStep4 = false;
                that.showIndMindsetStep3 = true;
                that.mindsetArray.pop();
                break;
            }

            break;

          case "attractBalanced":
            switch (num) {
              case 10:
                if (that.charQuestionFour) {
                  that.showAttractStep4 = true;
                } else {
                  that.showAttractStep3 = true;
                }

                that.attractionQuestions = true;
                that.attractBalancedQuestions = false;
                that.balMindsetQuestions = false;
                that.showBalMindsetStep1 = false;
                that.charQuestionFour = false;
                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showBalMindsetStep2 = false;
                that.showBalMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showBalMindsetStep3 = false;
                that.showBalMindsetStep2 = true;
                that.mindsetArray.pop();
                break;

              case 13:
                that.showBalMindsetStep4 = false;
                that.showBalMindsetStep3 = true;
                that.mindsetArray.pop();
            }

            break;

          case "attractGiving":
            switch (num) {
              case 10:
                that.giveMainTitle = true;
                that.giveMindsetTitle = false;
                that.giveMindsetQuestions = false;
                that.showGiveMindsetStep1 = false;

                if (that.mindsetTQuestions) {
                  that.giveTQuestions = true;
                } else {
                  that.givePQuestions = true;
                }

                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showGiveMindsetStep2 = false;
                that.showGiveMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showGiveMindsetStep3 = false;
                that.showGiveMindsetStep2 = true;
                that.mindsetArray.pop();
                break;

              case 13:
                that.showGiveMindsetStep4 = false;
                that.showGiveMindsetStep3 = true;
                that.mindsetArray.pop();
                break;
            }

            break;

          case "artIndulgent":
            switch (num) {
              case 10:
                that.articuIndQuestions = true;
                that.articuIndMindsetQuestions = false;
                that.showArticuIndMindsetStep1 = false;
                that.articuIndMainTitle = true;
                that.articuIndMindsetTitle = false;
                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showArticuIndMindsetStep2 = false;
                that.showArticuIndMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showArticuIndMindsetStep3 = false;
                that.showArticuIndMindsetStep2 = true;
                that.mindsetArray.pop();
                break;

              case 13:
                that.showArticuIndMindsetStep4 = false;
                that.showArticuIndMindsetStep3 = true;
                that.mindsetArray.pop();
                break;
            }

            break;

          case "artBalanced":
            switch (num) {
              case 10:
                that.articuBalMainTitle = true;
                that.articuBalMindsetTitle = false;
                that.articuBalMindsetQuestions = false;
                that.showArticuBalMindsetStep1 = false;

                if (that.mindsetTQuestions) {
                  that.articuBalTQuestions = true;
                } else {
                  that.articuBalPQuestions = true;
                }

                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showArticuBalMindsetStep2 = false;
                that.showArticuBalMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showArticuBalMindsetStep3 = false;
                that.showArticuBalMindsetStep2 = true;
                that.mindsetArray.pop();
                break;

              case 13:
                that.showArticuBalMindsetStep4 = false;
                that.showArticuBalMindsetStep3 = true;
                that.mindsetArray.pop();
                break;
            }

            break;

          case "artGiving":
            switch (num) {
              case 10:
                that.articuGiveMainTitle = true;
                that.articuGiveMindsetTitle = false;
                that.articuGiveMindsetQuestions = false;
                that.showArticuGiveMindsetStep1 = false;

                if (that.mindsetTQuestions) {
                  that.articuGiveTQuestions = true;
                } else {
                  that.articuGivePQuestions = true;
                }

                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showArticuGiveMindsetStep2 = false;
                that.showArticuGiveMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showArticuGiveMindsetStep3 = false;
                that.showArticuGiveMindsetStep2 = true;
				that. mindsetArray.pop();
                break;

              case 13:
                that.showArticuGiveMindsetStep4 = false;
                that.showArticuGiveMindsetStep3 = true;
                that.mindsetArray.pop();
                break;
            }

            break;

          case "funcBalanced":
            switch (num) {
              case 10:
                if (that.charQuestionFour) {
                  that.showFuncStep4 = true;
                } else {
                  that.showFuncStep3 = true;
                }

                that.functionQuestions = true;
                that.funcBalancedQuestions = false;
                that.funcBalMindsetQuestions = false;
                that.showFuncBalMindsetStep1 = false;
                that.charQuestionFour = false;
                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showFuncBalMindsetStep2 = false;
                that.showFuncBalMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showFuncBalMindsetStep3 = false;
                that.showFuncBalMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 13:
                that.showFuncBalMindsetStep4 = false;
                that.showFuncBalMindsetStep3 = true;
                that.mindsetArray.pop();
                break;
            }

            break;

          case "funcGiving":
            switch (num) {
              case 10:
                that.funcGiveMainTitle = true;
                that.funcGiveMindsetTitle = false;
                that.funcGiveQuestions = false;
                that.showFuncGiveMindsetStep1 = false;

                if (that.mindsetTQuestions) {
                  that.funcGiveTQuestions = true;
                } else {
                  //that.funcGivePQuestions = true;
                  if (that.funcGiveQEdp.length == 1) {
                    that.funcGiveQuestions = true;
                  } else {
                    that.funcGivePQuestions = true;
                  }
                }

                that.sampleArray.pop();
                that.activeStage4 = false;
                break;

              case 11:
                that.showFuncGiveMindsetStep2 = false;
                that.showFuncGiveMindsetStep1 = true;
                that.mindsetArray.pop();
                break;

              case 12:
                that.showFuncGiveMindsetStep3 = false;
                that.showFuncGiveMindsetStep2 = true;
                that.mindsetArray.pop();
                break;

              case 13:
                that.showFuncGiveMindsetStep4 = false;
                that.showFuncGiveMindsetStep3 = true;
                that.mindsetArray.pop();
                break;
            }

            break;
        }

        break;
    }
  }
  compareArray(a, type, parent) {
    var count1 = 0,
        count2 = 0,
        count3 = 0;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] == 1) {
        count1++;
      } else if (a[i] == 2) {
        count2++;
      } else if (a[i] == 3) {
        count3++;
      }
    }
console.log(a, type, parent,"count1",count1,"count2",count2,"count3",count3);
    switch (type) {
      //the start of the quiz user will chose which branch they will enter. 
      case "preference":
        if (count1 >= 2) {
          //show attraction
          this.showPref = false;
          this.showAttract = true;
          this.attractionQuestions = true;
          this.showAttractStep1 = true;
          //console.log('Chose Attraction');
          this.activeStage2 = true;
        } else if (count2 >= 2) {
          //show articulation
          this.showPref = false;
          this.showArticu = true;
          this.articulationQuestions = true;
          this.showArticuStep1 = true;
          //console.log('Chose Articulation');
          this.activeStage2 = true;
        } else if (count3 >= 2) {
          //show function
          this.showPref = false;
          this.showFunc = true;
          this.functionQuestions = true;
          this.showFuncStep1 = true;
          //console.log('Chose Function');
          this.activeStage2 = true;
        } else {
          this.prefQuestionFour = true;
          this.startStep4 = true;
        }

        break;

      case "attraction":
        if (count1 >= 2) {
          //console.log('Chose Indulgent,', 'Parent is ', type);
          this.attractionQuestions = false;
          this.attractIndulgentQuestions = true;
          this.indQuestions = true;
          this.indMainTitle = true;
          this.activeStage3 = true;
        } else if (count2 >= 2) {
          //console.log('Chose Balanced,', 'Parent is ', type);
          this.attractionQuestions = false;
          this.attractBalancedQuestions = true;
          this.balMindsetQuestions = true;
          this.showBalMindsetStep1 = true;
          this.sampleArray.push('T109');
          this.activeStage3 = true;
          this.activeStage4 = true; //console.log(sampleArray)
        } else if (count3 >= 2) {
          //console.log('Chose Giving,', 'Parent is ', type);
          this.attractionQuestions = false;
          this.attractGivingQuestions = true;
          this.giveMainTitle = true;
          this.giveQuestions = true;
          this.activeStage3 = true;
        } else {
          this.charQuestionFour = true;
          this.showAttractStep4 = true;
        }

        break;

      case "articulation":
        if (count1 >= 2) {
          this.articulationQuestions = false;
          this.articuIndulgentQuestions = true;
          this.articuIndMainTitle = true;
          this.articuIndQuestions = true;
          this.activeStage3 = true;
          //console.log('Chose Indulgent,', 'Parent is ', type);
        } else if (count2 >= 2) {
          this.articulationQuestions = false;
          this.articuBalancedQuestions = true;
          this.articuBalMainTitle = true;
          this.articuBalQuestions = true;
          this.activeStage3 = true;
          //console.log('Chose Balanced,', 'Parent is ', type);
        } else if (count3 >= 2) {
          this.articulationQuestions = false;
          this.articuGivingQuestions = true;
          this.articuGiveMainTitle = true;
          this.articuGiveQuestions = true;
          this.activeStage3 = true;
          //console.log('Chose Giving,', 'Parent is ', type);
        } else {
          this.charQuestionFour = true;
          this.showArticuStep4 = true;
        }

        break;

      case "func":
        if (count2 >= 2) {
          this.functionQuestions = false;
          this.funcBalancedQuestions = true;
          this.funcBalMindsetQuestions = true;
          this.showFuncBalMindsetStep1 = true;
          this.sampleArray.push('T307');
          this.activeStage3 = true;
          this.activeStage4 = true;
          //console.log('Chose Balanced,', 'Parent is ', type);
        } else if (count3 >= 2) {
          //console.log('Chose Giving,', 'Parent is ', type);
          this.functionQuestions = false;
          this.funcGivingQuestions = true;
          this.funcGiveMainTitle = true;
          this.funcGiveQuestions = true;
          this.activeStage3 = true;
        } else {
          //show step4 for function
          this.showFuncStep4 = true;
          this.charQuestionFour = true;
        }

        break;

      case "mindset":
        if (count1 >= 2) {
          this.fragArray.push("A");
          this.showAttract = false;
          this.showArticu = false;
          this.showFunc = false;
          //console.log('We are now in ', type, ', Parent is ', parent);
          var finalArray = this.sampleArray[0].concat(this.fragArray[0]);
          this.finalResults = finalArray;
          //console.log('sample is', sampleArray[0]);
          this.activeStage5 = true;
          this.getPersonality(this.sampleArray[0], finalArray);
        } else if (count2 >= 2) {
          this.fragArray.push("E");
          this.showAttract = false;
          this.showArticu = false;
          this.showFunc = false;
          //console.log('We are now in ', type, ', Parent is', parent);

          var _finalArray = this.sampleArray[0].concat(this.fragArray[0]);

          this.showResults = true;
          this.finalResults = _finalArray;
          //console.log('sample is', sampleArray[0]);
          this.activeStage5 = true;
          this.getPersonality(this.sampleArray[0], _finalArray);
        } else if (count3 >= 2) {
          this.fragArray.push("S");
          this.showAttract = false;
          this.showArticu = false;
          this.showFunc = false;
          //console.log('We are now in ', type, ', Parent is', parent);

          var _finalArray2 = this.sampleArray[0].concat(this.fragArray[0]);

          //console.log('sample is', sampleArray[0]);
          this.showResults = true;
          this.finalResults = _finalArray2;
          this.activeStage5 = true;
          this.getPersonality(this.sampleArray[0], _finalArray2);
        } else {
          if (parent === "attractIndulgent") {
            this.showIndMindsetStep4 = true;
          }

          if (parent === "attractBalanced") {
            this.showBalMindsetStep4 = true;
          } else if (parent === "attractGiving") {
            this.showGiveMindsetStep4 = true;
          } else if (parent === "artIndulgent") {
            this.showArticuIndMindsetStep4 = true;
          } else if (parent === "artBalanced") {
            this.showArticuBalMindsetStep4 = true;
          } else if (parent === "artGiving") {
            this.showArticuGiveMindsetStep4 = true;
          } else if (parent === "funcBalanced") {
            this.showFuncBalMindsetStep4 = true;
          } else if (parent === "funcGiving") {
            this.showFuncGiveMindsetStep4 = true;
          }
        }

        break;
    }
  }
  getPersonality(profile, identity) {
	  const that=this;
    that.loadResults = true;
    that.getBGImg.active = true;
    that.showResults = false;
    that.showSteps = false;
    setTimeout(function () {
      that.loadResults = false;
      that.showResults = true;
      that.primaryResults = true;
      that.getBGImg.active = false;
      that.getBGImg.initialProfile = false;
      that.getBGImg.finalProfile = false;
      that.getBGImg.resultsPage = true; //this request calls the json which holds ALL the products and profiles
    let siteID = $('#currentSiteId').val();
    let mbQuizResultsJSON = 'assets/resource/data/gb/quiz-results.json';
    if (siteID=='store_us'||siteID=='mobileStore_us')
    {
        //console.log('going to fetch for US from a different location for mbQuizResultsJSON');
        mbQuizResultsJSON = 'assets/resource/data/states/quiz-results.json';
	}
	
	that.fragranceServ.getQuizContent(mbQuizResultsJSON).subscribe( (data:any)=> {
        //	console.log('lets see whats up', res.data.results.persona)
        let fragID = data.results.persona;
        that.secProdCB0 = true;
        that.secProdCB1 = true;
        that.priProdCB = true;
        that.primaryProductCB = true;
        that.secondaryProductCB0 = true;
        that.secondaryProductCB1 = true;
        that.checkoutProducts = true; //this button is disabled until the user checks 2 samples

        that.gdprCheck = true; //this button is disabled until the user checks BOTH GDPR boxes

        fragID.filter(function (persona) {
          if (persona.id === profile) {
            const mainProfile = persona.profile[0];
			const fragrance = persona.fragrance[0];
			if(localStorage.getItem('prefered_lng')){
				const _basesite=JSON.parse(localStorage.getItem('prefered_lng'));
				localStorage.setItem(_basesite.personaId,JSON.stringify({_id:persona.id,_identity:identity}));
			}	
			that.personaCode = identity;
            that.profileType = mainProfile.type;
            that.profileSecType = mainProfile.secondary_type;
            that.profileDesc = mainProfile.copy_one.replace(/\n/g, "<br />");
            that.profileDescTwo = mainProfile.copy_two.replace(/\n/g, "<br />");
            that.profileImgUrl = persona.imgUrl;
            that.fragranceName = fragrance.name.replace(/\n/g, "<br />");
            that.fragranceCopy = fragrance.copy;
            that.secondaryProfile = persona.secondary;
            let scentID = persona.identity;
            scentID.filter(function (user) {
              if (user.id === identity) {
                that.identityCopy = user.copy;
              }
            }); //sets the background image depending on the users profile

            let backgroundImg = persona.bgImg;

            switch (backgroundImg) {
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
        //console.log('the profile is', profile, ' idenitiy is', identity);
      }, function (err) {
        console.log(err);
      });
    }, 5000);
  }
  showFinalResults(){
    this.router.navigate(['/store/fragrance/fragrance-finder/displayFFProducts']);
  }
  beginExp() {
    this.welcomeStep = false;
    this.showSteps = true;
    this.showPref = true;
    this.startStep1 = true;
    this.activeStage1 = true;
    this.getBGImg.active = true;
    this.getBGImg.initialProfile = true;
    gtag('event', 'begin', {
      'event_category': 'Begin Quiz',
      'event_label': 'Begin Quiz'
    });
  }

}


