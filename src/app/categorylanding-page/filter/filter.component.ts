import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  SimpleChange,
  AfterViewInit
} from "@angular/core";
import * as _ from "lodash";
import { SingletonService } from "../../services/singleton.service";
import { GtmMethodService } from '../.././services/gtmmethods.service';
import {TranslateServiceSubService} from '../../pipe/translate-service-sub.service';
import {
  trigger, 
  transition, 
  state, 
  animate, 
  style, 
  AnimationEvent 
 } from '@angular/animations';
 declare var $:any;
@Component({
  selector: "app-filter",
  animations: [
    trigger('openClose', [
      state('open', style({
         display:'block',
         height: 'auto',
         visibility: 'visible',
         animationDuration: '1s',
         animationDelay: '1s',
         maxHeight: '175px'
      })),
      state('closed', style({
        display:'none',
        height: '0px',
        visibility: 'hidden',
        maxHeight: '0px',
        animationDuration: '1s',
        animationDelay: '1s'
       })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('1s')
      ]),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('1s')
      ]),
      transition('open <=> closed', [
        animate('1s')
      ]),
      transition('* => *', [
        animate('1s')
      ]),
    ])
  ],
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit, OnChanges {
  @ViewChild("facetTag") facetValue: ElementRef;
  @Input() modal: boolean;
  @Input() openFacet: boolean;
  @Input() searchDisplay: boolean;
  @Input() searchPrdId: string;
  @Output() clearAll: EventEmitter<any> = new EventEmitter<any>();
  @Output() refetchProducts: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearParams: EventEmitter<any> = new EventEmitter<any>();
  @Input() facetResponse: any;
  @Input() catId: string;
  @Input() logging = false;
  checkListId:any;
  checkedData: any = [];
  facets: any;
  checkList: boolean = false;
  showFacets: boolean;
  checkedCount: number;
  paths: string;
  mbFacet: boolean;
  refinePath: string;
  IsmodelShow: boolean;
  refineFacets: Array<any>;
  checkedfilter: boolean;
  sortId: number;
  siteSpecific: boolean;
  taponCleartapped:boolean;
  copyFacets:any;
  dummyFacets:any;
  checkedValueIdList:Array<any>;
  constructor(public singletonServ: SingletonService,public gtmServ:GtmMethodService,
    public translate: TranslateServiceSubService ) {
    this.checkedCount = 1;
    this.refinePath = "";
    this.IsmodelShow = true;
    this.mbFacet = true;
  }

  ngOnInit() {
    const that = this;
    const baseSite = this.singletonServ.catalogVersion;
    if (baseSite) {
      if (baseSite.isoCode == "DE") {
        that.siteSpecific = false;
      } else {
        that.siteSpecific = true;
      }
        const lngCode = baseSite.lngCode;
        this.setLang(lngCode);
     
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["facetResponse"]) {
      if (changes["facetResponse"]["currentValue"] != undefined) {
        const _currentVal = changes["facetResponse"]["currentValue"];
        that.renderFacets(_currentVal.status, _currentVal.facets);
      }
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  renderFacets(status, resp) {
    if(resp){
    let checkFilterStatus:boolean = false;
    if (this.facetValue) {
      if (
        this.facetValue.nativeElement.querySelector(
          "input[type=checkbox]:checked"
        )
      ) {
        checkFilterStatus = true;
      }
    }
    if (status) {
        resp.map((obj)=>{    
          if(obj.name !="Ratings")   {
            obj['values'].sort((a,b)=>{
              if (a.name < b.name) return -1;
              else if (a.name > b.name) return 1;
              return 0;           
            });  
          }    
        });
        this.singletonServ.facets=resp;
        this.facets = resp;
    } else {
      const _facets=this.singletonServ.facets;
      if(_facets){
      if(_facets){
        _.map(_facets, (obj,i) => {
          obj["values"].map((item,k) => {
            if (!item.selected) {
              const _index=_.findIndex(resp,(data:any)=>{
                return data.name==obj.name;
              });
              if(_index !=-1){
                    const _valIndex=_.findIndex(resp[_index]['values'],(data:any)=>{
                      return data.name==item.name;
                    });
                    if(_valIndex !=-1){
                      item["disable"] = false;
                      item["count"] = resp[_index]['values'][_valIndex]['count'];
                    }else{
                      item["disable"] = true;
                    }
             }else{
              item["disable"] = true;
             }
            }else {
              const _index=_.findIndex(resp,(data:any)=>{
                return data.name==obj.name;
              });
              if(_index !=-1){
                    const _valIndex=_.findIndex(resp[_index]['values'],(data:any)=>{
                      return data.selected;
                    });
                    if(_valIndex !=-1){
                      obj.open=true;
                    }
              }
     
            }
          });
        });
        this.facets=_facets;
        }

        // if(!that.facets){
        //   that.facets=this.dummyFacets.facts;
        // }
    }
    }
  }
}



 
  onFacetClicked(filterData, sortId) {
    this.facets[sortId]["checked"] = !this.facets[sortId]["checked"];
    this.facets[sortId]["open"] = !this.facets[sortId]["open"];
  }


  onShowFilters() {
    this.refinePath = "";
    this.mbFacet = true;
    this.refineFacets = [];
    this.checkedfilter = false;
    this.IsmodelShow = true;
    this.showFacets = true;
    // if(this.checkList){
      this.checkList = false;
    // }
  }


  onClearAll() {
    this.checkList = false;
    this.showFacets = true;
    this.checkedValueIdList=[];
    const obj = {
      clear: true
    };
    this.clearParams.emit(obj);
  }

  ontapClear(event) {
    this.copyFacets=JSON.parse(JSON.stringify(this.facets));
    this.taponCleartapped=true;
    const sortId = this.sortId;
    const _checkFilter = this.facets[sortId]["values"].filter((obj:any)=>{
      obj['selected']=false;
    });

   if(_checkFilter.length !=0){
       this.facets[sortId]["values"].map((obj:any)=>{
          obj['selected']=false;
       });
   }
   this.checkedValueIdList=[];
  }

  onSortByFacets(event, sortId, i) {
    const that = this;
    let checkFilterStatus = false;
    this.checkList = true;
    if (
      this.facetValue.nativeElement.querySelector(
        "input[type=checkbox]:checked"
      )
    ) {
      checkFilterStatus = true;
    }
    this.paths = "";
    const checkedData = [];
    if (event.target.checked) {
      that.facets[sortId]["checked"] = true;
      that.facets[sortId]["values"][i]["selected"] = true;
        const filterCategory =  that.facets[sortId]["name"];
        const filterSelection =  that.facets[sortId]["values"][i]["name"];
                  that.gtmServ.gtmFilterUsage(filterCategory,filterSelection);
       
      _.map(that.facets, obj => {
        _.map(obj.values, item => {
          if (item.selected) {
            that.checkedCount = that.checkedCount + 1;
            const _query:string =item["query"]["query"]["value"];
            const _index   =_query.indexOf(that.catId);
            const facetQuery= item["query"]["query"]["value"].substring(
              _index+that.catId.length,
              item["query"]["query"]["value"].length
            );
            checkedData.push(facetQuery);
          }
        });
      });
      that.checkedData = _.uniq(checkedData);
      const _id = that.checkedData.join("");
      const _serchId = {
        id: _id
      };
      that.refetchProducts.emit(_serchId);
    } else {
      that.facets[sortId]["checked"] = false;
      that.facets[sortId]["values"][i]["selected"] = false;
      _.map(that.facets, obj => {
        _.map(obj.values, item => {
          if (item.selected) {
            const _query:string =item["query"]["query"]["value"];
            const _index   =_query.indexOf(that.catId);
            const facetQuery= item["query"]["query"]["value"].substring(
              _index+that.catId.length,
              item["query"]["query"]["value"].length
            );
            checkedData.push(facetQuery);
          } else {
            that.checkedCount = that.checkedCount - 1;
          }
        });
      });

      that.checkedData = _.uniq(checkedData);
      const id = that.checkedData.join("");
      const _serchId = {
        id: id
      };
      
      that.refetchProducts.emit(_serchId);
    }
  }
  onAnimationEvent ( event: AnimationEvent ) {
    if (!this.logging) {
      return;
    }
  }










 
  onCheckListDone() {
    if(this.taponCleartapped){
      this.onResetFilterCatValues();
    }
    this.refinePath = "";
    this.mbFacet = !this.mbFacet;
    this.refineFacets = [];
    this.checkedfilter = false;
    this.IsmodelShow = true;
    this.showFacets = false;
    this.checkList = true;
    this.checkListId=undefined;
    this.checkedValueIdList=[];
  }
  onResetFilterCatValues(){
    const that=this;
    const checkedData=[];
    const sortId = this.sortId;
    const _checkFilter = this.facets[sortId]["values"].filter((obj:any)=>{
      obj['selected']=false;
    });
  
   if(_checkFilter.length !=0){
    _.map(that.facets, obj => {
      _.map(obj.values, item => {
        if (item.selected) {
          that.checkedCount = that.checkedCount + 1;
          const _query:string =item["query"]["query"]["value"];
          const _index   =_query.indexOf(that.catId);
          const facetQuery= item["query"]["query"]["value"].substring(
            _index+that.catId.length,
            item["query"]["query"]["value"].length
          );
          checkedData.push(facetQuery);
        }
      });
    });
    that.checkedData = _.uniq(checkedData);
    const _id = that.checkedData.join("");
    const _serchId = {
      id: _id
    };
    that.refetchProducts.emit(_serchId);
    that.checkedData = _.uniq(checkedData);
  }
  }
  
  onResetFilters(event){
    let evnt ={'target':{'checked':false}};
    evnt['checked']=false;
    const sortId = this.sortId;
    if(this.checkedValueIdList){
    if(this.checkedValueIdList.length !=0){
      // this.onSortByFacets(evnt, sortId, this.checkListId);
      this.onResetPastFilter();
     }
   }
    if(this.taponCleartapped){
      this.facets=this.copyFacets;
      this.taponCleartapped=false;
    }
    this.refinePath = "";
    this.mbFacet = true;
    this.refineFacets = [];
    this.checkedfilter =false;
    this.IsmodelShow = true;
    this.showFacets = false;
    this.checkList = this.getFacetCount();
  }
  onResetPastFilter(){
    this.checkedValueIdList.map((itemID,i)=>{
      this.facets[this.sortId]['values'][itemID]['selected']=false;
    });
  }
  getFacetCount(){
    let _array=[];
    if(this.facets){
    this.facets.map((val:any) => {
        const _check = val.values.filter((item:any)=>{
          return item.selected
        });
        if(_check.length !=0){
          _array.push(_check);
        }
    });
    if(_array.length !=0){
      return true;
    }else{
      return false
    }
  }
  }
  getCatalogtree(obj) {
    if (obj.selected) {
      return true;
    }
    if (obj.values) {
      for (let item of obj.values) {
        let check = this.getCatalogtree(item);
        if (check) {
          return true;
        }
      }
    }
    return false;
  }

  onRefineitem(data, sortID) {
    this.sortId = sortID;
    this.checkedValueIdList=[];
    this.refinePath = data.name;
    this.mbFacet = !this.mbFacet;
    this.IsmodelShow = !this.IsmodelShow;
    this.refineFacets = data.values;
    this.checkedfilter = true;
    this.checkList = false;
    this.showFacets = false;
  }

  updateFilterData(event, i) {
    this.checkListId=i;
    const sortId = this.sortId;
    this.onSortByFacets(event, sortId, i);//sort filter by check values
    // this.facets[sortId]['values'][i]['selected']=!this.facets[sortId]['values'][i]['selected'];
    if(this.facets[sortId]['values'][i]['selected']){
      this.checkedValueIdList.push(i);
    }
    this.checkList = false;
    this.checkedfilter = true;
  }
  onCloseModal(){
    this.refinePath = "";
    this.IsmodelShow = true;
    this.mbFacet = true;
    this.checkedValueIdList=[];
  }
  ontapApplyFacets() {
    this.refinePath = "";
    this.IsmodelShow = true;
    this.mbFacet = true;
    this.checkedValueIdList=[];
  }
  returnSelectedValues(values){
    const _filter=values.filter((item)=>{
      return item.selected;
    });
    return _filter;
  }
}
