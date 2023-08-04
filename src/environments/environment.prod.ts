// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment :{
  production:boolean,
  environmentName:string,
  AUTHRISATION_PATH:string,
  CS_AUTHRISATION_PATH:string,
  CS_CUSTOMER:string,
  API_PATH:string,
  countryJsonData:Array<any>
} = {
  production: true,
  environmentName: 'production',
  AUTHRISATION_PATH:'https://api.cxur-kaocorpor1-s3-public.model-t.cc.commerce.ondemand.com/authorizationserver/',
  CS_AUTHRISATION_PATH:'https://api.cxur-kaocorpor1-s3-public.model-t.cc.commerce.ondemand.com/authorizationserver/',
  CS_CUSTOMER:'https://api.cxur-kaocorpor1-s3-public.model-t.cc.commerce.ondemand.com/',
  API_PATH:'https://api.cxur-kaocorpor1-s3-public.model-t.cc.commerce.ondemand.com/kaowebservices/v2/:baseSite',
 countryJsonData:[
  {
    countryCode: "gb",
    countryImg: "assets/imgs/icon_country_german.gif",
    countryName: "UK",
    name:"United Kingdom",
    catalogversionId: "moltonbrown-gb",
    locale: "en-GB",
    reg:"reg-gb",
    guest:"guest-gb",
    regOrder:"reg-gb-order",
    guestOrder:"guest-gb-order",
    isoCode:"GB",
    store:"store_gb",
    lngCode:'en',
    guestPickMix:'guest-pick-mix-gb',
    regPickMix:'reg-pick-mix-gb',
    bv_locale:'en_gb',
    bv:'https://apps.bazaarvoice.com/deployments/moltonbrown-en_gb/uat/staging/en_GB/bv.js',
    geoPoint:{
      latitude:51.509865,
      longitude:-0.118092
    },
    query:"https://www.prdh.moltonbrown.co.uk/store/index",
    hostname:"www.prdh.moltonbrown.co.uk",
    serverName:"prdh.moltonbrown.co.uk",
    personaId:'GBPERSONA',
    gtmsrc:'https://www.googletagmanager.com/ns.html?id=GTM-56ZL49'
  },
  {
    countryCode: "US",
    countryImg: "https://www.moltonbrown.co.uk/images/USflagOver.gif",
    countryName: "USA",
    name:"United States",
    catalogversionId: "moltonbrown-us",
    locale: "en-US",
    reg:"reg-us",
    guest:"guest-us",
    regOrder:"reg-us-order",
    guestOrder:"guest-us-order",
    isoCode:"US",
    store:"store_us",
    lngCode:'us',
    guestPickMix:'guest-pick-mix-us',
    regPickMix:'reg-pick-mix-us',
    latitude:'51.50853',
    longitude:'-0.12574',
    bv_locale:'en_US',
    bv:'https://apps.bazaarvoice.com/deployments/moltonbrown/uat/staging/en_US/bv.js',
    geoPoint:{
      latitude:51.50853,
      longitude:-0.12574
    },
    query:"https://www.prdh.moltonbrown.com/store/index?country_store=us",
    hostname:"www.prdh.moltonbrown.com",
    serverName:"prdh.moltonbrown.com",
    personaId:'USPERSONA',
    gtmsrc:'https://www.googletagmanager.com/ns.html?id=GTM-WT2QCD'
  },
  {
    countryCode: "eu",
    countryImg: "assets/imgs/icon_country_europe.gif",
    countryName: "Europe",
    name:"Europe",
    catalogversionId: "moltonbrown-eu",
    locale: "en-CX",    
    reg:"reg-eu",
    guest:"guest-eu",
    regOrder:"reg-eu-order",
    guestOrder:"guest-eu-order",
    isoCode:"EU",
    store:"store_eu",
    lngCode:'eu',
    guestPickMix:'guest-pick-mix-eu',
    regPickMix:'reg-pick-mix-eu',
    latitude:'51.50853',
    longitude:'-0.12574',
    bv_locale:'en_EU',
    bv:'https://apps.bazaarvoice.com/deployments/moltonbrown-eu/uat/staging/en_EU/bv.js',
    geoPoint:{
      latitude:51.50853,
      longitude:-0.12574
    },
    query:"https://www.prdh.moltonbrown.eu/store/index?country_store=eu",
    hostname:"www.prdh.moltonbrown.eu",
    serverName:"prdh.moltonbrown.eu",
    personaId:'EUPERSONA',
    gtmsrc:'https://www.googletagmanager.com/ns.html?id=GTM-PRF4JQM'
  },
  {
    countryCode: "de",
    countryImg: "assets/imgs/icon_country_german.gif",
    countryName: "Germany",
    name:"Germany",
    catalogversionId: "moltonbrown-de",
    locale: "de-DE",    
    reg:"reg-de",
    guest:"guest-de",
    regOrder:"reg-de-order",
    guestOrder:"guest-de-order",
    isoCode:"DE",
    store:"store_de",
    lngCode:'de',
    guestPickMix:'guest-pick-mix-de',
    regPickMix:'reg-pick-mix-de',
    bv_locale:'en_EU',
    bv:'https://apps.bazaarvoice.com/deployments/moltonbrown-eu/uat/staging/en_EU/bv.js',
    geoPoint:{
      latitude:51.50853,
      longitude:-0.12574
    },
    query:"https://www.prdh.moltonbrown.de/store/index?country_store=de",
    hostname:"www.prdh.moltonbrown.de",
    serverName:"prdh.moltonbrown.de",
    personaId:'DEPERSONA',
    gtmsrc:'https://www.googletagmanager.com/ns.html?id=GTM-TBRSFX6'
  },
  {
    countryCode: "jp",
    countryImg: "assets/imgs/icon_country_japan.gif",
    countryName: "Japan",
    name:"Japan",
    catalogversionId: "moltonbrown-jp",
    locale: "jp-JP",    
    reg:"reg-jp",
    guest:"guest-jp",
    isoCode:"JP",
    store:"store_jp",
    lngCode:'jp',
    guestPickMix:'guest-pick-mix-jp',
    regPickMix:'reg-pick-mix-jp',
    bv_locale:'en_EU',
    bv:'https://apps.bazaarvoice.com/deployments/moltonbrown-eu/uat/staging/en_EU/bv.js',
    geoPoint:{
      latitude:51.50853,
      longitude:-0.12574
    },
    query:"http://www.moltonbrown.co.jp/?country=store_jp"
  }
]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
