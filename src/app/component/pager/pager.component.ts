import {
   Component,
   OnInit,
   Input,
   Output,
   EventEmitter,
   OnChanges,
   SimpleChange
  } from "@angular/core";
  import * as _ from "lodash";
  
import {TranslateServiceSubService} from '../../pipe/translate-service-sub.service';
import { SingletonService } from "../../services/singleton.service";
@Component({
  selector: "app-pager",
  templateUrl: "./pager.component.html",
  styleUrls: ["./pager.component.scss"]
})
export class PagerComponent implements OnInit,OnChanges {
   pageOption: any;
   totalProducts: number;
   numberOfproducts: number;
   totalNumber: any;
   currentPage: any;
   pageNumber: any;
   pgItems:any;
   _copyPager:any;
   @Input() pager: boolean;
   @Input() pagination: any;
   @Input() catalogSpecific: boolean;
   @Input() viewAllProducts: boolean;
   @Output() productperPage: EventEmitter<any> = new EventEmitter<any>();
   @Output() viewAll: EventEmitter<any> = new EventEmitter<any>();
   @Output() fetchperPage: EventEmitter<any> = new EventEmitter<any>();
   @Output() onShowFirstPage: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public translate: TranslateServiceSubService,
    public singletonServ: SingletonService,) {
    this.numberOfproducts=12;
    this.viewAllProducts=false;
    this.pager=true;
  }

  ngOnInit() {
    
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["pagination"]) {
      if (changes["pagination"]["currentValue"] != undefined) {
        const _pager = changes["pagination"]["currentValue"];
        this._copyPager=this.nestedCopy(changes["pagination"]["currentValue"]);
        this.totalProducts=_pager["totalResults"];        
        this.pgItems = this.getPager(changes["pagination"]["currentValue"]["totalResults"], changes["pagination"]["currentValue"]["currentPage"]);
        this.currentPage = this.pgItems["currentPage"];
        this.pageOption=_pager;
      
      }
    }
  }
    convertNextString() {
    let _number = this.pageNumber + 1;
    return _number;
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  convertPrevString() {
    let _number = this.pageNumber - 1;
    return _number;
  }
  getCurrentPage(k){
    const _pag=this._copyPager['currentPage'];
    return (_pag+1 == k)
  }
  fetchProductperPage(event, page) {    
    event.preventDefault();
    const _obj = {
      page: page,
      pageId:page
    };
    this.pageNumber = page;
    this.productperPage.emit(_obj);
  }
  showFirstPage(event, page) {
    const _obj = {
      page: 1
    };
    event.preventDefault();
    this.onShowFirstPage.emit(_obj);
  }
  onviewAllClick(event) {
    event.stopPropagation();
    const _obj = {
      status: status
    };
    this.catalogSpecific = true;
    this.pager = false;
    this.viewAllProducts = true;
    this.viewAll.emit(_obj);
  }

  fetchProductNextperPage(event, status: boolean) {
    event.preventDefault();
    const _obj = {
      status: status
    };
    this.fetchperPage.emit(_obj);
  }

  nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }

  getPager(totalItems: number, currentPage: number, pageSize: number = 12) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    // ensure current page isn't out of range
    if (currentPage < 1) { 
        currentPage = 1; 
    } else if (currentPage > totalPages) { 
        currentPage = totalPages; 
    }
    
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
    } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
    } else {
        startPage = currentPage - 2;
        endPage = currentPage+2;
    }
    }

  //   // calculate start and end item indexes
  //   let startIndex = (currentPage - 1) * pageSize;
  //   let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  //  // create an array of pages to ng-repeat in the pager control
  //  let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = _.range(startPage, endPage + 1);
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}

}
