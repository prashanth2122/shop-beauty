import { Injectable } from '@angular/core';
import { SingletonService } from "../services/singleton.service";
import * as _ from "lodash";
declare var window: any;
declare var $:any;
@Injectable({
  providedIn: 'root'
})
 export class GtmMethodService {
constructor(    
    public singletonServ: SingletonService
){}
  gtmCompleteRegistration (newsletterOptIn)
  {
  window.dataLayer = window.dataLayer || [],
  window.dataLayer.push({
    'event': 'eec.completeRegistration',
    'virtualPage': '/vpv/complete/registration/',                      
    'newsletterOptIn': newsletterOptIn
  });
  }

  gtmPickAndMixEvent(pickandMixCategory,productAdded)
  {
      window.dataLayer = window.dataLayer || [];
       window.dataLayer.push({
      'event': 'eec.pickAndMix',
      'eventCategory': 'Pick and Mix',                      
      'eventAction': pickandMixCategory,
      'eventLabel': productAdded
      });
  }

  
  gtmFilterUsage(filterCategory,filterSelection)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.Filter',
      'eventCategory': 'Filter Usage',                      
      'eventAction': filterCategory,
      'eventLabel': filterSelection
      });
  }

  gtmZeroSearchResults(searchTerm)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.zeroSearchResults',
      'eventCategory': 'Zero Search Results',                      
      'eventAction': searchTerm
      });
  }


 gtmStoreLocator(actionCarriedOut,storedetails) 

  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.storeLocator',
      'eventCategory': 'Store List Names',                      
      'eventAction':actionCarriedOut,
      'eventLabel': storedetails
      });
  }

  gtmQuickView(actionCarriedOut,prouductName)
  {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
      'event': 'eec.quickView',
      'eventCategory': 'Quick View',                      
      'eventAction':actionCarriedOut,
      'eventLabel': prouductName
      });
  }



  gtmAddSample(sampleSize,sampleName)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.addSample',
      'eventCategory': 'Add Sample',                      
      'eventAction': sampleSize,
      'eventLabel': sampleName
      });
  }

  gtmPageCategorisation(pageDetails,pageTypes)
  {
      window.dataLayer = window.dataLayer || [];
      const _pageCategory:any={
        'event': 'eec.PageCategorisation',
        "pageDetails":[] 
      };
const _pageDetails = [];
pageDetails = this.singletonServ;
const _baseSite = this.singletonServ.catalogVersion;
  
const _objProduct={
    'pageType': pageTypes,
    'country': pageDetails.catalogVersion.isoCode,
    'userID': '',
    'userType': (pageDetails.loggedIn == true) ? 'Customer':'Prospect',
    'loginStatus': pageDetails.loggedIn
}
_pageDetails.push(_objProduct);
_pageCategory['pageDetails'] =_pageDetails;
if (this.singletonServ.getStoreData(_baseSite.reg)) {
    const user:any = JSON.parse(this.singletonServ.getStoreData(_baseSite.reg));
    _objProduct['userID']=(user.customerId)?(user.customerId):'';
  }else{
    _objProduct['userID']='';
  }
window.dataLayer.push(_pageCategory);
    }

  gtmBlogSection(category,editorialTitle,readingTime)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
          'event':'eec.editorial',
      'editorialCategory': category,
      'editorialTitle': editorialTitle,
      'editorialReadingtime': readingTime
      
      });
  }

  gtmPromoImpressions(promotions)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.promotionView',
      'ecommerce': {
          'promoView': {
          'promotions':promotions
          }
      }
      });

      
  }

  loadPromotion:Array<any>=[];
  gtmScrollPromoImpressions(promotions)
  {
     let _checkFilter=_.uniq(this.loadPromotion);
       _checkFilter=this.loadPromotion.filter((item)=>{
         return item.id==promotions.id;
      });
      if(_checkFilter.length ==0){
      this.loadPromotion.push(promotions);
        const _obj:any={
            'event': 'eec.promotionView',
            'ecommerce': {
                'promoView': {
                'promotions':this.loadPromotion
                }
            }
            }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(_obj);
    }
  }


//   gtmPromoclicks(promotion)
//   {
//       window.dataLayer = window.dataLayer || [];
//       window.dataLayer.push({
//       'event': 'eec.promotionClick',
//       'ecommerce': {
//           'promoClick': {
//           'promotions': [                     
//           {
//               'id': promotion.promoID,            
//               'name': promotion.promoName,
//               'creative':  promotion.promoCreative,
//               'position': promotion.promoSlot

//           }]
//           }
//       }
//       });
//   }

  gtmProductListPages(productListDetails,impressions)
  {
      let _productListPage={
        'event': 'eec.productImpression',
        'ecommerce': {
            'currencyCode': productListDetails,                      
            'impressions': impressions
          }
        }
    // const _obj={
    //     'name': productListDetails.productName,      
    //     'id':  productListDetails.productID,
    //     'price':  productListDetails.productPrice,
    //     'brand':  productListDetails.productBrand,
    //     'category':  productListDetails.productCategory,
    //     'list':  productListDetails.categoryList,
    //     'variant':  productListDetails.productVariant,
    //     'position': productListDetails.position,
    //     'dimension3':  productListDetails.size,
    //     'dimension4':  productListDetails.reviewRating,
    //     'dimension5':  productListDetails.reviewsCount,
    //     'dimension6':  productListDetails.saleStatus,
    //     'dimension12':  productListDetails.stockLevel,    
    //     'dimension13':  productListDetails.productStockLevelNumber, 
    //     'dimension14':  productListDetails.deleveryType,
    //     'metric2':  productListDetails.SalePrice
    //     }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(_productListPage);
  }



  gtmProductClick(productClickDetails)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.productClick',
      'ecommerce': {
          'currencyCode': productClickDetails.currencyCode,                      
          'click':{
          'actionField': {'list': productClickDetails.categoryList},
          'products': [{
          'name': productClickDetails.productName,      
          'id': productClickDetails.productID,
          'price': productClickDetails.productPrice,
          'brand': productClickDetails.productBrand,
          'category': productClickDetails.productCategory,
          'list':productClickDetails.categoryList,
          'variant': productClickDetails.productVariant,
          'position': productClickDetails.position,
          'dimension3': (productClickDetails.size)?productClickDetails.size:"",
          'dimension4': productClickDetails.reviewRating,
          'dimension5': productClickDetails.reviewsCount,
          'dimension6': productClickDetails.saleStatus,
          'dimension12': productClickDetails.stockLevel,    
          'dimension13': productClickDetails.productStockLevelNumber, 
          'dimension14': productClickDetails.deleveryType,
          'metric2': productClickDetails.salePrice
      
          }]
          }
      }
      });
  }



  gtmProductDetailPages(productdetails)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.productDetail',
      'ecommerce': {
          'currencyCode': productdetails.currencyCode,                      
          'detail': {
          'actionField': { 'list': productdetails.productCategory },
          'products':[{
              'name': productdetails.productName,      
              'id': productdetails.productID,
              'price': productdetails.productPrice,
              'brand': productdetails.productBrand,
              'category': productdetails.productCategory,
              'variant': productdetails.productVariant,
              'dimension3': (productdetails.size)?productdetails.size:"",
              'dimension4': productdetails.reviewRating,
              'dimension5': productdetails.reviewsCount,
              'dimension6': productdetails.saleStatus,
              'dimension12': productdetails.stockLevel,    
              'dimension13': productdetails.productStockLevelNumber,
              'dimension14': productdetails.deleveryType,
              'metric2': productdetails.salePrice
          }]
          }
      }
      });
  }



  gtmAddToCart(cartDetails)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.addToCart',
      'ecommerce': {
      'currencyCode': cartDetails.currencyCode,                      
      'add': {
          'actionField': { 'list': cartDetails.categoryList },
          'products':[{
          'name': cartDetails.productName,      
          'id': cartDetails.productID,
          'price': cartDetails.productPrice,
          'brand': cartDetails.productBrand,
          'category': cartDetails.productCategory,
          'variant': cartDetails.productVariant,
          'quantity':cartDetails.productQuantity,
          'dimension3': (cartDetails.size)?cartDetails.size:'',
          'dimension4': cartDetails.reviewRating,
          'dimension5': cartDetails.reviewsCount,
          'dimension6': cartDetails.saleStatus,
          'dimension12': cartDetails.stockLevel,    
          'dimension13': cartDetails.productStockLevelNumber,
          'dimension14': cartDetails.deleveryType,
          'metric2': cartDetails.salePrice
          }]
      }
      }
      });
  }



  gtmBasketAddtoCart(cartDetails)
  {
      window.dataLayer = window.dataLayer || [];
      let item = {
        'event': 'eec.addToCart',
        'ecommerce': {
            'currencyCode': cartDetails.currencyCode,                      
            'remove': {
            'actionField': { 'list': cartDetails.categoryList },
            'products':[]
            }
        }
        }
        for(let i=0; i<cartDetails.products.length; i++){
            item.ecommerce.remove.products.push({
                'name': cartDetails.products[i].productName,      
                'id': cartDetails.products[i].productID,
                'price': cartDetails.products[i].productPrice,
                'brand': cartDetails.products[i].productBrand,
                'category': cartDetails.products[i].productCategory,
                'variant': cartDetails.products[i].productVariant,
                'quantity': cartDetails.products[i].productQuantity,
                'dimension3': cartDetails.products[i].size,
                'dimension4': cartDetails.products[i].reviewRating,
                'dimension5': cartDetails.products[i].reviewsCount,
                'dimension6': cartDetails.products[i].saleStatus,
                'dimension12': cartDetails.products[i].stockLevel,    
                'dimension13': cartDetails.products[i].productStockLevelNumber,
                'dimension14': cartDetails.products[i].deleveryType,
                'metric2': cartDetails.products[i].salePrice
            })
        }
      window.dataLayer.push(item);
  }

  gtmRemoveFromCart(cartDetails)
  {
      window.dataLayer = window.dataLayer || [];
      let item = {
        'event': 'eec.removeFromCart',
        'ecommerce': {
            'currencyCode': cartDetails.currencyCode,                      
            'remove': {
            'actionField': { 'list': cartDetails.categoryList },
            'products':[{
                'name': cartDetails.productName,      
                'id': cartDetails.productID,
                'price': cartDetails.productPrice,
                'brand': cartDetails.productBrand,
                'category': cartDetails.productCategory,
                'variant': cartDetails.productVariant,
                'quantity': cartDetails.productQuantity,
                'dimension3': cartDetails.size,
                'dimension4': cartDetails.reviewRating,
                'dimension5': cartDetails.reviewsCount,
                'dimension6': cartDetails.saleStatus,
                'dimension12': cartDetails.stockLevel,    
                'dimension13': cartDetails.productStockLevelNumber,
                'dimension14': cartDetails.deleveryType,
                'metric2': cartDetails.salePrice
            }]
            }
        }
        }
        // for(let i=0; i<cartDetails.products.length; i++){
        //     item.ecommerce.remove.products.push({
        //         'name': cartDetails.products[i].productName,      
        //         'id': cartDetails.products[i].productID,
        //         'price': cartDetails.products[i].productPrice,
        //         'brand': cartDetails.products[i].productBrand,
        //         'category': cartDetails.products[i].productCategory,
        //         'variant': cartDetails.products[i].productVariant,
        //         'quantity': cartDetails.products[i].productQuantity,
        //         'dimension3': cartDetails.products[i].size,
        //         'dimension4': cartDetails.products[i].reviewRating,
        //         'dimension5': cartDetails.products[i].reviewsCount,
        //         'dimension6': cartDetails.products[i].saleStatus,
        //         'dimension12': cartDetails.products[i].stockLevel,    
        //         'dimension13': cartDetails.products[i].productStockLevelNumber,
        //         'dimension14': cartDetails.products[i].deleveryType,
        //         'metric2': cartDetails.products[i].salePrice
        //     })
        // }
      window.dataLayer.push(item);
  }
  gtmPickandMix(item,travelBag)
  {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
      'event': 'eec.pickandMixStep',
      'virtualPage': item.stepName,
      'travelBag': travelBag                    
      });
  }

  gtmSetPickandMixSteps(vrtlPage:string,trvlBag:any){
    const item ={
        'stepName':vrtlPage
    }
    this.gtmPickandMix(item,trvlBag);
  }
  gtmCheckoutSteps(checkoutDetails,item){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
    'event': 'eec.checkout',
    'ecommerce': {
        'currencyCode': item.currencyCode,                      
        'checkout': {
        'actionField':{ 'step': item.stepNumber },
        'products':checkoutDetails
        }
    }
    });
}
gtmSetFeed(cartObj:any,step:string){
    const singletonVariable= cartObj.entries;
    const singletonVariableMain=cartObj;
    const item ={
    'currencyCode':singletonVariableMain.totalPrice.currencyIso,
    'stepNumber':step,
    };
    const checkoutDetails=[];
    singletonVariable.map((obj)=>{
    const productUrl = obj.product;
    // product is single
    let pageUrlCat;
    let _subCatg;
    if(productUrl.length){
        productUrl.map((prod)=>{
            let categoryUrl= this.retireveCatpath(prod.product)
            
            checkoutDetails.push(this.addProducts(prod,categoryUrl[2], singletonVariableMain)); // [name1,name2]
        })
    } else {
         pageUrlCat= this.retireveCatpath(productUrl)
         checkoutDetails.push(this.addProducts(obj,pageUrlCat[2], singletonVariableMain)); // [name1,name2]
    }
    });
    this.gtmCheckoutSteps( checkoutDetails,item);
}

addProducts(obj, _subCatg, singletonVariableMain){
    const _obj={
             'name': obj.product.productDisplayName,     
        'id': obj.product.code,
        'price': '',
        'brand': "Molton Brown",
        'category': _subCatg,
        'variant': (obj.product.productVariant)?obj.product.productVariant:'',
        'quantity':obj.quantity,
        'dimension3': (obj.product.size)?obj.product.size:"",
        'dimension4': (obj.product.productAverageRating)?obj.product.productAverageRating:'0',
        'dimension5': (obj.product.reviewsCount)?obj.product.reviewsCount:'0',
        'dimension6': (obj.product.productVariant)?'True':'False',
        'dimension7': obj.product.isSample,
        'dimension8': singletonVariableMain.isGiftBox,
        'dimension9': (singletonVariableMain.isGiftBoxMessage)?'True':'False',
        'dimension12': (obj.product.stock.stockLevelStatus == "inStock")? 'True' : 'False',    
        'dimension13': (obj.product.productStockLevelNumber)?'':'',
        'dimension14': (obj.product.productEdition)?obj.product.productEdition:'', 
        'metric2': (obj.product.originalPrice)?obj.product.price.value:''
    }
    if(obj.product.originalPrice){
        const originalPrice=obj.product.originalPrice;
        const _originalPrice = originalPrice.match(/[\d\.]+/);
        if(_originalPrice){
          _obj['price']=_originalPrice[0];
        }else{
          _obj['price']=originalPrice;
        }
        }else{
          _obj['price']=obj.product.price.value;
        }
    return _obj;      

}

retireveCatpath(dataurl){
    if(dataurl.category){

        const _url= dataurl.category.url;
        return _url.split("/");
       }else if(dataurl.url){
        const _url= dataurl.url;
        return _url.split("/");
       }
}

  gtmPurchase(purchaseDetails:any)
  {
      window.dataLayer = window.dataLayer || [];
      var vocherCode:any
      const guest =purchaseDetails.guestCustomer;
      if(purchaseDetails.appliedVouchers[0]==undefined){
        vocherCode='';
      }
      else{
        vocherCode=purchaseDetails.appliedVouchers[0].voucherCode;
      }
      const _purchaseObj:any={
          
        'event': 'eec.purchase',
        'checkoutType':(guest == true)? 'Guest': 'Registered',
        'shippingCountry':purchaseDetails.deliveryAddress.country.isocode,
        'ecommerce': {
        'currencyCode':  purchaseDetails.totalPrice.currencyIso,
        'purchase': {
            'actionField': {
                'id': purchaseDetails.paymentInfo.id,                         
                'affiliation': purchaseDetails.store,
                'revenue': purchaseDetails.totalPrice.value,                    
                'tax':purchaseDetails.totalTax.value,
                'shipping': purchaseDetails.deliveryCost.value,
                'coupon':vocherCode,
                'newsletterOptIn':( purchaseDetails.newsletterOptIn)? 'true':'false',
                'metric3': purchaseDetails.orderDiscounts.value,
                "products":[] 
            }           
            }
        }
        };
        const _products=[]; 
        purchaseDetails.entries.map((obj)=>{
            const productUrl = obj.product;
            const pageUrlCat = this.retireveCatpath(productUrl);
            const _subCatg=pageUrlCat[2]; 
            const _obj={
                      'name': obj.product.productDisplayName,     
                      'id': obj.product.code,
                      'price': '',
                      'brand': "Molton Brown",
                      'category': _subCatg,
                      'variant': (obj.product.productVariant)?obj.product.productVariant:'',
                      'quantity':obj.quantity,
                      'dimension3': (obj.product.size)?obj.product.size:"",
                      'dimension4': (obj.product.productAverageRating)?obj.product.productAverageRating:'',
                      'dimension5': (obj.product.reviewCount)?obj.product.reviewCount:'',
                      'dimension6': (obj.product.productVariant)?'True':'False',
                      'dimension7': obj.product.isSample,
                      'dimension8': purchaseDetails.isGiftBox,
                      'dimension9': (purchaseDetails.isGiftBoxMessage)?purchaseDetails.isGiftBoxMessage:'',
                      'dimension12': (obj.product.stock.stockLevelStatus == "inStock")? 'True' : 'False',    
                      'dimension13': (obj.product.productStockLevelNumber)?'':'',
                      'dimension14': (obj.product.productEdition)?obj.product.productEdition:'' ,
                      'metric2': (obj.product.originalPrice)?obj.product.price.value:''
            }
            if(obj.product.originalPrice){
                const originalPrice= obj.product.originalPrice;
                const _originalPrice = originalPrice.match(/[\d\.]+/);
                if(_originalPrice){
                    _obj['price']=_originalPrice[0];
                }else{
                    _obj['price']=originalPrice;
                }
                }else{
                    _obj['price']=(obj.product.price)?obj.product.price.value:'';
                }
            _products.push(_obj);
            });
            _purchaseObj.ecommerce.purchase.actionField.products.push(_products);
            window.dataLayer.push(_purchaseObj);
 }
 gtmPromoclicks(promotions)
 {
     window.dataLayer = window.dataLayer || [];
     const _data={
        'event': 'eec.promotionClick',
        'ecommerce': {
            'promoClick': {
            'promotions': []
           }
        }
        };
        _data.ecommerce.promoClick.promotions.push(promotions);
     window.dataLayer.push();
 }
 gtmMentionMe(purchaseDetails:any){
     var emaildata = new String(purchaseDetails.user.uid);
     var email=emaildata.split("|");
     var username=new String(purchaseDetails.user.name);
     var name =username.split(" ");
    window.dataLayer = window.dataLayer || [];
    const _obj={
        'event': 'eec.Mention-Me',
        'mmFirstName':name[0],
        'mmLastName':name[name.length-1],
        'mmEmail': email[1],
        'mmOrderTotal': purchaseDetails.totalPriceWithTax.value,
        'mmOrderId':purchaseDetails.code,     
        'mmOrderCurrency': purchaseDetails.totalPriceWithTax.currencyIso,
        'mmSituation': 'postpurchase'
    }
    window.dataLayer.push(_obj);
    
}
 
}
