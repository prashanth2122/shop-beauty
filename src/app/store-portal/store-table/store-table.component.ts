import { Component, OnInit } from '@angular/core';
import {StorePortalService} from '../store-portal.service';
import {SingletonService} from '../../services/singleton.service';
import { Router } from "@angular/router";
import * as _ from "lodash";
@Component({
  selector: 'app-store-table',
  templateUrl: './store-table.component.html',
  styleUrls: ['./store-table.component.scss']
})
export class StoreTableComponent implements OnInit {
  switchOrderType:string;
  orderEntryData:any;
  storesList:Array<any>=[];
  storesCancelList:any;
  loadOverlay:boolean;
  constructor(
    public portalServ : StorePortalService,
    public singletonServ :SingletonService,
    public router: Router
  ) { 
    this.loadOverlay=true;
    this.switchOrderType='dispatch';
    this.orderEntryData={
      switchStatus:'dispatch',
      serialNo:'S No',
      select:true,
      orderNumber:'Order Number',
      customerName:'Customer Name',
      orderDate:'Order Date',
      amount:'Value',
      action:'Action'
    }
  }

  ngOnInit() {
    this.loadOverlay=true;
    this.storesList = [];
    this.storesCancelList = [];
    this.fetchDispatchedOrders('COMPLETELYPROCESSED',{})
  }
  fetchDispatchedOrders(status,body){
    const baseSite=this.singletonServ.catalogVersion;
    if(this.singletonServ.getStoreData('portalEncoder')){
      const _portal =JSON.parse(this.singletonServ.getStoreData('portalEncoder'));
     this. retrieveDispatchOrders(baseSite,_portal.token,_portal.storeName,status,body);
   }
  }
  retrieveDispatchOrders(baseSite,token,storeName,status,body) {
    const that=this;
    const _portal =JSON.parse(this.singletonServ.getStoreData('portalEncoder'));
    this.portalServ.retrieveStores(baseSite,token,storeName,status,body).subscribe((response:any)=>{
      if(response){
         if(response.ordersList){           
          if(status =='COMPLETELYPROCESSED'){
            if(response.ordersList){                
                response.ordersList.map((obj)=>{
                  obj['switchStatus']="COMPLETELYPROCESSED";
                });              
                this.storesList=response.ordersList;
                this.orderEntryData.orders=response.ordersList;
                setTimeout(()=>{
                  this.loadOverlay=false;
                },200);
              } else {
                this.storesList = [];
                setTimeout(()=>{
                  this.loadOverlay=false;
                },200);
              }
          }else if( status =='READYTOCOLLECT' ){
            if(response.ordersList){
            response.ordersList.map((obj)=>{
              obj['switchStatus']="collected";
            });
            this.orderEntryData.orders=response.ordersList;
            this.storesList=response.ordersList;
            setTimeout(()=>{
              this.loadOverlay=false;
            },200);
            }else{
              this.storesList = [];
              setTimeout(()=>{
                this.loadOverlay=false;
              },200);
            }
          } else if( status =='COLLECTORCANCEL' ){
            if(response.ordersList){
            
                const cancelOrder = response.ordersList.filter((obj)=>{
                  return obj.status== "CANCELLEDNOTCOLLECTED"
                });
                const _collectedOrder = response.ordersList.filter((obj)=>{
                  return obj.status== "COLLECTEDATSTORE"
                });
                if(_collectedOrder.length !=0){
                  _collectedOrder.map((obj)=>{
                    obj['switchStatus']="collectedList";
                  });
                 }
                 if(cancelOrder.length !=0){
                  cancelOrder.map((obj)=>{
                    obj['switchStatus']="cancelledList";
                  });
                }
                this.storesList=_collectedOrder;
                this.storesCancelList=cancelOrder;
                this.loadOverlay=false;
           } else {
            this.storesList = [];
            this.storesCancelList = [];
            this.loadOverlay=false;
           }
          }
         } else{
          setTimeout(()=>{
            this.loadOverlay=false;
          },200);
         }
      }
    
    },(err:any)=>{
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.portalServ.generateToken(baseSite).subscribe((resp)=>{
                  _portal.token=resp["access_token"];
                  this.singletonServ.setStoreData('portalEncoder',JSON.stringify(_portal));
                  this.retrieveDispatchOrders(baseSite,resp["access_token"],storeName,status,body);
              });
            }
          }
          }
         }
    });
  }
  onSubmitAction(event,status){
    event.preventDefault();
    this.loadOverlay=true;
    if(status =='dispatch'){
      this.switchOrderType='dispatch';
      this.orderEntryData['select']=true;
      this.orderEntryData['switchStatus']='dispatch';
      this.storesList = [];
      this.storesCancelList = [];;
      this.fetchDispatchedOrders('COMPLETELYPROCESSED',{});
    }else if(status=='collected'){
      this.switchOrderType='collected';
      this.orderEntryData['select']=false;
     this.orderEntryData['switchStatus']="collected";
     this.storesList = [];
     this.storesCancelList = [];
    this.fetchDispatchedOrders('READYTOCOLLECT',{});
    } else if(status=='orderStatus'){
      this.switchOrderType='orderStatus';
      this.orderEntryData['select']=false;
      this.orderEntryData['action']='status';
      this.orderEntryData['switchStatus']="orderStatus";
      this.storesList = [];
      this.storesCancelList = [];
      this.fetchDispatchedOrders('COLLECTORCANCEL',{});
    }
  }
  doOrderDispactch(data,status){
    const baseSite=this.singletonServ.catalogVersion;
    const stat = (status ==='DISPATCHEDTOSTORE')?'READYTOCOLLECT':status;
    if(this.singletonServ.getStoreData('portalEncoder')){
      this.storesList = [];
      this.storesCancelList = [];
      const _portal =JSON.parse(this.singletonServ.getStoreData('portalEncoder'));
      this.retrieveDispatchedStore(baseSite,_portal.token,_portal.storeName,stat,data);
   }
  }
  retrieveDispatchedStore(baseSite,token,storeName,stat,data) {
    const _portal =JSON.parse(this.singletonServ.getStoreData('portalEncoder'));
    this.portalServ.retrieveDispatchedStores(baseSite,token,storeName,stat,data).subscribe((response:any)=>{
      if(response){
         if(response.ordersList){
          if( stat =='READYTOCOLLECT' ){
            this.switchOrderType='collected';
            this.orderEntryData['select']=false;
            this.orderEntryData['switchStatus']="collected";
            this.orderEntryData.orders=response.ordersList;
            response.ordersList.map((obj)=>{
              obj['switchStatus']="collected";
            });
            this.storesList=response.ordersList;
            setTimeout(()=>{
              this.loadOverlay=false;
            },200);
          } else if( stat =='COLLECTORCANCEL' ){
            this.switchOrderType='orderStatus';
            this.orderEntryData['select']=false;
            this.orderEntryData['action']='status';
            this.orderEntryData['switchStatus']="orderStatus";

            const cancelOrder = response.ordersList.filter((obj)=>{
              return obj.status== "CANCELLEDNOTCOLLECTED"
            });
            const _collectedOrder = response.ordersList.filter((obj)=>{
              return obj.status== "COLLECTEDATSTORE"
            });
            if(_collectedOrder.length !=0){
            _collectedOrder.map((obj)=>{
              obj['switchStatus']="collectedList";
            });
           }
           if(cancelOrder.length !=0){
            cancelOrder.map((obj)=>{
              obj['switchStatus']="cancelledList";
            });
          }
            this.storesList=_collectedOrder;
            this.storesCancelList=cancelOrder;
            setTimeout(()=>{
              this.loadOverlay=false;
            },200);
          }
        } else {
          this.storesList = [];
          this.storesCancelList = [];
          setTimeout(()=>{
            this.loadOverlay=false;
          },200);
        }
      }

    },(err:any)=>{
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.portalServ.generateToken(baseSite).subscribe((resp)=>{
                _portal.token=resp["access_token"];
                this.singletonServ.setStoreData('portalEncoder',JSON.stringify(_portal));
                this.retrieveDispatchedStore(baseSite,token,storeName,stat,data);
            });
            }
          }
          }
         }
    });
  }
}
