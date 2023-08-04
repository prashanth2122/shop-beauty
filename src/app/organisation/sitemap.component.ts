import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { SingletonService } from "../services/singleton.service";
import { Title } from "@angular/platform-browser";
import { HeaderComponentService } from "../component/header/header.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sitemap",
  templateUrl: "./sitemap.component.html",
  styleUrls: ["./sitemap.component.scss"]
})
export class SitemapComponent implements OnInit {
    homeCategoryList = [];
    categoryList = [];
    staticList = [];
    nestedCategoryList = [];
    constructor(
        public singletonServ: SingletonService, 
        private titleService: Title,
        public headerServ: HeaderComponentService,
        private router : Router) {}

    ngOnInit() {
        this.homeCategoryList = this.singletonServ.menudata;
        this.staticList = this.getStaticPageData();
        const baseSite = this.singletonServ.catalogVersion;
        this.getTopStaticCntnt(baseSite.lngCode)
    }
    getTopStaticCntnt(lang: string){
        const that=this;
        this.headerServ.getStaticContent(lang).subscribe((response:any)=>{
             that.staticList=response.sitemap;
        });
      }
      ngAfterViewInit(){
        const that=this;
        let messageReceived:Boolean = false;
        this.singletonServ.getMessage().subscribe(message => {
            if (!messageReceived && message.catgories) {
                that.homeCategoryList = message.catgories;
                this.createNestedSubCategoryItems(that.homeCategoryList);
                messageReceived = true;
            }
        });
    }
    getRouterPath(current){
        if(current.categoryDisplayName === "Treats"){
          const _url="/store/special-offers/"+current.id;
          return _url;
        }else    if(current.categoryDisplayName === "Editorial") {
              return "/store/features";
        }else  if(current.name== "special-offers"){
            const _url="/store/special-offers/"+current.id;
            return _url;
        }else
        if (current.isL3 || (!current.parent && current.description)) {
             if (current.id != "catUKPickMixTravel") {
              const url = "/store" + current.url.replace("/c/", "/");
              return url;
          } else {
              const url = "/store" + current.url.replace("/c/", "/");
              return url;
          }
         return ""
        }
        return ""
      }
    getUrl(url) {
        let base_url = "";
        base_url = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');//supports for all browser (specific to IE)
        return  url;
    }

    getStaticPageData() {
        const baseSite = this.singletonServ.catalogVersion;
        let data =  [
            {
                title: "Help & Information",
                sub_cat: [
                    {
                        name: "Contact Us",
                        url: "/store/contact-us"
                    },
                    {
                        name: "FAQ's & Help",
                        url: "/store/faqs"
                    },
                    {
                        name: "Affiliate Enquiries",
                        url: "/store/affiliates"
                    },
                    {
                        name: "Trade & Press Enquiries",
                        url: "/store/trade-enquiries"
                    },
                    {
                        name: "Sitemap",
                        url: "/store/sitemap"
                    }
                ]
            },
            {
                title: "About Us",
                sub_cat: [
                    {
                        name: "About Molton Brown",
                        url: "/store/about-us"
                    },
                    {
                        name: "Our Heritage",
                        url: "/store/features/molton-brown-history"
                    }
                ]
            },
            {
                title: "Our Services",
                sub_cat: [
                    {
                        name: (baseSite. isoCode=="US")?"Shipping & Returns":"Delivery & Returns",
                        url: (baseSite. isoCode=="US")?"/store/shipping":"/store/delivery"
                    },
                    {
                        name: "Store Finder",
                        url: "/store/company/stores"
                    },
                    {
                        name: "Hotel Amenities",
                        url: "/store/hotel-amenities"
                    }
                ]
            },
            {
                title: "Our Policies",
                sub_cat: [
                    {
                        name: "Terms and Conditions",
                        url: "/store/terms-conditions"
                    },
                    {
                        name: "Privacy & Cookie Policy",
                        url: "/store/privacy-policy"
                    },
                    {
                        name: "Gender Pay Policy",
                        url: "https://www.moltonbrown.co.uk/MBPromoImages/Social/Molton-Brown-Gender-Pay-Gap-2017.pdf"
                    }
                ]
            },
            {
                title: "Corporate Gifts",
                sub_cat: [],
                url: "/store/corporate-gifts"
            },
            {
                title: "Careers",
                sub_cat: [],
                url: "/store/careers"
            }
        ]
        return data;
    }
    createNestedSubCategoryItems(categories) {
        const categoryFilterByDisplayName = categories.filter(cat => cat.categoryDisplayName !='Editorial');
        const categoryFilterByOrder = categoryFilterByDisplayName.filter(cat => cat.order != "100");
        
        let finalList = [];
        for(let i = 0; i < categoryFilterByOrder.length; i++){
            let category = categoryFilterByOrder[i];
            if(category.subcategories.length > 0){
                let sub_cat_data = [];
                let nested_cat_data = [];
                for(let j = 0; j< category.subcategories.length; j++) {
                    let subCategory = category.subcategories[j];
                    if(subCategory.subcategories.length == 0){
                        sub_cat_data.push(subCategory);
                    }else if(subCategory.subcategories.length > 0){
                        for(let k = 0; k < subCategory.subcategories.length; k++) {
                            nested_cat_data.push(subCategory.subcategories[k]);
                        }
                    }
                }
                category.subCategory = sub_cat_data;
                category.nestedCategory = nested_cat_data;
                finalList.push(category);
            }
        }
        this.nestedCategoryList = finalList;
    }
}
