import { Component, OnInit,Renderer2,Inject,  ViewChild,
  ElementRef,} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";
import { DOCUMENT } from '@angular/platform-browser';
import {SingletonService} from '../services/singleton.service'; 
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mentionme',
  templateUrl: './mentionme.component.html',
  styleUrls: ['./mentionme.component.scss']
})
export class MentionmeComponent implements OnInit {
  localData:any;
  constructor(
    private renderer2: Renderer2,
    public singletonServ: SingletonService,
    private title: Title,
    @Inject(DOCUMENT) private _document) {
   }

   ngOnInit() {
    const baseSite = this.singletonServ.catalogVersion;
    let country=baseSite['countryCode'];

    if(country == 'US'){
      this.title.setTitle('Refer A Friend | Mention Me | Molton Brown US');
    const s = this.renderer2.createElement('script');
   s.type = 'text/javascript';
   s.src = 'https://tag.mention-me.com/api/v2/referreroffer/mm258f3ba3?situation=landingpage&locale=en_US';
   s.text = ``;
   this.renderer2.appendChild(this._document.body, s);
    }
    else{
      this.title.setTitle('Refer A Friend | Mention Me | Molton Brown UK');
    const s = this.renderer2.createElement('script');
   s.type = 'text/javascript';
   s.src = 'https://tag.mention-me.com/api/v2/referreroffer/mm258f3ba3?situation=landingpage';
   s.text = ``;
   this.renderer2.appendChild(this._document.body, s);
    }
    
  }

}
