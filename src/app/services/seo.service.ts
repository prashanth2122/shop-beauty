import { Injectable, Inject, RendererFactory2, ViewEncapsulation } from '@angular/core'; 
import { Meta, Title, DOCUMENT } from '@angular/platform-browser';
import { map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { element } from 'protractor';

@Injectable()
export class SEOService {
  currentLanguage: string = "";
  contryUrls = [
    { country: "x-default", url: "https://www.moltonbrown.co.uk" },
    { country: "en-gb", url: "https://www.moltonbrown.co.uk" },
    { country: "en-us", url: "https://www.moltonbrown.com" },
    { country: "en-ca", url: "https://www.moltonbrown.com" },
    { country: "en-de", url: "https://www.moltonbrown.de" },
    { country: "de-de", url: "https://www.moltonbrown.de" },
    { country: "en-eu", url: "https://www.moltonbrown.eu" },
    { country: "en", url: "https://www.moltonbrown.com" }
  ];
  canonicalURL = "https://www.moltonbrown.co.uk";
  isSingleHost: boolean = true;
  baseURL: string = "https://jsapps.cxur-kaocorpor1-d4-public.model-t.cc.commerce.ondemand.com";//URL for single host
  localeContent = [
    { country: "UK", code: "en", content: "en_GB" },
    { country: "USA", code: "us", content: "en_US" },
    { country: "Germany", code: "de", content: "de_DE" },
    { country: "Europe", code: "eu", content: "en_EU”" }
  ];
  ogImgeUrl: string = "https://www.moltonbrown.eu/MBPromoImages/Social/Molton-Brown-Logo_600.png";
  constructor(
    private title: Title, 
    private meta: Meta, 
    private http: HttpClient,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private dom) {}

  updateTitle(title: string) {
    // this.title.setTitle(title);
    
    let dcTitle = this.dom.querySelector("meta[name='DC.title']");
    if(dcTitle){
      dcTitle.setAttribute('content', title);
    }else {
      this.meta.updateTag({ name: 'DC.title', content: title });
    }

    let ogTitle = this.dom.querySelector("meta[property='og:title']");
    if(ogTitle){
      ogTitle.setAttribute('content', title);
    }else {
      try {
        const renderer = this.rendererFactory.createRenderer(this.dom, {
            id: '-1',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
        });
  
        const meta = renderer.createElement('meta');
        const head = this.dom.head;
  
        if (head === null) {
            throw new Error('<head> not found within DOCUMENT.');
        }
  
        renderer.setAttribute(meta, 'property', "og:title");
        renderer.setAttribute(meta, 'content', title);
        renderer.appendChild(head, meta);
  
      } catch (e) {
          console.error('Error within createMetaWithProperty : ', e);
      }
    }
  }

  updateKeywords(keywords: string) {
    let element = this.dom.querySelector("meta[name='keywords']");
    if(element){
      element.setAttribute('content', keywords);
    }else {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }
  }

  updateDCSUBJECT(keywords: string) {
    let element = this.dom.querySelector("meta[name='DC.subject']");
    if(element){
      element.setAttribute('content', keywords);
    }else {
      this.meta.updateTag({ name: 'DC.subject', content: keywords });
    }
  }

  updateDescription(desc: string) {
    let element = this.dom.querySelector("meta[name='description']");
    if(element){
      element.setAttribute('content', desc);
    }else {
      this.meta.updateTag({ name: 'description', content: desc });
    }
  }
 
  updateDCDescription(desc: string) {
    let element = this.dom.querySelector("meta[name='DC.description']");
    if(element){
      element.setAttribute('content', desc);
    }else {
      this.meta.updateTag({ name: 'DC.description', content: desc });
    }
  }
  
  updateOGDescription(desc: string) {
    let element = this.dom.querySelector("meta[property='og:description']");
    if(element){
      element.setAttribute('content', desc);
    }else {
      this.meta.updateTag({ property: 'og:description', content: desc });
    }
  }
  
  updateOGLocale(lang?: string) {
    const country = lang || "UK";
    const data = this.localeContent.filter(l => l.code == country)[0];
    let content = data.content;
    let element = this.dom.querySelector("meta[property='og:locale']");
    if(element){
      element.setAttribute('content', content);
    }else {
      this.createMetaWithProperty('og:locale', content);
    }
  }

  updateOGImage(imgUrl?: string) {
    let url: string = "";
    if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
      url = this.ogImgeUrl;
    }else {
      url = imgUrl;
    }
    let element = this.dom.querySelector("meta[property='og:image']");
    if(element){
      element.setAttribute('content', url);
    }else {
      this.createMetaWithProperty('og:image', url);
    }
  }
  
  updateOGURL(url: string) {
    let element = this.dom.querySelector("meta[property='og:url']");
    const base_url = (this.isSingleHost ? this.baseURL : this.canonicalURL) + url;
    if(element){
      element.setAttribute('content', base_url);
    }else {
      this.createMetaWithProperty('og:url', base_url);
    }
  }

  createMetaWithProperty(property: string, content: string){
    try {
      const renderer = this.rendererFactory.createRenderer(this.dom, {
          id: '-1',
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: {}
      });

      const meta = renderer.createElement('meta');
      const head = this.dom.head;

      if (head === null) {
          throw new Error('<head> not found within DOCUMENT.');
      }

      renderer.setAttribute(meta, 'property', property);
      renderer.setAttribute(meta, 'content', content);
      renderer.appendChild(head, meta);

    } catch (e) {
        console.error('Error within createMetaWithProperty : ', e);
    }
  }

  createAlternateLink(type: string, url: string) {
    let host_url: string = "";
    if(this.isSingleHost){
      host_url = this.baseURL;
    }else {
      host_url =this.contryUrls.filter(e => e.country == type)[0].url;
    }
    const alternateURL = host_url + url;
    this.addTag({ rel: 'alternate', href: alternateURL, hreflang: type });
  }

  updateAlternateLink(type: string, url: string) {
    let host_url: string = "";
    if(this.isSingleHost){
      host_url = this.baseURL;
    }else {
      host_url = this.contryUrls.filter(e => e.country == type)[0].url
    }
    const alternateURL = host_url + url;
    let element = this.dom.querySelector("link[hreflang='" + type + "']");
    if(element){
      element.setAttribute('href', alternateURL);
    }else {
      this.createAlternateLink(type, url);
    }
  }

  removeAlternateTags() {
    try {
      const renderer = this.rendererFactory.createRenderer(this.dom, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });
      const head = this.dom.head;
      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }
      const linkTags = this.dom.querySelectorAll("link[rel='alternate']");
      for (const link of linkTags) {
        renderer.removeChild(head, link);
      }
    } catch (e) {
      console.log('Error while removing tag ' + e.message);
    }
  }
  
  createCanonicalURL(url: string) {
    let element = this.dom.querySelector("link[rel='canonical']");
    const base_url = (this.isSingleHost ? this.baseURL : this.canonicalURL) + url;
    if(element){
      element.setAttribute('href', base_url);
    }else {
      this.addTag({ rel: 'canonical', href: base_url });
    }
  }

  addTag(tag: LinkDefinition, forceCreation?: boolean) {
    try {
      const renderer = this.rendererFactory.createRenderer(this.dom, {
          id: '-1',
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: {}
      });

      const link = renderer.createElement('link');
      const head = this.dom.head;
      const selector = this._parseSelector(tag);

      if (head === null) {
          throw new Error('<head> not found within DOCUMENT.');
      }

      Object.keys(tag).forEach((prop: string) => {
          return renderer.setAttribute(link, prop, tag[prop]);
      });

      // [TODO]: get them to update the existing one (if it exists) ?
      renderer.appendChild(head, link);

    } catch (e) {
        console.error('Error within linkService : ', e);
    }
  }

  private _parseSelector(tag: LinkDefinition): string {
    // Possibly re-work this
    const attr: string = tag.rel ? 'rel' : 'hreflang';
    return `${attr}="${tag[attr]}"`;
  }

  appendScript(url: string) {
    try {
      const renderer = this.rendererFactory.createRenderer(this.dom, {
          id: '-1',
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: {}
      });

      const script = renderer.createElement('script');
      const head = this.dom.head;

      if (head === null) {
          throw new Error('<head> not found within DOCUMENT.');
      }

      renderer.setAttribute(script, 'src', url);
      renderer.appendChild(head, script);

    } catch (e) {
        console.error('Error within linkService : ', e);
    }
  }

  getValue(type: string, url: string) {
    this.currentLanguage = type || 'en';
    const seoPath = `assets/seo/${type || 'en'}.json`;
    return this.http.get(seoPath)
      .pipe(
          map(response => {
            const data  = response["seo-data"].filter(item => item.url === url);
            return data[0];
          }, error => error)
      )
  }
}

export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
      [prop: string]: string;
  };