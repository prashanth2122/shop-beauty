import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter
} from "@angular/core";
import { SingletonService } from "../../../../services/singleton.service";
import { StorePointComponentService } from "../storepoint.service";
import { GtmMethodService } from '../../../../services/gtmmethods.service';
declare var conv_clickCollect_selectStore:number;
declare var _conv_q:any;
@Component({
  selector: "app-collection-list",
  templateUrl: "./collection-list.component.html",
  styleUrls: ["./collection-list.component.scss"]
})
export class CollectionListComponent implements OnInit, OnChanges {
  @Input() storeList: any;
  @Output() emitselectedStore: EventEmitter<any> = new EventEmitter<any>();
  @Output() showMapsOpenHour: EventEmitter<any> = new EventEmitter<any>();  
  stores: Array<any> = [];
  storeicon:boolean;
  viewmapus:boolean;
  constructor(
    public singletonServ: SingletonService,
    public storeServ: StorePointComponentService,
    public gtmServ:GtmMethodService
  ) {}

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    if(baseSite['countryCode']=='gb'){
      this.storeicon =true;
    }
    else{
      this.storeicon =false;
      this.viewmapus=true;
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["storeList"]) {
      if (changes["storeList"]["currentValue"] != undefined) {
      }
    }
  }
  onSelectStore(event, data) {
    event.preventDefault();
    conv_clickCollect_selectStore=1;
    _conv_q = _conv_q || [];
    _conv_q.push(["run","true"]);

    this.singletonServ.scrollToTarget("#dl-header");
    const baseSite = this.singletonServ.catalogVersion;
    const _obj = {
      clickCollect:true,
      selectedStore: data
    };
    this.singletonServ.sendMessage({overlay:true});
    if (this.singletonServ.getStoreData(baseSite.reg)) {      
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.reg));
      this.setStore(user.token,user.email,user.code,data,_obj);
    } else {
      if (this.singletonServ.getStoreData(baseSite.guest)) {
        const _guest = JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
        this.setStore(_guest.token,'anonymous',_guest.guid,data,_obj);
      }
    }
      const actionCarriedOut:string = 'Select Store';
      const storedetails = data.name;
      this.gtmServ.gtmStoreLocator(actionCarriedOut,storedetails); 
  }

  setStore(token,email,code,data,_obj){
    const baseSite = this.singletonServ.catalogVersion;
    this.storeServ.setStore(baseSite,token,email,code,data).subscribe((response)=>{
      this.singletonServ.sendMessage(_obj);
      this.emitselectedStore.emit(_obj);
    },err=>{
      if(err.error){
        if(err.error["errors"]){
          if(err.error["errors"][0]){
            if(err.error["errors"][0]['type']== "InvalidTokenError") {
              this.storeServ.generateCartToken(baseSite).subscribe(
                (resp:any) => {
                        const user=JSON.parse(this.singletonServ.getStoreData(baseSite.guest));
                        user.token= resp["access_token"];
                        this.singletonServ.setStoreData(baseSite.guest, JSON.stringify(user));
                        this.setStore(resp["access_token"],email,code,data,_obj);                       
                    });
            }else{
                this.emitselectedStore.emit(_obj);
                this.singletonServ.sendMessage({overlay:false}); 
            }
          }
          }
         }  
    })
  }
  onShowMapHours(data){
 this.showMapsOpenHour.emit(data);
  }
}
