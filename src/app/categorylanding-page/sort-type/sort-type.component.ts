import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import * as _ from "lodash";
import { SingletonService } from "../../services/singleton.service";
@Component({
  selector: "app-sort-type",
  templateUrl: "./sort-type.component.html",
  styleUrls: ["./sort-type.component.scss"]
})
export class SortTypeComponent implements OnInit, OnChanges {
  @ViewChild("facetTag") facetValue: ElementRef;
  @Input() clearAllFilterTypes:boolean;
  @Input() searchDisplay: boolean;
  @Input() searchPrdId: string;
  @Input() facets: any;
  @Input() refineFacets: any;
  @Input() checkList: boolean;
  @Output() onGridToggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearAll: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSortByChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterby: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowFilterFacet: EventEmitter<any> = new EventEmitter<any>();
  gridToggle: boolean = true;
  paths: string;
  checkedCount: number;
  refinePath: string;
  IsmodelShow: boolean;
  mbFacet: boolean;
  checkedfilter: boolean;
  sortId: any;
  showFacets: boolean;
  checkedData: any = [];
  constructor(public singletonServ: SingletonService) {}

  ngOnInit() {}
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {}
  onGridClick(bol) {
    const _obj = {
      status: bol
    };
    this.gridToggle = bol;
    this.onGridToggle.emit(_obj);
  }
  onClearAll() {
    this.clearAll.emit();
  }
  sortByCahnge(event) {
    const obj={value:event.target.value};
    this.onSortByChange.emit(obj);
  }
  onMbFilterByClick() {
    this.refinePath = "";
    this.refineFacets = [];
    this.mbFacet = true;
    this.IsmodelShow = true;
    this.onShowFilterFacet.emit();
  }
  onShowFilters() {}
  onRefineitem(data, sortId) {
    this.sortId = sortId;
    this.refinePath = data.name;
    this.mbFacet = !this.mbFacet;
    this.IsmodelShow = !this.IsmodelShow;
    this.refineFacets = data.values;
    this.checkedfilter = true;
    this.checkList = false;
    this.showFacets = false;
  }
  ontapClear(event) {}
  checkListDone() {
    this.refinePath = "";
    this.mbFacet = !this.mbFacet;
    this.refineFacets = [];
    this.checkedfilter = false;
    this.IsmodelShow = true;
    this.showFacets = false;
    this.checkList = true;
  }
  ontapApplyFacets() {}
}
