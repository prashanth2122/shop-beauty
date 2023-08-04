import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeviceDetectorService } from "ngx-device-detector";
import { TranslateServiceSubService } from "../../pipe/translate-service-sub.service";
import { SingletonService } from "../../services/singleton.service";
@Component({
  selector: 'app-gift-pay-form',
  templateUrl: './gift-pay-form.component.html',
  styleUrls: ['./gift-pay-form.component.scss']
})
export class GiftPayFormComponent implements OnInit {
@Input() giftForm:FormGroup;
postCodeError:boolean;
giftPayForm:FormGroup;
mobileDevice:boolean;
isValidFormSubmitted:boolean;
deviceInfo:any;
desktopDevice:boolean;
  constructor(
    public deviceService: DeviceDetectorService,
    public translate: TranslateServiceSubService,
    public singletonServ: SingletonService
  ) { }

  ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    this.getDeviceInfo();
    if (baseSite) {
      const lngCode = baseSite.lngCode;
      this.setLang(lngCode);
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if (isMobile || isTablet) {
      this.mobileDevice = true;
    } else {
      this.mobileDevice = false;
    }
    if (isDesktopDevice) {
      this.desktopDevice = true;
    } else {
      this.desktopDevice = false;
    }
  }
}
