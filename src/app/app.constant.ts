export const PATH = {
  VERIFY_CATEGORY:"/products/search?query=:relevance:category:=:categoryCode&pageSize=12&fields=FULL&sort=",
  YMARKETING:"/getCustomerDetails?sapOutBoundId=:sapOutBoundId",
  UPDATESUBSCRIBER:"/sendRegistrationDataToYmkt",
  CSRF_TOKEN:"https://my300363.s4hana.ondemand.com/sap/opu/odata/sap/CUAN_CONTENT_PAGE_RESULT_SRV/$metadata",
  UNSUBSCRIBEYMARKETING:'https://my300363.s4hana.ondemand.com/sap/opu/odata/sap/CUAN_CONTENT_PAGE_RESULT_SRV/ResultHeaders',
  PICKERADDTOBASKET:'/users/:email/carts/:cartCode/addPromoProducts',
  FFCATEGORYPATH:'/products/search/:personaId',
  FEEBACK_FORMS:'/contactUsForm?formType=:formType',
  STOREPORTAL_LOGIN:'/storelogin?storeName=:storeName&password=:password',
  STORE_ORDERS:'/storeorders?storeName=:storeName&orderStatus=:orderStatus',
  ORDER_CHECKIN:'/ordercheckin?storeName=:storeName&status=:status',
  KLARNA_SESSION:"/users/:email/carts/:cartCode/klarnasession",  
  KLARNA_AUTHORIZATION:"/users/:email/carts/:cartCode/klarnaAuthorize?authorizationToken=:authorizationToken",
  JWT_TOKEN:'/users/:email/carts/:cartCode/generateJWT',
  PAYMENT_AUTHENTICATION:'/users/:email/carts/:cartCode/securepayment?sessionID=:sessionID',  
  VALIDATE_PAYMENT:'/users/:email/carts/:cartCode/validatepayment?responseJWT=:responseJWT&transactionID=:transactionID',
  EXPRESS_PAYMENT:"/users/:email/carts/:cartCode/securepayment?sessionID=:sessionID&isExpresscheckout=true&profileID=:profileID",
  EXPRESS_VALIDATE_PAYMENT:'/users/:email/carts/:cartCode/validatepayment?responseJWT=:responseJWT&transactionID=:transactionID&isExpresscheckout=true&profileID=:profileID',
  ORDERCONFIRMATION: "/orders/:orderId/?fields=FULL",
  ORDER_DETAILS: "/users/:email/orders/:orderCode/?fields=FULL",
  GIFT_CARD:"/users/:email/carts/:cartCode/giftcard",
  GIVEX_LOGIN:"/users/:email/givexlogin",
  GIVEX_REGISTRATION:"/users/:email/givexlogin/givexregister/newregistration",
  CHECK_BALANCE:"/users/:email/givexlogin/checkbalance",
  CHECK_GIFTBALANCE:"/checkbalance",
  TRANSFER_BALANCE:"/users/:email/transferbalance?FromGiftCardNumber=:FromGiftCardNumber&ToGiftCardNumber=:ToGiftCardNumber",
  REG_GIVEX_PAYMENT_DETAIL:"/users/:email/carts/:cartCode/paymentdetails",
  EXPRESS_CHECK_PATH:"/users/:email/carts/:cartCode/expressCheckout",
  PAYERID_PATH:"/users/:email/carts/:cartCode/paypalpayment?payerID=:payerID&systemIP=:systemIP&fields=FULL",  
  PAYPAL_PATH:"/users/:email/carts/:cartCode/paypalsetservice",
  PICK_MIX_BUNDLEPRICE: "/getBundlePrice",
  RETRIEVE_PASSWORD: "/forgottenpasswordtokens?userId=:email",  
  STORES: "/kao/stores",
  CHECK_STORE_PATH: "/stores/:storeName",
  BI_REPORT:"/bireports",
  FIND_POSTCODE:"https://services.postcodeanywhere.co.uk/PostcodeAnywhere/Interactive/FindByPostcode/v1.00/json3.ws?&Postcode=:postCode&Key=PZ52-UH91-BW19-BT37",
  POSTAL_ADDRESS:"https://services.postcodeanywhere.co.uk/PostcodeAnywhere/Interactive/RetrieveById/v1.20/json3.ws?&Key=PZ52-UH91-BW19-BT37&Id=:postCode",
  REG_DEBIT_PAYMENT: "/users/:email/carts/:cartCode/payment",
  SPLIT_PAYMENT:"/users/:email/carts/:cartCode/giftcard/splitpayment?firstName=:firstName&lastName=:lastName&givexCardNumber=:givexCardNumber&givexPinNumber=:givexPinNumber&amount=:amount",
  EXPRESS_SPLIT_PAYMENT:"/users/:email/carts/:cartCode/giftcard/splitpayment?firstName=:firstName&lastName=:lastName&givexCardNumber=:givexCardNumber&givexPinNumber=:givexPinNumber&amount=:amount&isExpresscheckout=true&profileID=:profileID",
  EXPRESS_DBPAYMENT:"/users/:email/carts/:cartCode/payment?isExpresscheckout=true&profileID=:profileID",
  EDIT_CARD: "/users/:email/editCreditCards?profileID=:profileID",
  CREATE_CARD: "/users/:email/postcreditcards",
  REMOVE_CARD: "/users/:email/deleteCreditCard?profileID=:profileID",
  CREATE_USER_OC_PATH :"/users?orderCode=:orderCode",
  CREATE_USER_PATH:"/users",
  DEFAULT_CARD:"/users/:email/setDefaultCard?profileID=:profileID",
  NEWSLETTER_SIGNUP:"/sendNewsLetterToYmkt",
  ORDER_HISTORY_DETAILS: "/users/:email/orders/:orderCode/?fields=FULL",
  ORDER_HISTORY_PATH:"/users/:email/orders?pageSize=123&fields=FULL&sort=:sort",
  PICK_MIX_PATH:"/products/search?query=:relavance:category:categoryId",
  DELIVERY_METHODS:"/users/:email/carts/:cartCode/expDeliveryMethods",
  EU_DL_METHODS:"/users/:email/carts/:cartCode/expdeliveryMethodsDEandEU?countryCode=:countryCode",
  US_DELIVERY_SERVICES:'/users/:email/carts/:cartCode/expusdeliveryservices?deliveryGroup=:deliveryGroup',
  SET_DELIVERY_METHOD:"/users/:email/saveDefaultDeliveryMethod?deliveryMethod=:deliveryMethod",
  OS_FULLCART:'/users/:email/carts/:cartCode?fields=FULL&deliveryGroup=',
  GET_INTERNATIONAL_DELIVERY_METHOD:"/users/:email/carts/:cartCode/InternationalDelivery?countryCode=:countryCode",
  SET_INTERNATIONAL_DELIVERY_METHOD: "/users/:email/carts/:cartCode/SetIntDeliveryModeToCart?countryCode=:countryCode&deliveryCode=International-Delivery",
  GFS_PATH:"/users/:email/carts/:cartCode/gfs/stores?postCode=:postalCode&latitude=:latitude&longitude=:longitude",
  GUEST_CART_SHIFTING_PATH: "/users/anonymous/carts/:cartCode/doubleLoginCartMerge/?oldCartId=:oldCartCode&toMergeCartGuid=:mergeCartGuid",
  FIND_STORE: "/stores/?latitude=:latitude&longitude=:longitude",
  SET_STORE:"/users/:email/carts/:cartCode/setStore?deliveryCode=ClickAndCollect",
  SET_PHONENUMBER:"/users/:email/carts/:cartCode/gfs/setPhoneNumber?phoneNumber=:phoneNumber",
  CLICKANDCOLLECT_ADDRESS_PATH: "/users/:email/carts/:cartCode/clickAndCollect/addresses/delivery",
  SHIPPING_ADDRESS:"/users/:email/carts/:cartCode/addresses/delivery",
  PRODUCT_DATA_PATH:"/products/:productCode?categoryCode=:categoryCode",
  CATEGORY_PRODUCTS:"/products/:categoryCode&pageSize=:pageSize&fields=FULL&sort=:sort",
  DELIVERY_SERVICE: "/users/:email/carts/:cartCode/NamedDeliveryServices?baseSiteId=:catalogversionId",
  DELIVERY_METHOD_TO_CART: "/users/:email/carts/:cartCode/selectDeliveryMethod?deliveryCode=:deliverycode",
  CATEGORY_SEARCH_PRODUCTS: "/products/search?query=:searchValue&pageSize=:pageSize&fields=FULL",
  CATEGORY_SEARCH_RESULTS: "/products/search?query=:searchValue",
  CHANGE_BILLING_ADDRESS:"/users/:email/carts/:cartCode/addresses/changeBillingAddress",
  CARD_DETAILS:"/users/:email/getCardDetails",
  US_DELIVERY_MODES:  "/users/:email/carts/:cartCode/usdeliveryservices?deliveryGroup=:deliveryGroup",
  DELIVERY_METHOD: "/users/:email/carts/:cartCode/DeliveryMethods",
  USER_CARTDETAILS: "/users/:email/carts/:cartID/?fields=FULL",
  DELIVERY_NAMED_DAY_SERVICE:"/users/:email/carts/:cartCode/SetNamedDeliveryModeToCart?deliveryCode=:deliveryCode",
  GUEST_SHIPPING_ADDRESS:"/users/anonymous/carts/:cartId/addresses/delivery",
  CONFIRM_ADDRESS: "/users/:email/carts/:cartCode/confirmAddress?addressCode=:addressId",
  PICK_MIX_BUNDLE_PATH: "/users/:email/carts/:cartCode/addBundle",
  GIFT_BOX:"/users/:email/carts/:cartCode/giftBox",
  REMOVE_BUNDLE_PATH:"/users/:email/carts/:cartCode/removeBundle?bundleNo=:bundleNo",
  UPDATE_BUNDLE: "/users/:email/carts/:cartCode/entries/bundleNo/:bundleNo?qty=:qty",
  ADD_TO_BASKET:"/users/:email/carts/:cartCode/entries",
  GENERATTE_CART:"/users/:email/carts",
  ADD_FAVOURITES:"/users/:email/wishlist/add?code=:code",
  CHANGE_PASSWORD:"/users/:email/password?userId=:userId&old=:currentPassword&new=:newPassword",
  UNSUBSCRIBE:"/unsubscription?OutboundId=:OutboundId",
  ANANONYMOUSCART:"/users/anonymous/carts/:cartCode/email?email=:email",
  REPEAT_ORDER:"/users/:email/carts/:cartCode/repeatOrder?code=:orderCode&cartId=:cartId",
  PROMOCODE:"/users/:email/carts/:cartCode/applyPromo?voucherId=:voucherId",
  REMOVE_PROMO:  "/users/:email/carts/:cartCode/vouchers/:coupon",
  PROFILE:"/users/:email",
  REMOVE_FAVOURITE: "/users/:email/wishlist/remove/?code=:productCode",
  FAVOURITES:"/users/:email/wishlist/retrieve",
  MERGE_CART:"/users/:email/carts?oldCartId=:oldCartId&toMergeCartGuid=:newCartId",
  CREATE_ADDRESS: "/users/:email/addresses",
  RETREIVE_ADDRESS: "/users/:email/profile/addresses",
  UPDATE_ADDRESS:"/users/:email/addresses/:addressId",
  REGISTER_CART:"/users/:email/carts",
  SITE_AUTENTICATION: "/oauth/token?client_id=clientcq&client_secret=password&grant_type=password",
  CART_TOKEN_PATH: "oauth/token?client_id=clientcq&client_secret=password&grant_type=client_credentials",
  catalog:"/catalogs",
 
  CS_ORDER_SEARCH:'/assistedservicewebservices/customers/search?orderId=:orderId&baseSite=:ASMbaseSite&access_token=:agentToken',
 
  CS_SEARCH:"/assistedservicewebservices/customers/search?query=:email&baseSite=:ASMbaseSite&access_token=:agentToken",
 
  CS_OAUTH:"oauth/token?client_id=asm&client_secret=password&grant_type=password&username=:agent&password=:password"
};

export const SERVER_PATHS = {
  DEV: "https://api.cxur-kaocorpor1-s3-public.model-t.cc.commerce.ondemand.com/kaowebservices/v2/"
};
export const gme = {
  googleMapKey: "AIzaSyDHfkdOsaMspf8lm0fNW_GyGb7MdAM5gs0"
};

export const US_COUNTRIES = [
  {
    name: "United States",
    isocode: "US",
    id: "US-US",
    states: [
      { name: "Alabama", isocode: "AL" },
      { name: "Alaska", isocode: "AK" },
      { name: "Arizona", isocode: "AZ" },
      { name: "Arkansas", isocode: "AR" },
      { name: "California", isocode: "CA" },
      { name: "Colorado", isocode: "CO" },
      { name: "Connecticut", isocode: "CT" },
      { name: "Delaware", isocode: "DE" },
      { name: "District of Columbia", isocode: "DC" },
      { name: "Florida", isocode: "FL" },
      { name: "Georgia", isocode: "GA" },
      { name: "Hawaii", isocode: "HI" },
      { name: "Idaho", isocode: "ID" },
      { name: "Illinois", isocode: "IL" },
      { name: "Indiana", isocode: "IN" },
      { name: "Iowa", isocode: "IA" },
      { name: "Kansas", isocode: "KS" },
      { name: "Kentucky", isocode: "KY" },
      { name: "Louisiana", isocode: "LA" },
      { name: "Maine", isocode: "ME" },
      { name: "Maryland", isocode: "MD" },
      { name: "Massachusetts", isocode: "MA" },
      { name: "Michigan", isocode: "MI" },
      { name: "Minnesota", isocode: "MN" },
      { name: "Mississippi", isocode: "MS" },
      { name: "Missouri", isocode: "MO" },
      { name: "Montana", isocode: "MT" },
      { name: "Nebraska", isocode: "NE" },
      { name: "Nevada", isocode: "NV" },
      { name: "New Hampshire", isocode: "NH" },
      { name: "New Jersey", isocode: "NJ" },
      { name: "New Mexico", isocode: "NM" },
      { name: "New York", isocode: "NY" },
      { name: "North Carolina", isocode: "NC" },
      { name: "North Dakota", isocode: "ND" },
      { name: "Ohio", isocode: "OH" },
      { name: "Oklahoma", isocode: "OK" },
      { name: "Oregon", isocode: "OR" },
      { name: "Pennsylvania", isocode: "PA" },
      { name: "Rhode Island", isocode: "RI" },
      { name: "South Carolina", isocode: "SC" },
      { name: "South Dakota", isocode: "SD" },
      { name: "Tennessee", isocode: "TN" },
      { name: "Texas", isocode: "TX" },
      { name: "Utah", isocode: "UT" },
      { name: "Vermont", isocode: "VT" },
      { name: "Virginia", isocode: "VA" },
      { name: "Washington", isocode: "WA" },
      { name: "West Virginia", isocode: "WV" },
      { name: "Wisconsin", isocode: "WI" },
      { name: "Wyoming", isocode: "WY" }
    ]
  },
  {
    name: "Canada",
    isocode: "CA",
    id: "US-CA",
    states: [
      {
        name: "Alberta",
        isocode: "AB"
      },
      {
        name: "British Columbia",
        isocode: "BC"
      },
      {
        name: "Manitoba",
        isocode: "MB"
      },
      {
        name: "New Brunswick",
        isocode: "NB"
      },
      {
        name: "Newfoundland and Labrador",
        isocode: "NL"
      },
      {
        name: "Northwest Territories",
        isocode: "NT"
      },
      {
        name: "Nova Scotia",
        isocode: "NS"
      },
      {
        name: "Nunavut",
        isocode: "NU"
      },
      {
        name: "Ontario",
        isocode: "ON"
      },
      {
        name: "Prince Edward Island",
        isocode: "PE"
      },
      {
        name: "Quebec",
        isocode: "QC"
      },
      {
        name: "Saskatchewan",
        isocode: "SK"
      },
      {
        name: "Yukon Territory",
        isocode: "YT"
      }
    ]
  },
  { name: "US Minor Outlying Islands", isocode: "UM", id: "US-UM" },
  { name: "US Virgin Islands", isocode: "VI", id: "US-VI" }
];
export const countries = [
  {
    name: "Albania",

    isocode: "AL"
  },
  {
    name: "American Samoa",

    isocode: "AS"
  },
  {
    name: "Andorra",

    isocode: "AD"
  },
  {
    name: "Anguilla",

    isocode: "AI"
  },
  {
    name: "Antigua",

    isocode: "AG"
  },
  {
    name: "Argentina",

    isocode: "AR"
  },
  {
    name: "Aruba",

    isocode: "AW"
  },
  {
    name: "Australia",

    isocode: "AU"
  },
  {
    name: "Austria",

    isocode: "AT"
  },
  {
    name: "Bahamas",

    isocode: "BS"
  },
  {
    name: "Barbados",

    isocode: "BB"
  },
  {
    name: "Belgium",

    isocode: "BE"
  },
  {
    name: "Belize",

    isocode: "BZ"
  },
  {
    name: "Bermuda",

    isocode: "BM"
  },
  {
    name: "Bhutan",

    isocode: "BT"
  },
  {
    name: "Bolivia",

    isocode: "BO"
  },
  {
    name: "Brazil",

    isocode: "BR"
  },
  {
    name: "British Virgin Islands",

    isocode: "VG"
  },
  {
    name: "Bulgaria",

    isocode: "BG"
  },
  {
    name: "Canada",

    isocode: "CA"
  },
  {
    name: "CapeVerde",

    isocode: "CV"
  },
  {
    name: "Cayman Islands",

    isocode: "KY"
  },
  {
    name: "Chile",

    isocode: "CL"
  },
  {
    name: "China",

    isocode: "CN"
  },
  {
    name: "Colombia",

    isocode: "CO"
  },
  {
    name: "CookIslands",

    isocode: "CK"
  },
  {
    name: "Corsica",

    isocode: "XE"
  },
  {
    name: "CostaRica",

    isocode: "CR"
  },
  {
    name: "Croatia",

    isocode: "HR"
  },
  {
    name: "Cyprus",

    isocode: "CY"
  },
  {
    name: "Czech Republic",

    isocode: "CZ"
  },
  {
    name: "Denmark",

    isocode: "DK"
  },
  {
    name: "Dominica",

    isocode: "DM"
  },
  {
    name: "Dominican Republic",

    isocode: "DO"
  },
  {
    name: "Ecuador",

    isocode: "EC"
  },
  {
    name: "El Salvador",

    isocode: "SV"
  },
  {
    name: "Estonia",

    isocode: "EE"
  },
  {
    name: "Falkland Islands (Malvinas)",

    isocode: "FK"
  },
  {
    name: "Faroe Islands",

    isocode: "FO"
  },
  {
    name: "Fiji",

    isocode: "FJ"
  },
  {
    name: "Finland",

    isocode: "FI"
  },
  {
    name: "France (Includes Monaco)",

    isocode: "FR"
  },
  {
    name: "French Guiana",

    isocode: "GF"
  },
  {
    name: "French Polynesia",

    isocode: "PF"
  },
  {
    name: "Georgia",

    isocode: "GE"
  },
  {
    name: "Germany",

    isocode: "DE"
  },
  {
    name: "Gibraltar",

    isocode: "GI"
  },
  {
    name: "Greece",

    isocode: "GR"
  },
  {
    name: "Greenland",

    isocode: "GL"
  },
  {
    name: "Grenada",

    isocode: "GD"
  },
  {
    name: "Guadeloupe",

    isocode: "GP"
  },
  {
    name: "Guam",

    isocode: "GU"
  },
  {
    name: "Guatemala",

    isocode: "GT"
  },
  {
    name: "Guyana",

    isocode: "GY"
  },
  {
    name: "Honduras",

    isocode: "HN"
  },
  {
    name: "Hong Kong",

    isocode: "HK"
  },
  {
    name: "Hungary",

    isocode: "HU"
  },
  {
    name: "Iceland",

    isocode: "IS"
  },
  {
    name: "India",

    isocode: "IN"
  },
  {
    name: "Ireland",

    isocode: "IE"
  },
  {
    name: "Israel",

    isocode: "IL"
  },
  {
    name: "Italy",

    isocode: "IT"
  },
  {
    name: "Japan",

    isocode: "JP"
  },
  {
    name: "Liechtenstein",

    isocode: "LI"
  },
  {
    name: "Lithuania",

    isocode: "LT"
  },
  {
    name: "Luxembourg",

    isocode: "LU"
  },
  {
    name: "Macao",

    isocode: "MO"
  },
  {
    name: "Macedonia",

    isocode: "MK"
  },
  {
    name: "Malaysia",

    isocode: "MY"
  },
  {
    name: "Maldives",

    isocode: "MV"
  },
  {
    name: "Malta",

    isocode: "MT"
  },
  {
    name: "Marshall Islands",

    isocode: "MH"
  },
  {
    name: "Martinique",

    isocode: "MQ"
  },
  {
    name: "Mauritius",

    isocode: "MU"
  },
  {
    name: "Mexico",

    isocode: "MX"
  },
  {
    name: "Moldova Republic Of",

    isocode: "MD"
  },
  {
    name: "Monaco",

    isocode: "MC"
  },
  {
    name: "Montserrat",

    isocode: "MS"
  },
  {
    name: "Morocco",

    isocode: "MA"
  },
  {
    name: "Myanmar (Burma)",

    isocode: "MM"
  },
  {
    name: "Nepal",

    isocode: "NP"
  },
  {
    name: "Netherlands",

    isocode: "NL"
  },
  {
    name: "Netherlands Antilles",

    isocode: "AN"
  },
  {
    name: "New Caledonia",

    isocode: "NC"
  },
  {
    name: "New Zealand",

    isocode: "NZ"
  },
  {
    name: "Nicaragua",

    isocode: "NI"
  },
  {
    name: "Niue",

    isocode: "NU"
  },
  {
    name: "Norfolk Island",

    isocode: "NF"
  },
  {
    name: "Northern Mariana Islands",

    isocode: "MP"
  },
  {
    name: "Norway",

    isocode: "NO"
  },
  {
    name: "Palau",

    isocode: "PW"
  },
  {
    name: "Panama",

    isocode: "PA"
  },
  {
    name: "Papua New Guinea",

    isocode: "PG"
  },
  {
    name: "Paraguay",

    isocode: "PY"
  },
  {
    name: "Peru",

    isocode: "PE"
  },
  {
    name: "Philippines",

    isocode: "PH"
  },
  {
    name: "Poland",

    isocode: "PL"
  },
  {
    name: "Portugal",

    isocode: "PT"
  },
  {
    name: "Puerto Rico",

    isocode: "PR"
  },
  {
    name: "Western Samoa",

    isocode: "WS"
  },
  {
    name: "Saint Kitts And Nevis",

    isocode: "KN"
  },
  {
    name: "SanMarino",

    isocode: "SM"
  },
  {
    name: "Serbia",

    isocode: "RS"
  },
  {
    name: "Singapore",

    isocode: "SG"
  },
  {
    name: "Solomon Islands",

    isocode: "SB"
  },
  {
    name: "Slovak Republic",

    isocode: "SK"
  },
  {
    name: "Spain",

    isocode: "ES"
  },
  {
    name: "South Africa",

    isocode: "ZA"
  },
  {
    name: "South Korea",

    isocode: "KR"
  },
  {
    name: "Slovenia",

    isocode: "SI"
  },
  {
    name: "Seychelles",

    isocode: "SC"
  },
  {
    name: "Sri Lanka",

    isocode: "LK"
  },
  {
    name: "Suriname",

    isocode: "SR"
  },
  {
    name: "St.Lucia",

    isocode: "LC"
  },
  {
    name: "St.Pierre and Miquelon",

    isocode: "PM"
  },
  {
    name: "St.Vincent and the Grenadines",

    isocode: "VC"
  },
  {
    name: "Sweden",

    isocode: "SE"
  },
  {
    name: "Switzerland",

    isocode: "CH"
  },
  {
    name: "Taiwan",

    isocode: "TW"
  },
  {
    name: "Tajikistan",

    isocode: "TJ"
  },
  {
    name: "Tonga",

    isocode: "TO"
  },
  {
    name: "Trinidad and Tobago",

    isocode: "TT"
  },
  {
    name: "Turkmenistan",

    isocode: "TM"
  },
  {
    name: "Turks and Caicos Islands",

    isocode: "TC"
  },
  {
    name: "Tuvalu",

    isocode: "TV"
  },
  {
    name: "United Kingdom",

    isocode: "GB"
  },
  {
    name: "United States",

    isocode: "US"
  },
  {
    name: "Uruguay",

    isocode: "UY"
  },
  {
    name: "Virgin Islands (U.S.)",

    isocode: "VI"
  },
  {
    name: "Venezuela",

    isocode: "VE"
  }
];

export const DE_COUNTRIES = [
  {
    name: "Deutschland",

    isocode: "DE"
  },
  {
    name: "Österreich",

    isocode: "AT"
  }
];
export const EUROPEAN_COUNTRIES = [
  {
    name: "Albania",

    isocode: "AL"
  },
  {
    name: "Armenia",

    isocode: "AM"
  },
  {
    name: "Austria",

    isocode: "AT"
  },
  {
    name: "Belarus",

    isocode: "BY"
  },
  {
    name: "Belgium",

    isocode: "BE"
  },
  {
    name: "Bosnia And Herzegowina",

    isocode: "BA"
  },
  {
    name: "Bulgaria",

    isocode: "BG"
  },
  {
    name: "Croatia",

    isocode: "HR"
  },
  {
    name: "Cyprus",

    isocode: "CY"
  },
  {
    name: "Czech Republic",

    isocode: "CZ"
  },
  {
    name: "Denmark",

    isocode: "DK"
  },
  {
    name: "Estonia",

    isocode: "EE"
  },
  {
    name: "Finland",

    isocode: "FI"
  },
  {
    name: "France (Includes Monaco)",

    isocode: "FR"
  },
  {
    name: "Georgia",

    isocode: "GE"
  },
  {
    name: "Germany",

    isocode: "DE"
  },
  {
    name: "Gibraltar",

    isocode: "GI"
  },
  {
    name: "Greece",

    isocode: "GR"
  },
  {
    name: "Greenland",

    isocode: "GL"
  },
  {
    name: "Hungary",

    isocode: "HU"
  },
  {
    name: "Iceland",

    isocode: "IS"
  },
  {
    name: "Ireland",

    isocode: "IE"
  },
  {
    name: "Italy",

    isocode: "IT"
  },
  {
    name: "Kazakhstan",

    isocode: "KZ"
  },
  {
    name: "Kyrgyzstan",

    isocode: "KG"
  },
  {
    name: "Liechtenstein",

    isocode: "LI"
  },
  {
    name: "Lithuania",

    isocode: "LT"
  },
  {
    name: "Luxembourg",

    isocode: "LU"
  },
  {
    name: "Macedonia",

    isocode: "MK"
  },
  {
    name: "Malta",

    isocode: "MT"
  },
  {
    name: "Monaco",

    isocode: "MC"
  },
  {
    name: "Netherlands",

    isocode: "NL"
  },
  {
    name: "Norway",

    isocode: "NO"
  },
  {
    name: "Poland",

    isocode: "PL"
  },
  {
    name: "Portugal",

    isocode: "PT"
  },
  {
    name: "Moldova Republic Of ",

    isocode: "MD"
  },
  {
    name: "San Marino",

    isocode: "SM"
  },
  {
    name: "Serbia",

    isocode: "RS"
  },
  {
    name: "Slovak Republic",

    isocode: "SK"
  },
  {
    name: "Slovenia",

    isocode: "SI"
  },
  {
    name: "Spain",

    isocode: "ES"
  },
  {
    name: "Sweden",

    isocode: "SE"
  },
  {
    name: "Switzerland",

    isocode: "CH"
  },
  {
    name: "Tajikistan",

    isocode: "TJ"
  },
  {
    name: "Turkmenistan",

    isocode: "TM"
  },
  {
    name: "Ukraine",

    isocode: "UA"
  },
  {
    name: "Uzbekistan",

    isocode: "UZ"
  }
];
