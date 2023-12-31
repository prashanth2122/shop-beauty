import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
declare var AmpCa: any;
@Component({
  selector: "app-categorybanner",
  templateUrl: "./categorybanner.component.html",
  styleUrls: ["./categorybanner.component.scss"]
})
export class CategorybannerComponent implements OnInit, OnChanges {
  @ViewChild("categoryBannerEl") categoryBannerEl: ElementRef;
  @Input() categorybanner: any;
  @Input() pagination:any;
  categoryBannerList: any = [];
  childRoot: boolean;
  catBanner: boolean;
  constructor(
    public titleService: Title,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.childRoot = false;
  }

  ngOnInit() {}
  getRouterPath(current){
     const url = "/store" + current.url.replace("/c/", "/");
     return url;
  }
  onSubPrductClick(event, current) {
      event.stopPropagation();
      const url = "/store" + current.url.replace("/c/", "/");
      this.titleService.setTitle(current.titleName);
      if(event.ctrlKey && event.which === 1){
        window.open(url); 
      } else {
        this.router.navigate([url]);
      }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["categorybanner"]) {
      if (changes["categorybanner"]["currentValue"] != undefined) {
        const catlog = changes["categorybanner"]["currentValue"];
        if (catlog["bannerId"] && (catlog.isL3 || catlog.isL2)) {
          that.catBanner = true;
          that.renderTemplate(catlog["bannerId"]);
        } else {
          that.catBanner = false;
          that.categoryBannerList = [];
          if (that.categorybanner["subcategories"]) {
            this.childRoot = true;
            _.forEach(that.categorybanner["subcategories"], function(value, i) {
              if (value["subcategories"]) {
                if (value["subcategories"].length == 0) {
                  that.categoryBannerList.push(value);
                } else {
                  _.forEach(value["subcategories"], function(itm, k) {
                    that.categoryBannerList.push(itm);
                  });
                }
              }
            });
            this.categoryBannerList.sort(function(a, b) {
              return a.id - b.id;
            });
          } else {
            this.childRoot = false;
          }
        }
      }
    }
  }
  renderTemplate(_bannerId) {
    const that=this;
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: _bannerId,
        store: "moltonbrown",
        templateName: "slot-contentWrapper"
      },
      callback: function(htm) {
        that.categoryBannerEl.nativeElement.innerHTML = htm;
      }
    });
  }
}
