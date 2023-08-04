import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderHistoryService } from "./orders.service";
import { SingletonService } from "../../services/singleton.service";
import { PagerService } from "../../services/pager.service";
@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"]
})
export class OrdersComponent implements OnInit {
  public orderHistoryList = [];
  order: any;
  orderHistoryDetails: boolean;
  ordersHistoryList: boolean;
  viewAllProducts: boolean;
  viewAllProduct: boolean;
  allItems: any = [];
  orderItems: any;
  pager: any = {};
  pagedItems: any[];
  pageNumber: number;
  pageLoad: boolean;
  pagination: any;
  pageSize: number = 5;
  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private _orderHistoryService: OrderHistoryService,
    public singletonServ: SingletonService,
    public pagerService: PagerService
  ) {
    this.ordersHistoryList = true;
    this.viewAllProducts = false;
    this.viewAllProduct=true
    this.pageNumber = 0;
    this.pageLoad = false;
  }

  ngOnInit() {
    this.getOrderHistory();
  }

  getOrderHistory() {
    const baseSite = this.singletonServ.catalogVersion;
    if (this.singletonServ.getStoreData(baseSite.reg)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      if (user.token) {
        this._orderHistoryService
          .getOrderHistoryService(baseSite,user.token, user.email)
          .subscribe(
           (response:any) => {
              if (response) {
                this.order = response;
                this.allItems = response["orders"];
                if (this.allItems) {
                  this.setPage(1);
                }
              }
            },
            err => {}
          );
      } else {
        this._orderHistoryService.generateOrderToken(baseSite).subscribe(respose => {
          const token = respose["access_token"];
          const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
          user["token"] = token;
          this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(user));
          this._orderHistoryService
            .getOrderHistoryService(baseSite,user.token, user.email)
            .subscribe(
              (response:any) => {
                if (response) {
                  this.order = response;
                  this.allItems = response["orders"];
                  this.setPage(1);
                }
              },
              err => {}
            );
        });
      }
    }
  }
  showOrderHistoryDetails(orderHistory) {
    this.ordersHistoryList = false;
    this.router.navigate(["store", "myaccount", "profile", "orderDetails"], {
      queryParams: { orderId: orderHistory.code },
      queryParamsHandling: "merge"
    });
  }
  onGoToHome() {
    this.router.navigate(["store", "home"]);
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page, 5);

    // get current page of items
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
  goToHome() {
    this.router.navigate(["store"]);
  }
  onviewAllProducts(page) {
    this.pagedItems = this.allItems;
   this.viewAllProducts = true;
   this.viewAllProduct=false
    // this.pager =false;
  }
  showFirstPage(){
   this.viewAllProducts = false;
   this.viewAllProduct=true;
   this.getOrderHistory();

  }
}
