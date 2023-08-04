import {
  Inject,
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer,
  Input,
  SimpleChange,
  OnChanges
} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { Title } from "@angular/platform-browser";
import { HeaderComponentService } from "../header/header.service";
import { HeaderSubmenuComponent } from "../header-submenu/header-submenu.component";
import { SingletonService } from "../../services/singleton.service";
import { environment }     from '../../../environments/environment';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "../../translate.service";
import { BasketPageComponentService } from "../../checkoutpage/basketpage/basketpage.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { productviewComponentService } from "../productview/productview.service";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import * as _ from "lodash";
declare var AmpCa: any;
declare var $: any;

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent extends HeaderSubmenuComponent
  implements OnInit, AfterViewInit, OnChanges {
    
  @ViewChild("mySidenav") sideNav: ElementRef;
  @ViewChild("searchInput") searchMobField: ElementRef;
  @Input() sidemenuStatus: boolean;
  countryText: any;
  footerData: Array<any> ;
  toggle: boolean;
  mouseEnter: boolean;
  searchBlockClose: boolean;
  menuLog: any;
  baseSiteCountries: Array<any> = environment.countryJsonData;;
  catalogTree: any;
  catalogmenu: Array<any>;
  countries = environment.countryJsonData;;
  currentCountryCode: string;
  signIn:boolean;
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
    super(
      dom,
      titleService,
      renderer,
      el,
      headerServ,
      singletonServ,
      location,
      router,
      route,
      basketServ,
      translate,
      deviceService,
      quickServ,
      fb
    );
    
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    const that = this;
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
        this.getStaticCntnt(baseSite.lngCode);
        this.setLang(baseSite.lngCode);
        const _isoCode = this.singletonServ.catalogVersion.isoCode; 
        this.countries.map(obj => {
          if (_isoCode == obj.isoCode) {
            obj["current"] = true;
            that.currentCountryCode = obj.countryName;
          } else {
            obj["current"] = false;
          }
       });
    }
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      this.signIn = true;
      this.singletonServ.loggedIn = true;
    }
   
  }
  getStaticCntnt(lang: string){
   this.headerServ.getPolicyContent(lang).subscribe((response)=>{
      this.footerData=response['moltonBrownPolicies'];
    });
  }
  onmbCountryChange(data) {
     this.countryText = data;

  }

  onSiteChange(data){    
    this.onSidemenutap();
    this.countryText=data;
    this.onCancelModal(true);
  }
  onCancelModal(bol) {   
    const baseSite = this.singletonServ.catalogVersion;
    let user;
    if(this.singletonServ.getStoreData(baseSite.reg)){
       user= JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
     }
    if (bol) {
      this.singletonServ.setStoreData(
        "prefered_lng",
        JSON.stringify(this.countryText)
      );    
      const _isoCode=this.countryText.isoCode;
      this.countries.map((obj)=>{
        if(_isoCode==obj.isoCode){
          obj['current']=true;
        }else{
          obj['current']=false;
        }
      });  
      const _obj = {
        baseSiteChange: true,
      };
      if(this.singletonServ.getStoreData(baseSite.reg)){
        if(!this.singletonServ.getStoreData(this.countryText.reg)){       
          let currentUser={email:''};
          currentUser.email=user.email;
          this.singletonServ.setStoreData(
            this.countryText.reg,
            JSON.stringify(currentUser)
          );
          if(user.token){
            this.headerServ.getUserData(baseSite,user.token,user.email).subscribe((response)=>{
              const userDtls= JSON.parse(this.singletonServ.getStoreData(this.countryText.reg));
              userDtls['isExpressCheckout']=(response['isExpressCheckout'])?true:false;
              this.singletonServ.setStoreData(
                this.countryText.reg,
                JSON.stringify(currentUser)
              );
            },err=>{

            })
          }
          this.singletonServ.catalogVersion =  JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
          this.singletonServ.sendMessage(_obj);      
          this.goToStore();
        }else{
          this.singletonServ.catalogVersion =  JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
          this.singletonServ.sendMessage(_obj);      
          this.goToStore();
     }
    }else{
      this.singletonServ.catalogVersion =  JSON.parse(this.singletonServ.getStoreData("prefered_lng"));
      this.singletonServ.sendMessage(_obj);      
      this.goToStore();
    }
 
    }
  }
gotoHome(){  
  this.router.navigate(["store"]);
  this.onSidemenutap();
}
onFindStoreClick(){
  this.router.navigate(['store','company','stores'])
  this.onSidemenutap();
}

  renderCatalogData() {
    const baseSite=this.singletonServ.catalogVersion;
    this.headerServ.getCatalogData(baseSite).subscribe(
      resp => {
        const catalogData = resp["catalogs"][0]["catalogVersions"];
        const menuId = _.findIndex(catalogData,(o:any)=> {
          return o.id == "Online";
        });
        let menuData = catalogData[menuId].categories;
           menuData.sort(function(a, b) {
          return a.order - b.order;
        });
       const ctlog= _.clone(menuData);
       const _copy = this.nestedCopy(menuData);
       this.singletonServ.pickPackCategories=this.nestedCopy(menuData);
       this.constructCatalog(_copy);
       this.constructAmpContent(ctlog);
      },
      error => {}
    );
  }

  constructAmpContent(catalog) {
    const that = this;
    const baseSite=this.singletonServ.catalogVersion;
    catalog.map((obj, k) => {
      if(obj.categoryDisplayName =='Editorial'){
        obj["ampContent"]=[];
      }
      if (obj["subcategories"]) {
        catalog[k]["subcategories"].sort(function(a, b) {
          return a.order - b.order;
        });
      }
      if (obj.subcategories) {
        if (
          obj.subcategories[10] &&
          !obj.subcategories[10]["parent"] 
        ) {
          if (obj.subcategories.length > 11) {
            obj.subcategories.splice(10, 0, { name: "Hidden Category" ,categoryDisplayName:''});
            obj["subcategories"] = that.chunkArray(obj.subcategories, 11);
          } else {
            obj["subcategories"] = that.chunkArray(obj.subcategories, 11);
          }
        } else if (
          obj.subcategories[20] &&
          !obj.subcategories[20]["parent"] &&
          !obj.subcategories[20]["description"]
        ) {
          if (obj.subcategories.length > 21) {
            obj.subcategories.splice(20, 0, { name: "Hidden Category" });
            obj["subcategories"] = that.chunkArray(obj.subcategories, 11);
          } else {
            obj["subcategories"] = that.chunkArray(obj.subcategories, 11);
          }
        } else {
          obj["subcategories"] = that.chunkArray(obj.subcategories, 11);
        }
      }
    });
    catalog.map((obj, k) => {
      if (obj.bannerId) {
        obj["subcategories"].push({ content: [] });
        const objId = obj["subcategories"].findIndex(function(obj) {
          return !Array.isArray(obj);
        });
        let bannerBox = obj.bannerId.split(",");
        _.forEach(bannerBox, function(value, i) {
          value.replace("/ /g", "");
          if(value.length !=2){
      if(AmpCa){
        if(AmpCa.utils){
          if(AmpCa.utils.getHtmlServiceData){      
              AmpCa.utils.getHtmlServiceData({
                auth: {
                  baseUrl: "https://c1.adis.ws",
                  id: value.trim(),
                  store: "moltonbrown",
                  templateName: "slot-contentWrapper",
                  locale: baseSite.locale
                },
                callback: function(data) {
                  const temp = {
                    templatename: data
                  };
                  if(obj.categoryDisplayName !='Editorial'){
                    obj["subcategories"][objId]["content"].push(temp);
                  }else{
                    obj['ampContent'].push(temp);
                  }
                }
              });
        }
      }
    }
      }  });
      }
    });
    that.catalogmenu = catalog;
  }
  constructCatalog(category) {
    category.map((obj, k) => {
      if (obj["subcategories"]) {
        category[k]["subcategories"].sort(function(a, b) {
          return a.order - b.order;
        });
      }
    });
    const catalogTree = this.nestedCopy(category);
    const copyCatlogtree =this.nestedCopy(category);
    catalogTree.map((obj, i) => {
      if(obj.subcategories){
      const root=  obj.subcategories.sort((a,b)=>{
        return a.order - b.order;
      });
      if (root) {
        root.map((item) => {
          const _obj = _.filter(copyCatlogtree[i]["subcategories"], (o)=> {
            if (o.parent) {
              return item.id == o.parent;
            }
          });
          if (_obj.length !=0) {
              item["subcategories"] = _obj;
              _obj.map(() => {
                const _objIndx = _.findIndex(catalogTree[i]["subcategories"],(o:any) =>{
                    return item.id == o.parent;
                  }
                );
                catalogTree[i]["subcategories"].splice(_objIndx, 1);
              });
          }
        });
      }
      }
    });
    this.catalogTree=catalogTree;
    this.singletonServ.menudata = this.catalogTree;
    const menuInfo = { catgories: catalogTree };
    this.singletonServ.sendMessage(menuInfo);
  }

  chunkArray(myArray, chunk_size) {
    let results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
 
  }
  ngAfterViewInit() {
    const baseSite=this.singletonServ.catalogVersion;
    this.singletonServ.getMessage().subscribe(message => {
      if (message.access_token) {
        this.signIn = true;
        this.singletonServ.loggedIn = true;
      }else if (message.baseSiteChange) {
        // this.renderCatalogData();
        // const _obj = {
        //   updateCart: true
        // };
        // this.singletonServ.sendMessage(_obj);
      } else if (message.getCatalog) {
        this.renderCatalogData();
      } else if(message.pointAsAsagent){
         this.renderCatalogData();     
      }
    });
    if(this.singletonServ.getStoreData(baseSite.reg)){
      this.signIn=true;
    }
    this.renderCatalogData();
  }
  checkuser(){
    const baseSite=this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData(baseSite.reg)){
     return true;
    }
    return false;
  }
  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }
  onhidesubmenu() {
    this.mouseEnter = false;
  }
  toggleMenu(event) {
    event.preventDefault();
    // this.singletonServ.scrollToTarget('#mySidenav');
     this.sideNav.nativeElement.scrollTo(0, 0);
     this.onSidemenutap();
  }
  swipMenu(event) {
   this.onSidemenutap();
  }
  onHoverCategory(item, i) {
    if (item.name != "Editorial") {
      this.mouseEnter = true;
      this.catalogmenu.map((obj, id) => {
        if (id == i) {
          obj.bg = true;
        } else {
          obj.bg = false;
        }
      });
    } else {
      this.catalogmenu.map((obj, id) => {
        if (id == i) {
          obj.bg = true;
        } else {
          obj.bg = false;
        }
      });
      this.mouseEnter = true;
    }
    this.singletonServ.sendMessage({hideCart:true})
  }
  onPolicesCntntClick(event,data) {
    event.preventDefault();
    if(data.templateName){
      this.router.navigate(["store", data.templateName]);   
      this.onSidemenutap();   
    }
  }
  onFooterCntntClick(event,data) {
    event.stopPropagation();
   if (data.org) {
     if(data.childRouteName){
      this.router.navigate(["store", data.templateName, data.childRouteName]);
     }
     else{
      this.router.navigate(["store", data.templateName]);
     }
      
    } else {
      if(data.routePDF){
        window.open(data.routePDF)
       }else
      if (data.routename) {
        this.router.navigate(["store", data.routename]);
      }
    }
    this.onSidemenutap(); 
  }


  onShowEditorialPage(event) {
    this.router.navigate([
      "store/features"
    ]);
    this.onSidemenutap();
  }
  onTapNewsLetter() {
    this.renderMenu();
    this.router.navigate(["store", "newsletter-sign-up"]);
    this.onSidemenutap();
  }
  onShowMenucategory(event, item) {
    event.stopPropagation();
    event.preventDefault();
    if (item.subcategories.length == 0) {
      const url = "/store" + item.url.replace("/c/", "/");
        this.router.navigate([url]);
        this.onSidemenutap();
    }
  }
  onShowcategory(event, item) {
    event.preventDefault();
    if (!item.subcategories||item.subcategories.length == 0) {
      let url = "/store" + item.url.replace("/c/", "/");
      this.router.navigate([url]);
      this.onSidemenutap();
    }
  }

  onShowMbSubCategoryProduct(event, current) {
    event.stopPropagation();
    event.preventDefault();
    const url = "/store" + current.url.replace("/c/", "/");
    if (current.id != "catUKPickMixTravel") {
        this.router.navigate([url]);
    } else {       
        this.router.navigate([url]);
    }
    this.renderMenu();
    this.onSidemenutap();
  }
  onTapRegister() {
    this.router.navigate(["store", "myacc", "mbRegister"]);
    this.renderMenu();
    this.onSidemenutap();
  }
  onTapLogin() {

    this.router.navigate(["store", "myacc", "mbLogin"]);
    this.renderMenu();
    this.onSidemenutap();
  }
  renderMenu() {
    this.singletonServ.menudata = this.catalogTree;
    this.catalogTree.map((obj, id) => {
      obj.bg = false;
    });
    this.mouseEnter = false;
  }
  onTapViewAllCat(event, sidemenu) {
    event.preventDefault();
    this.onSidemenutap();
    let url = "/store" + sidemenu.url.replace("/c/", "/");
    this.router.navigate([url]);
    this.renderMenu();
  }
  getRouterPath(current){
    if(current.categoryDisplayName === "Treats"){
      const _url="/store/special-offers/"+current.id;
      return _url;
    }else    if(current.categoryDisplayName === "Editorial") {
          return "/store/features";
    }else  if(current.name== "special-offers"){
        const _url="/store/special-offers/"+current.id;
        return _url;
    }else if (current.isL3 || (!current.parent && current.description)) {
         if (current.id != "catUKPickMixTravel") {
          const url = "/store" + current.url.replace("/c/", "/");
          return url;
      } else {
          const url = "/store" + current.url.replace("/c/", "/");
          return url;
      }
     return ""
    }
    return ""
  }

  onShowMbCategoryProduct(event, data) {
    event.stopPropagation(); 
    event.preventDefault();
  if(data.categoryDisplayName === "Treats"){

      if(event.ctrlKey && event.which === 1){
        const _url="/store/special-offers/"+data.id;
        window.open(_url); 
      } else {   
        
        const _uri="store/special-offers/"+data.id;    
        this.mouseEnter = false;
        this.catalogmenu.map((obj, id) => {
            obj.bg = false;
        });
        this.renderMenu();
        this.router.navigate([_uri]);
     }
    } else  if(data.categoryDisplayName === "Editorial") {

            if(event.ctrlKey && event.which === 1){
              window.open("/store/features"); 
            } else {              
              this.mouseEnter = false;
              this.catalogmenu.map((obj, id) => {
                  obj.bg = false;
              });
              this.renderMenu();
              this.router.navigate([
                "store/features"
              ]);
          }
    } else {


      this.mouseEnter = false;
      this.catalogmenu.map((obj, id) => {
          obj.bg = false;
      });
      const routeId = data.id;
      this.singletonServ.menudata = this.catalogTree; 

      if(event.ctrlKey && event.which === 1){
        let url = "/store" + '/'+data.name+'/'+routeId;
        window.open(url); 
      } else {
          this.mouseEnter = false;
          this.catalogmenu.map((obj, id) => {
              obj.bg = false;
          });
          this.renderMenu();
          this.router.navigate(["/store", data.name, routeId]);
     }

    } 
  }

  onClickSubCategory(event, current) {
    event.stopPropagation();
    event.preventDefault();
    if (current.isL3 || (!current.parent && current.description)) {      
       if(current.name== "special-offers"){
            if(event.ctrlKey && event.which === 1){
              const _url="/store/special-offers/"+current.id;
              window.open(_url); 
            } else {  
              const _uri="store/special-offers/"+current.id;        
              this.mouseEnter = false;
              this.catalogmenu.map((obj, id) => {
                  obj.bg = false;
              });
              this.renderMenu();
              this.router.navigate([_uri]);
          }
      } else  {
        if(current.isCategoryToBeRedirected){
          this.searchCategoryInstance(event,current);
        }else{        
          const url = "/store" + current.url.replace("/c/", "/");
          if(event.ctrlKey && event.which === 1){
             window.open(url); 
          } else {
            this.mouseEnter = false;
            this.catalogmenu.map((obj, id) => {
                obj.bg = false;
            });
            this.renderMenu();
            this.router.navigate([url]);
            this.catalogmenu.map(obj => {
              obj.bg = false;
            });
          }          
      }
    }
    }
  }
  searchCategoryInstance(event,data){
    const that = this;
    const baseSite=this.singletonServ.catalogVersion;
    this.headerServ.verifyProduct(baseSite,data.id).subscribe((response:any)=>{
      if(response.keywordRedirectUrl){
          this.mouseEnter = false;
          this.catalogmenu.map((obj, id) => {
              obj.bg = false;
          });
          if(event.ctrlKey && event.which === 1){
            window.open(response.keywordRedirectUrl); 
        } else {
              this.mouseEnter = false;
              this.catalogmenu.map((obj, id) => {
                  obj.bg = false;
              });
              this.renderMenu();
              this.router.navigate([response.keywordRedirectUrl]);
        }
    }
    });
  }
  onmouseLeave() {
    this.catalogmenu.map(obj => {
      obj.bg = false;
    });
    this.mouseEnter=false;
  }
  mouseLeave() {
    this.mouseEnter = false;
  }
  onEnterSearcKeyUp(event){
    if(event.target.value.length ==0){
      this.searchBlockClose =false;
    }else{
      this.searchBlockClose =true;
      this.onSearcKeyUp(event);    
    }
  }
  onResetSearchIcon(event){
    this.searchBlockClose=false;
    this.searchMobField.nativeElement.value="";
    this.searchResults.length=0;
  }
  onSearcKeyUp(event) {
    if(event.keyCode==13){
        event.target.blur();   
        const val=event.target.value.trim();
        const deocdeVal =encodeURIComponent(val);    
        if(deocdeVal.length!=0){
          this.singletonServ.removeItem("searchId");          
         this.router.navigate(["store", "browse", deocdeVal]); 
         this.openSearcgLandingPage(); 
       }
    }else{      
       this.onMenuSearchChange(event,event.target.value)
    }
  }
  onTapSearchIcon(event){
    const val=this.searchMobField.nativeElement.value.trim();
    const deocdeVal =encodeURIComponent(val); 
    if(deocdeVal.length!=0){    
      this.singletonServ.removeItem("searchId");          
      this.router.navigate(["store", "browse", deocdeVal]); 
      this.openSearcgLandingPage()
    }
  }
  openSearcgLandingPage(){
      this.searchResults.length=0;
      this.searchCtgry = false;
      this.searchBlock = false;
      this.searchBlockClose = false
      this.searchPrdctText = "";
      this.searchResultValue = "";
      this.searchQuery='';
      this.searchMobField.nativeElement.value="";
      this.onSidemenutap();
  }

  onMenuSearchChange(event,searchValue: string) {
    this.searchCtgry = true;
    const baseSite=this.singletonServ.catalogVersion;
    const val=searchValue.trim();
    this.searchResultValue = val;
    this.openSearchInput=true;
    this.searchQuery=val;
    if(event.keyCode==13){
      this.searchResults.length=0;
    }else{      
    if (val.length >= 3) {
      const deocdeVal =encodeURIComponent(val);
      this.headerServ
        .getCategorySearchResults(baseSite,deocdeVal)
        .subscribe(
          resp => {
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
  }
  }
  onSearchMoreResults(){
    this.searchBlockClose =false;
    this.onSidemenutap();
    this.onSubmitForm(event);
  }
  onMenuSearchProduct(event, searchItem) {
      event.stopPropagation();
      this.searchForm.reset();
      this.searchBlockClose=false;
      this.onSearchProduct(event, searchItem);
      this.onSidemenutap();
  }
  onTapAccount(){
    this.onSidemenutap();
    this.onProfileClick();
  }
  onTapLogut(){
    const that =this;
    this.onSidemenutap();
    this.signIn=false;  
    this.singletonServ.removeItem("order");
    let _sessionNames=Object.keys(localStorage);
    if(_sessionNames.length){
      _sessionNames.map((obj)=>{
        if(obj !='prefered_lng'){
           that.singletonServ.removeItem(obj);
        }
      })
    }
    this.singletonServ.sendMessage({sampleAdded:true});
    this.router.navigate(["store", "myacc"]);
  }
  keyMobDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this.searchBlockClose =false;
      this.onSidemenutap();
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
  onSubmitMobForm(event){
    this.onSidemenutap();
    this.searchBlockClose =false;
    this.onSubmitForm(event);
  }
}
