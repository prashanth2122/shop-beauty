import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule} from "@angular/forms";
import{NgUiViewModule} from '../component/ngui-in-view/ngUiView.module';
import { SaleComponent } from '../sale/sale.component';
import { SpecialOffersComponent } from '../special-offers/special-offers.component';
import {AffliateComponent} from '../affliate/affliate.component';
import {SanitizeHtmlPipeModule} from "../pipe/sanitize.module";
import { SessionExpiredComponent } from '../session-expired/session-expired.component';
import { JournalComponent } from '../journal/journal.component';
import { LifestyleComponent } from '../lifestyle/lifestyle.component';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
import { PerfumeCollectiveComponent } from './perfume-collective/perfume-collective.component';
import { MeetThePerfumersComponent } from '../meet-the-perfumers/meet-the-perfumers.component';
import { JournalTravelComponent } from '../journal-travel/journal-travel.component';
import { JournalNewsComponent } from '../journal-news/journal-news.component';
import { JasmineYourBoldComponent } from '../jasmine-your-bold/jasmine-your-bold.component';
import { JasmineSunRoseSurveyComponent } from '../jasmine-sun-rose-survey/jasmine-sun-rose-survey.component';
import { FashionForLunchComponent } from '../fashion-for-lunch/fashion-for-lunch.component';
import { HeavenlyGingerlilyComponent } from '../heavenly-gingerlily/heavenly-gingerlily.component';
import { MentionmeComponent } from '../mentionme/mentionme.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AtHomeWithLustLivingComponent } from './at-home-with-lust-living/at-home-with-lust-living.component';
import { MensGroomingRoutineComponent } from './mens-grooming-routine/mens-grooming-routine.component';
import { CocoAndSandalwoodComponent } from './coco-and-sandalwood/coco-and-sandalwood.component';
import { BlackPepperSportComponent } from './black-pepper-sport/black-pepper-sport.component';
import { TobaccoAbsoluteComponent } from './tobacco-absolute/tobacco-absolute.component';
import  {MoltonGalleryComponent} from '../molton-gallery/molton-gallery.component';
import { BiReportComponent } from './bi-report/bi-report.component';
import { CarierCharityComponent } from './carier-charity/carier-charity.component';
import { CorporateSocialReponsibilityComponent } from './corporate-social-reponsibility/corporate-social-reponsibility.component';
import { EmployeeBenefitsComponent } from './employee-benefits/employee-benefits.component';
import { CareersectionComponent } from '../careersection/careersection.component';
import { OudhAccordGoldComponent } from './oudh-accord-gold/oudh-accord-gold.component';

const routes: Routes =[
    { path: '', redirectTo: 'index', pathMatch: 'full', data: { catalogId: 'moltonbrown-gb' } },
    { path: 'index', loadChildren: '../amp-homepage/amp-homepage.module#AmpHomePageModule',runGuardsAndResolvers: 'always'  },
    { path:'store-events',loadChildren:'../store-events/store-events.module#storeEventsModule'},
    { path: 'mb-gallery',component: MoltonGalleryComponent},
    { path:'journal',component:JournalComponent},
    { path:'refer_a_friend',component:MentionmeComponent},
    { path:'bireport',component:BiReportComponent},
    { path:'behind-the-blend/heavenly-gingerlily',component:HeavenlyGingerlilyComponent},
    { path:'journal/lifestyle',component:LifestyleComponent},
    { path:'journal/travel',component:JournalTravelComponent},
    { path:'journal/news',component:JournalNewsComponent},
    { path:'journal/meet-the-perfumers',component:MeetThePerfumersComponent, pathMatch: 'full'},
    { path:'fragrance/perfume-collective',component:PerfumeCollectiveComponent},
    { path:'jasmine-sun-rose-own-your-bold',component:JasmineYourBoldComponent},
    { path:'jasmine-sun-rose-survey',component:JasmineSunRoseSurveyComponent},
    { path:'behind-the-blend/tobacco-absolute',component:TobaccoAbsoluteComponent},
    { path:'at-home-with-fashion-for-lunch',component:FashionForLunchComponent},
    { path:'behind-the-blend/coco-and-sandalwood',component:CocoAndSandalwoodComponent},
    { path:'behind-the-blend/black-pepper-sport',component:BlackPepperSportComponent},
    { path:'at-home-with-lust-living',component:AtHomeWithLustLivingComponent},
    { path:'mens-grooming-routine',component:MensGroomingRoutineComponent},
    {path:'careers/employee-benefits',component:EmployeeBenefitsComponent},
    {path:'behind-the-blend/oudh-accord-gold',component:OudhAccordGoldComponent},
    { path:'home',loadChildren:'../amp-homepage/amp-homepage.module#AmpHomePageModule'},
    { path: 'browse/productDetailSingleSku', loadChildren: '../category-detail-page/category-detail-page.module#CategoryDetailPageModule'},     
    {path:'browse/careers/charities',component:CarierCharityComponent},
    {path:'careers/corporate-social-responsibility',component:CorporateSocialReponsibilityComponent},
    { path: 'browse/:searchId', loadChildren: '../search-landingpage/search-landingpage.module#SearchLandingPageModule' ,runGuardsAndResolvers: 'always'},
    { path: 'browse/feedback/feedback', loadChildren: '../browse/browse.module#BrowseComponentModule' ,runGuardsAndResolvers: 'always'},
    { path:'global/sessionExpired',component:SessionExpiredComponent,pathMatch: 'full',runGuardsAndResolvers: 'always'},    
    { path:'gift-cards',loadChildren:"../gift-cards/gift-cards.module#GiftCardRouteModule"},
    { path: 'features',loadChildren:'../features/features.module#FeatureRouteModule'},
    { path:'company/stores',loadChildren:'../storefinder/storefinder.module#StoreFinderModule'},
    { path:'company/results',loadChildren:'../storeservicelist/storeservicelist.module#StoreservicelistModule'},
    { path:'store-finder/:countryName/:stateName/:cityName/:outletName/:store',loadChildren:'../store-detail/store-detail.module#StoreDetailModule'},
    { path:'store-finder/:countryName/:stateName/:cityName/:outletName/official-stockist',loadChildren:'../store-detail/store-detail.module#StoreDetailModule'},
    { path:'store-finder/:countryName/:stateName/:cityName/:outletName/airport-stockist',loadChildren:'../store-detail/store-detail.module#StoreDetailModule'},
    { path:'store-finder/:countryName/:stateName/:outletName/store',loadChildren:'../store-detail/store-detail.module#StoreDetailModule'},
    { path:'store-finder/:countryName/:stateName/:outletName/official-stockist',loadChildren:'../store-detail/store-detail.module#StoreDetailModule'},
    { path:'store-finder/:countryName/:stateName/:outletName/airport-stockist',loadChildren:'../store-detail/store-detail.module#StoreDetailModule'},
    { path:'careers',loadChildren:'../career/career.module#careerModule',pathMatch: 'full'},
    {path:'careers/index',loadChildren:'../career/career.module#careerModule',pathMatch: 'full'},
    { path:'corporate-gifts',loadChildren:'../corporate-gifts/corporate-gifts.module#corporateGiftModule'   },
    { path: 'myacc',loadChildren:'../myaccount/myacc.module#MyaccRouteModule'},
    { path: 'myaccount',loadChildren:'../myaccount/myaccount.module#MyaccountRouteModule'},
    { path: 'mbcart', loadChildren:'../checkoutpage/checkoutpage.module#CheckoutPageModule' },
    { path:'newsletter',loadChildren:'../newsletter-signup/newsletter-signup.module#NewsletterSignupModule'},
    { path:'newsletter-sign-up',loadChildren:'../newsletter-signup/newsletter-signup.module#NewsletterSignupModule'},
    { path:'newsletter-sign-up/confirmation',loadChildren:'../newsletter-signup/newsletter-signup.module#NewsletterSignupModule'},
    { path:'update-your-preferences', loadChildren:'../newsletter/newsletter-update/newsletter-update.module#NewsletterUpdateModule'},
    { path:'affliate',component:AffliateComponent},
    { path:'affiliates',component:AffliateComponent},
    { path:'hotel-amenities',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'bespoke-hotel-amenities',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-brochure',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/about',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products/luxury-collection-one',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products/luxury-collection-two',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products/the-1973-collection',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products/essential-accessories',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products/turndown-service',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products/hand-care',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'hotel-amenities/hotel-products/skin-care',loadChildren:'../hotel-amenities/hotel-amenities.module#HotelAmenitiesModule'},
    { path:'sale/:saleId',component:SaleComponent, pathMatch: 'full'},
    { path:'special-offers/:saleId',component:SpecialOffersComponent, pathMatch: 'full'},
    { path:'special-offers/catUKSpecialOffers',component:SpecialOffersComponent, pathMatch: 'full'},
    { path:'special-offers/catUSSpecialOffers',component:SpecialOffersComponent, pathMatch: 'full'},
    {path:'special-offers/catUKTreats',component:SpecialOffersComponent, pathMatch: 'full'},
    { path: 'product/:itemid', loadChildren: '../category-detail-page/category-detail-page.module#CategoryDetailPageModule',runGuardsAndResolvers: 'always' }, 
    { path:'sitemap',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'german-impressum',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'about-us',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    {path:'trade-enquiries',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule'},
    {path:'trade-inquiries',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule'},
    { path:'contact-us',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'delivery',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'german-delivery',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'shipping',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'terms-conditions',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'german-terms-conditions',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'gift-terms-conditions',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'promo-terms-conditions',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'privacy-policy',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'german-privacy-policy',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'faqs',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'faqs-order',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'faqs-account',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path:'faqs-product',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' }, 
    { path:'gift-cards/faqs',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },      
    { path:'faqs-company',loadChildren:'../organisation/organisation.module#OrgainisationRouteModule' },
    { path: ':categoryname/pick-mix-travel/:productid', loadChildren: '../pick-mix-travel/pick-mix-travel.module#PickMixTravelModule' },
    { path: ':productname/:categoryId', loadChildren: '../categorylanding-page/categorylanding-page.module#CategorylandingPageModule',runGuardsAndResolvers: 'always' },
    { path: ':categoryname/:productname/:productid', loadChildren: '../categorylanding-page/categorylanding-page.module#CategorylandingPageModule',runGuardsAndResolvers: 'always' },
    { path: ':categoryname/:productname/:itemname/:itemid', loadChildren: '../category-detail-page/category-detail-page.module#CategoryDetailPageModule',runGuardsAndResolvers: 'always' }
];
@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        RouterModule.forChild(routes),
        TranslatServicePipeModule,
        NgUiViewModule,
        SanitizeHtmlPipeModule
    ],
    declarations: [
        AffliateComponent,
        SaleComponent,
        SpecialOffersComponent,
        SessionExpiredComponent,
        JournalComponent,
        LifestyleComponent,
        PerfumeCollectiveComponent,
        MeetThePerfumersComponent,
        JournalTravelComponent,
        JournalNewsComponent,
        JasmineYourBoldComponent,
        JasmineSunRoseSurveyComponent,
        FashionForLunchComponent,
        HeavenlyGingerlilyComponent,
        MentionmeComponent,
        AtHomeWithLustLivingComponent,
        MensGroomingRoutineComponent,
        CocoAndSandalwoodComponent,
        BlackPepperSportComponent,
        TobaccoAbsoluteComponent,
        MoltonGalleryComponent,
        BiReportComponent,
        CarierCharityComponent,
        CorporateSocialReponsibilityComponent,
        EmployeeBenefitsComponent,
        CareersectionComponent,
        OudhAccordGoldComponent
     ],
     providers:[
        TranslateServiceSubService
     ]
})
export class StorePageModule { }
