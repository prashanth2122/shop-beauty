
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import { HeritageComponent } from '../features/heritage/heritage.component';
import { EditorialComponent } from '../features/editorial/editorial.component';
import {MbBreadCrumbModule} from '../component/mb-bread-crumb/mb-bread-crumb.module';
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
import {FeaturesComponent} from './features.component';
import { PerfumesComponent } from './perfumes/perfumes.component';
import { WeddingComponent } from './wedding/wedding.component';
import { FeatureBreadcrumbComponent } from './feature-breadcrumb/feature-breadcrumb.component';
import {FeatureComponentService} from "./features.service";
import { SaxonHotelComponent } from './saxon-hotel/saxon-hotel.component';
import { LuxuriousHotelsComponent } from './luxurious-hotels/luxurious-hotels.component';
import { LifesyleCategoryComponent } from './lifesyle-category/lifesyle-category.component';
import { GeraniumNefertumBhfComponent } from './geranium-nefertum-bhf/geranium-nefertum-bhf.component';
import { PerfumersCarlachabertComponent } from './perfumers-carlachabert/perfumers-carlachabert.component';
import { GreenEyedGirlComponent } from './green-eyed-girl/green-eyed-girl.component';
import { GeraniumBlurTheLinesComponent } from './geranium-blur-the-lines/geranium-blur-the-lines.component';
import { DesignAtNineteenComponent } from './design-at-nineteen/design-at-nineteen.component';
import { SpringHomeFragrancesComponent } from './spring-home-fragrances/spring-home-fragrances.component';
import { HealthyHairCareRoutineComponent } from './healthy-hair-care-routine/healthy-hair-care-routine.component';
import { ShopByColourComponent } from './shop-by-colour/shop-by-colour.component';
import { RelaxingBathGuideComponent } from './relaxing-bath-guide/relaxing-bath-guide.component';
import { SummerHomeFragrancesComponent } from './summer-home-fragrances/summer-home-fragrances.component';
import { PerfumersMaiaLernoutComponent } from './perfumers-maia-lernout/perfumers-maia-lernout.component';
import { PerfumersJeromeDiMarinoComponent } from './perfumers-jerome-di-marino/perfumers-jerome-di-marino.component';
import { MeetThePerfumersJacquesChabertComponent } from './meet-the-perfumers-jacques-chabert/meet-the-perfumers-jacques-chabert.component';
import { ToiletteEauDeParfumComponent } from './toilette-eau-de-parfum/toilette-eau-de-parfum.component';
import { OnlinePerfumeShoppingGuideComponent } from './online-perfume-shopping-guide/online-perfume-shopping-guide.component';
import { ChristmasRecipesWithMotherCookerComponent } from './christmas-recipes-with-mother-cooker/christmas-recipes-with-mother-cooker.component';
import { RefillableFragranceComponent } from './refillable-fragrance/refillable-fragrance.component';
import { BehindTheFragranceSuedeOrrisComponent } from './behind-the-fragrance-suede-orris/behind-the-fragrance-suede-orris.component';
import { TopHolidayDestinationsComponent } from './top-holiday-destinations/top-holiday-destinations.component';
import { MoltonBrownHistoryComponent } from './molton-brown-history/molton-brown-history.component';
import { GiftWrappingServicesComponent } from './gift-wrapping-services/gift-wrapping-services.component';
import { JasmineSunRoseComponent } from './jasmine-sun-rose/jasmine-sun-rose.component';
import { BehindVetiverGrapefruitComponent } from './behind-vetiver-grapefruit/behind-vetiver-grapefruit.component';
import { BehindOrangeBergamotComponent } from './behind-orange-bergamot/behind-orange-bergamot.component';
import { BehindOnlineExclusiveComponent } from './behind-online-exclusive/behind-online-exclusive.component';
import { BehindRussianLeatherComponent } from './behind-russian-leather/behind-russian-leather.component';
import { BehindRhubarbRoseComponent } from './behind-rhubarb-rose/behind-rhubarb-rose.component';
import { BehindRosaAbsoluteComponent } from './behind-rosa-absolute/behind-rosa-absolute.component';
import { AutumnHomeFragrancesComponent } from './autumn-home-fragrances/autumn-home-fragrances.component';
import { BehindthefragranceSeafennelComponent } from './behindthefragrance-seafennel/behindthefragrance-seafennel.component';
import { BehindthefragrancePinkpepperComponent } from './behindthefragrance-pinkpepper/behindthefragrance-pinkpepper.component';
import { BehindthefragranceBlackpepperComponent } from './behindthefragrance-blackpepper/behindthefragrance-blackpepper.component';
const routes: Routes =[
    { path: '', component: FeaturesComponent },
    { path:'lifestyle',component:LifesyleCategoryComponent},
    { path:'behind-the-fragrance/vetiver-grapefruit',component:BehindVetiverGrapefruitComponent},
    { path: 'molton-brown-history', component: HeritageComponent },
    { path: 'behind-the-fragrance/jasmine-sun-rose', component: JasmineSunRoseComponent }, 
    { path: 'meet-the-perfumers', component: PerfumesComponent },
    { path:'the-perfect-pair-wedding-gift-guide',component:WeddingComponent},
    { path:'the-signature-journey-the-saxon-hotel',component:SaxonHotelComponent},
    { path:'conde-nast-traveler-hotel-guide',component:LuxuriousHotelsComponent},
    { path:'behind-the-fragrance/geranium-nefertum',component:GeraniumNefertumBhfComponent},
    { path:'meet-the-perfumers-carla-chabert',component:PerfumersCarlachabertComponent},
    { path:'at-home-with-interior-designer-green-eyed-girl',component:GreenEyedGirlComponent},
    { path:'geranium-nefertum-blur-the-lines',component:GeraniumBlurTheLinesComponent},
    { path:'at-home-with-design-at-nineteen',component:DesignAtNineteenComponent},
    { path:'spring-home-fragrances',component:SpringHomeFragrancesComponent},
    { path:'healthy-hair-care-routine',component:HealthyHairCareRoutineComponent},
    { path:'behind-the-fragrance/orange-bergamot',component:BehindOrangeBergamotComponent},
    { path:'shop-by-colour',component:ShopByColourComponent},
    { path:'relaxing-bath-guide',component:RelaxingBathGuideComponent},
    { path:'summer-home-fragrances',component:SummerHomeFragrancesComponent},
    { path:'meet-the-perfumers-maia-lernout',component:PerfumersMaiaLernoutComponent},
    { path:'meet-the-perfumers-jerome-di-marino',component:PerfumersJeromeDiMarinoComponent},
    { path:'meet-the-perfumers-jacques-chabert',component:MeetThePerfumersJacquesChabertComponent},
    { path:'difference-between-eau-de-toilette-eau-de-parfum',component:ToiletteEauDeParfumComponent},
    { path:'online-perfume-shopping-guide',component:OnlinePerfumeShoppingGuideComponent},
    { path:'christmas-recipes-with-mother-cooker',component:ChristmasRecipesWithMotherCookerComponent},
    { path:'newsroom/refillable-fragrance',component:RefillableFragranceComponent},
    { path:'behind-the-fragrance/suede-orris',component:BehindTheFragranceSuedeOrrisComponent},
    { path:'top-holiday-destinations',component:TopHolidayDestinationsComponent},
    { path:'molton-brown-history',component:MoltonBrownHistoryComponent},
    { path:'gift-wrapping-services',component:GiftWrappingServicesComponent},
    { path:'behind-the-fragrance/1973-online-exclusive',component:BehindOnlineExclusiveComponent},
    { path:'behind-the-fragrance/russian-leather',component:BehindRussianLeatherComponent},
    { path:'behind-the-blend/rhubarb-rose',component:BehindRhubarbRoseComponent},
    { path:'behind-the-blend/rosa-absolute',component:BehindRosaAbsoluteComponent},
    { path:'autumn-home-fragrances',component:AutumnHomeFragrancesComponent},
    { path:'behind-the-fragrance/re-charge-black-pepper',component:BehindthefragranceBlackpepperComponent},
    { path:'behind-the-fragrance/fiery-pink-pepper',component:BehindthefragrancePinkpepperComponent},
    { path:'behind-the-fragrance/coastal-cypress-sea-fennel',component:BehindthefragranceSeafennelComponent}

 ];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DeviceDetectorModule,
        ReactiveFormsModule,
        MbBreadCrumbModule,
        TranslatServicePipeModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        HeritageComponent,
        EditorialComponent,
        FeaturesComponent,
        PerfumesComponent,
        WeddingComponent,
        FeatureBreadcrumbComponent,
        SaxonHotelComponent,
        LuxuriousHotelsComponent,
        LifesyleCategoryComponent,
        GeraniumNefertumBhfComponent,
        PerfumersCarlachabertComponent,
        GreenEyedGirlComponent,
        GeraniumBlurTheLinesComponent,
        DesignAtNineteenComponent,
        SpringHomeFragrancesComponent,
        HealthyHairCareRoutineComponent,
        ShopByColourComponent,
        RelaxingBathGuideComponent,
        SummerHomeFragrancesComponent,
        PerfumersMaiaLernoutComponent,
        PerfumersJeromeDiMarinoComponent,
        MeetThePerfumersJacquesChabertComponent,
        ToiletteEauDeParfumComponent,
        OnlinePerfumeShoppingGuideComponent,
        ChristmasRecipesWithMotherCookerComponent,
        RefillableFragranceComponent,
        BehindTheFragranceSuedeOrrisComponent,
        TopHolidayDestinationsComponent,
        MoltonBrownHistoryComponent,
        GiftWrappingServicesComponent,
        JasmineSunRoseComponent,
        BehindVetiverGrapefruitComponent,
        BehindOrangeBergamotComponent,
        BehindOnlineExclusiveComponent,
        BehindRussianLeatherComponent,
        BehindRhubarbRoseComponent,
        BehindRosaAbsoluteComponent,
        AutumnHomeFragrancesComponent,
        BehindthefragranceSeafennelComponent,
        BehindthefragrancePinkpepperComponent,
        BehindthefragranceBlackpepperComponent
    ],
    providers:[
        FeatureComponentService,
        TranslateServiceSubService,
    ]
})
export class FeatureRouteModule { }