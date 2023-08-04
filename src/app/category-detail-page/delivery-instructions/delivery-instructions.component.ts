import {
  Component,
  SimpleChange,
  OnInit,
  Input,
  ViewEncapsulation,
  OnChanges
} from "@angular/core";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { SingletonService } from "../../services/singleton.service";
@Component({
  selector: "app-delivery-instructions",
  templateUrl: "./delivery-instructions.component.html",
  styleUrls: ["./delivery-instructions.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryInstructionsComponent implements OnInit, OnChanges {
  @Input() deliveryResctrictions;
  @Input() dlInstructionShowUp: boolean;
  deliveryBoxStatus: boolean;
  headActive:boolean;
  constructor(
    private translate: TranslateServiceSubService,
    public singletonServ:SingletonService
  ) {
    this.deliveryBoxStatus = false;
  }
  onHeadClick(){
    this.headActive=!this.headActive;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["dlInstructionShowUp"]) {
      if (changes["dlInstructionShowUp"]["currentValue"] != undefined) {
        that.deliveryBoxStatus = true;
      }
    }
  }
  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
     this.setLang(baseSite.lngCode);
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  onDeliveryClick() {
    this.deliveryBoxStatus = !this.deliveryBoxStatus;
  }
}
