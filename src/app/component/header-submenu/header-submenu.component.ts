import {
  Inject,
  Component,
  OnInit,
  HostListener,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { Title } from "@angular/platform-browser";
import { HeaderComponentService } from "../header/header.service";
import { SingletonService } from "../../services/singleton.service";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "../header/header.component";
import { TranslateService } from "../../translate.service";
import { BasketPageComponentService } from "../../checkoutpage/basketpage/basketpage.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { productviewComponentService } from "../productview/productview.service";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import * as _ from "lodash";
declare var AmpCa: any;
declare var $: any;
@Component({
  selector: "app-header-submenu",
  templateUrl: "./header-submenu.component.html",
  styleUrls: ["./header-submenu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderSubmenuComponent extends HeaderComponent
  implements OnChanges, OnInit, AfterViewInit {
    @HostListener('window:focus', ['$event'])
    onFocus(event: FocusEvent): void {
      this.searchFieldContstruction();
    }
    @HostListener('window:blur', ['$event'])
    onBlur(event: FocusEvent): void {
      this.searchFieldContstruction();
    }
    @HostListener('document:click')
    onBlurSearchCategory(){
      this.searchFieldContstruction();
    }
    searchFieldContstruction(){
      this.searchBlock = false;
      this.searchPrdctText = "";
      this.searchResultValue = "";
      if(this.searchField){
        if(this.searchField.nativeElement){
          this.searchField.nativeElement.value="";
        }
      }
      this.searchResults.length=0;
      this.searchQuery='';
      this.searchForm.reset();
    }
  @ViewChild("searchInput") searchField: ElementRef;
  @Input() message: any;
  searchPrdctText: any;
  searchCtgry: boolean=true;
  mouseEnter: boolean;
  searchBlock: boolean;
  searchResults: Array<any>;
  searchResultValue: string;
  hoverOnSearchBlock: boolean;
  renderCart: boolean = true;
  openSearchInput:boolean;
  searchQuery:string; 
  searchCat:boolean;
  searchForm: FormGroup;
  enableSearchicon:boolean;
  categoryResultData:any;
  constructor(
    @Inject(DOCUMENT) public dom,
    public titleService: Title,
    public renderer: Renderer,
    public el: ElementRef,
    public headerServ: HeaderComponentService,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public basketServ: BasketPageComponentService,
    public translate: TranslateService,
    public deviceService: DeviceDetectorService,
    public quickServ: productviewComponentService,
    public fb: FormBuilder
  ) {
    super(dom,headerServ, singletonServ, location, router, basketServ, translate, quickServ);
    this.searchResults = [];
    this.searchResultValue = "";
    this.searchBlock = false;
    this.openSearchInput=false;
    this.searchForm=this.fb.group({search:new FormControl('')});
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      if (changes["message"]) {
      if (changes["message"]["currentValue"] != undefined) {
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        if (isMobile || isTablet) {
          this.message=changes["message"]["currentValue"];
      }
    }
    }
  }
  ngOnInit() {}
  ngAfterViewInit() {
    this.singletonServ.getMessage().subscribe(message => {
      if (message.moltonSideumenu) {
        this.sidemenuStatus = message.moltonSideumenu.state;
      } else if (message.searchResults) {
        this.searchResultValue = message.searchText;
        this.onSearchResults();
      }
    });
  }

  mouseLeave() {
    this.mouseEnter = false;
  }
  goToHome(event) {
    this.titleService.setTitle(
      "Molton Brown® UK | Luxury Beauty, Fragrance, Bath & Body Gift Sets"
    );

    if(event.ctrlKey && event.which === 1){
      event.stopPropagation();
      event.preventDefault();
      window.open("/store"); 
   } else {
    // this.router.navigate(["/store"]);
    window.location.href="store/index";
   }
  }

  onLeaveSearchBox() {
    this.hoverOnSearchBlock = false;
  }
  onFocusSearch(event){
    this.renderer.invokeElementMethod(this.searchField.nativeElement, "focus");
    this.searchField.nativeElement.focus();
  }
  onsearchClicked() {
       const val=this.searchForm.value;
       if(val.search){
      if(val.search.length >=3){
        const deocdeVal =encodeURIComponent(val.search);
        this.searchResults.length=0;
        this.searchCtgry = false;
        this.searchBlock = false;
        this.searchPrdctText = "";
        this.searchResultValue = "";
        this.searchQuery='';
        this.searchField.nativeElement.value="";
        this.searchForm.reset();
        if(this.categoryResultData){
          if(this.categoryResultData.keywordRedirectUrl){
            if(this.categoryResultData.keywordRedirectUrl !=''){
              const _keywordRedirectUrl=this.categoryResultData.keywordRedirectUrl;
  
                if (_keywordRedirectUrl.indexOf("/c/") != -1) {
                  const _replaceUrl = _keywordRedirectUrl.replace("/c/", "/");
                  const _url = "/store" + _replaceUrl;
                  this.router.navigate([_url]);
                } else if(_keywordRedirectUrl.indexOf("/p/") != -1){
                  const _replaceUrl = _keywordRedirectUrl.replace("/p/", "/");
                  const _url = "/store" + _replaceUrl;
                  this.router.navigate([_url]);
                }          
  
            }else{
              this.router.navigate(["store", "browse", deocdeVal]);
            }
          }else{
            this.router.navigate(["store", "browse", deocdeVal]);
          }
        }else{
          this.router.navigate(["store", "browse", deocdeVal]);
        }
      }else{
        this.searchCat=true;
        this.renderer.invokeElementMethod(this.searchField.nativeElement, "focus");
        this.searchCtgry = true;
        if(!this.openSearchInput){
           this.openSearchInput=true;
        }
      }
    }else{
      this.searchCat=true;
      this.renderer.invokeElementMethod(this.searchField.nativeElement, "focus");
      this.searchCtgry = true;
      if(!this.openSearchInput){
         this.openSearchInput=true;
      }
    }
  }

  keyDownFunction(event){
    if(event.keyCode==13){
        event.target.blur();
        const searchForm=this.searchForm.value;
        if(searchForm.search){
        if(searchForm.search.length >=3){
          this.searchResults.length=0;
        this.onSubmitForm(event);
      }
    }
      return false;
    }
} 
  onSubmitForm(event){
    this.singletonServ.removeItem("searchId");
    const searchForm=this.searchForm.value;
    const val=searchForm.search;
    if(val){
    const deocdeVal =encodeURIComponent(val); 
    deocdeVal.trim();  
    if(deocdeVal.length!=0){
      this.searchForm.reset();
      this.searchResults.length=0;
      this.searchCtgry = false;
      this.searchBlock = false;
      this.searchPrdctText = "";
      this.searchResultValue = "";
      this.searchQuery='';
      this.searchField.nativeElement.value="";
      this.enableSearchicon=false;
      if(this.categoryResultData){
        if(this.categoryResultData.keywordRedirectUrl){
          if(this.categoryResultData.keywordRedirectUrl !=''){
            const _keywordRedirectUrl=this.categoryResultData.keywordRedirectUrl;

              if (_keywordRedirectUrl.indexOf("/c/") != -1) {
                const _replaceUrl = _keywordRedirectUrl.replace("/c/", "/");
                const _url = "/store" + _replaceUrl;
                this.router.navigate([_url]);
              } else if(_keywordRedirectUrl.indexOf("/p/") != -1){
                const _replaceUrl = _keywordRedirectUrl.replace("/p/", "/");
                const _url = "/store" + _replaceUrl;
                this.router.navigate([_url]);
              }          

          }else{
            this.router.navigate(["store", "browse", deocdeVal]);
          }
        }else{
          this.router.navigate(["store", "browse", deocdeVal]);
        }
      }else{
        this.router.navigate(["store", "browse", deocdeVal]);
      }

    }else{
      this.searchCtgry=true;
    }
    }else{
      this.searchCtgry=true;
    }
  }
  onSearcKeyUp(event) {
    this.searchForm.controls['search'].patchValue(event.target.value);
    const val=this.searchForm.value;
    if(val.search){
    this.enableSearchicon=(val.search.length>=3)?true:false;
    }
    this.onSearchChange(event,val.search)
  }

  onSearchChange(event,searchValue: string) {
    this.searchCtgry = true;
    const baseSite=this.singletonServ.catalogVersion;
    if(searchValue){
    const val=searchValue.trim();
    this.searchResultValue = val;
    this.openSearchInput=true;
    this.searchQuery=val;
    if(event.keyCode==13){
      this.searchResults.length=0;
    }else{     
      if(val) {
    if (val.length >= 3) {
    const deocdeVal =encodeURIComponent(val);
      this.headerServ
        .getCategorySearchResults(baseSite,deocdeVal)
        .subscribe((resp:any) => {
          if(resp){
            this.categoryResultData=resp;
            if (resp["products"]) {
              if (resp["products"].length > 0) {
                this.searchResults = resp["products"].slice(0, 3);
                this.searchCtgry = true;
                this.searchBlock = true;
              } else {
                this.searchResults = [];
                this.searchCtgry = true;
                this.searchBlock = false;
              }
            } else {
              this.searchResults = [];
              this.searchCtgry = true;
              this.searchBlock = false;
            }
          }
          },
          err => {
            this.searchBlock = false;
          }
        );
    } else {
      this.searchResults = [];
      this.searchCtgry = true;
      this.searchBlock = false;
    }
   }else{
    this.searchResults = [];
    this.searchCtgry = true;
    this.searchBlock = false;
   }
  }
 }
  }
  showSearchBox() {
    this.searchBlock = true;
    this.hoverOnSearchBlock = true;
    this.searchCtgry = true;
  }

  onSearchProduct(event, searchItem) {
    event.stopPropagation();
    this.searchCtgry = false;
    this.searchBlock = false;
    this.searchPrdctText = "";
    this.searchResultValue = "";
    const catgIndex = searchItem.url.indexOf("/c/");
    const prdctIndex = searchItem.url.indexOf("/p/");
    if (catgIndex != -1) {
      let url = "/store" + searchItem.url.replace("/c/", "/");
      this.searchResults = [];
      this.searchForm.reset();
      this.router.navigate([url]);
    } else if (prdctIndex != -1) {
      this.searchForm.reset();
      let url = "/store" + searchItem.url.replace("/p/", "/");
      this.searchResults = [];
      this.router.navigate([url]);
    }
  }
  onSearchResults() {
    const search = (this.searchResultValue)?this.searchResultValue:this.searchQuery;
    this.searchCtgry = false;
    this.searchBlock = false;
    this.searchPrdctText = "";
    this.searchResultValue = "";
    this.searchQuery="";
    this.searchResults = [];
    this.singletonServ.removeItem("searchId");
    const val=search.trim();
    const deocdeVal =encodeURIComponent(val);

    if(deocdeVal.length!=0){
      this.searchCtgry = false;
      this.searchBlock = false;
      this.searchPrdctText = "";
      this.searchResultValue = "";
      this.searchResults = [];
      this.searchQuery='';
      setTimeout(()=>{
        this.searchField.nativeElement.blur();
      })
      this.router.navigate(["store", "browse", deocdeVal]);
    }
  }
  onViewBasket(event) {
    event.stopPropagation();
    this.router.navigate(["store", "mbcart","mbBasket"]);
  }
  getCartCount() {
    let sum = 0;
    if (this.   singletonServ.cartObj) {
      if (this.   singletonServ.cartObj.totalItems != 0) {
        for (let i = 0; i < this.   singletonServ.cartObj["entries"].length; i++) {
          if (!this.   singletonServ.cartObj["entries"][i]["product"]["isSample"]) {
            sum += this.   singletonServ.cartObj["entries"][i]["quantity"];
          }
        }
      }
    }
    return sum;
  }
  discardSubscription(event){
    event.preventDefault();
    this.subscription.unsubscribe();
  }
  toggleMenu(event) {
     event.preventDefault();
     this.onSidemenutap();
  }
  swipMenu(event) {
   this.onSidemenutap();
  }
}
