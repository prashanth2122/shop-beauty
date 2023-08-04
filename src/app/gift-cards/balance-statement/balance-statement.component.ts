import { Component, OnInit,ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { SingletonService } from "../../services/singleton.service";
import { PagerService } from "../../services/pager.service";
@Component({
  selector: 'app-balance-statement',
  templateUrl: './balance-statement.component.html',
  styleUrls: ['./balance-statement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BalanceStatementComponent implements OnInit {
  balanceSheet:any;
  viewAllProducts:boolean;
allItems:any=[];
amountstring:string;
orderItems:any;
pager:any = {};
pagedItems: any[];
pageNumber:number;
pageLoad:boolean;
pagination:any;
pageSize:number=5;
giftcardnumber:string;
  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public pagerService: PagerService
    ) {
    this.viewAllProducts=false; 
    this.pageNumber=0;
    this.pageLoad=false;
  }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    const baseSiteid = baseSite.catalogversionId;
    let baseSiteidGift=baseSiteid+'-Giftcard';
    if(this.singletonServ.giftObj){
      this.balanceSheet=this.singletonServ.giftObj;
      this.allItems = this.balanceSheet["certHist"];
      if (this.allItems) {
        this.setPage(1);
      }
    }else
    if(this.singletonServ.getStoreData(baseSiteidGift)){
      let data=JSON.parse(this.singletonServ.getStoreData(baseSiteidGift));
      this.balanceSheet=data;
      this.allItems = this.balanceSheet["certHist"];
      this.giftcardnumber =this.balanceSheet['GiftcardNumber'];
      this.giftcardnumber=this.giftcardnumber.slice(0,(this.giftcardnumber.length/2-2))+"****"+this.giftcardnumber.slice((this.giftcardnumber.length/2+2),(this.giftcardnumber.length));
      if (this.allItems) {
        this.setPage(1);
      }
    }
  }
  
  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page,5);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
}

onviewAllProducts(pager){
  this.pagedItems=this.allItems;
  this.viewAllProducts=true;
}

onNavigateHome(event) {
  event.preventDefault();
  if(event.ctrlKey && event.which === 1){
      let url = "/store/index";
      window.open(url); 
  }else{
    this.router.navigate(["store", "index"]);
  }
}
getRetrieve(amount){
  if(amount){
   const _amount =amount.toLocaleString().replace('-','');
   return _amount;
  }else{
    return amount; 
  }
}
}
