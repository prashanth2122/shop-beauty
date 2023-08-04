 import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { CSCustomerService } from "./cs-header.service";
import { RegistrationForm } from "../../forms/registration.form";
import { FormBuilder, FormGroup,Validators,FormControl } from "@angular/forms";
import { SingletonService } from "../../services/singleton.service";
import { patternValidator } from '../../forms/pattern-validator';
declare var window: any;
declare var $:any;
@Component({
  selector: "app-cs-header",
  templateUrl: "./cs-header.component.html",
  styleUrls: ["./cs-header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CsHeaderComponent implements OnInit,AfterViewInit {
  @ViewChild('csAgentRef') csAgentRef:ElementRef;
  @ViewChild('customerRef') customerRef:ElementRef;
  asmCustomer: boolean;
  authForm: FormGroup;
  ASMCustomerform: FormGroup;
  csAgent: boolean;
  searchBlock: boolean;
  searchResults: any;
  toggleAsmHead: boolean;
  searchOrderResults: any;
  searchOrderBlock: boolean;
  customerDetail: any;
  startSession: boolean;
  timex: any;
  seconds: any;
  retrieveOrder: boolean;
  hours: any;
  csAgentName: string;
  unknownUser: boolean;
  errMsgObj: any;
  csAgentLogged:boolean;
  asm:any;
  csErrMsg:any;
  checkwithEmailValidation:boolean;
  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public singletonServ: SingletonService,
    public fb: FormBuilder,
    public customerForm: RegistrationForm,
    public csService: CSCustomerService
  ) {
    this.csErrMsg={
      status: false,
      description: 'Please Fill The Details'
    };
    this.errMsgObj = {
      status: false,
      description: 'Please Fill The Details'
    };
    this.authForm = this.fb.group(customerForm.ASMform());
    this.ASMCustomerform = this.fb.group(customerForm.ASMCustomerform());
  }

  ngOnInit() {
    const baseSite=this.singletonServ.catalogVersion;
    if(baseSite){
      this.setLang(baseSite.lngCode);
    }
    this.toggleAsmHead = true;
    const queryStatus = window.location.search.replace('?', '');
    if (queryStatus.indexOf('ASM') != -1 || this.singletonServ.getStoreData(baseSite.csCustomer)) {
    
      if (this.singletonServ.getStoreData(baseSite.csCustomer)) {
        const user = JSON.parse(this.singletonServ.getStoreData(baseSite.csCustomer));
        this.csAgent = user.csAgent;
        this.csAgentLogged=true;
        this.singletonServ.catalogVersion.csAgent=true; 
        this.singletonServ.catalogVersion.agentToken=user["agentToken"];   
        if (user.email) {
          this.csAgentName = user.uid;
          this.startSession = true;
          this.ASMCustomerform.controls['customer'].setValue(user.email);
          this.ASMCustomerform.controls['customerOrderId'].setValue(user.code);
        }
        this.singletonServ.sendMessage({'pointAsAsagent':true});
      } else {
        this.csAgent = true;
      }
      this.asmCustomer = true;
    } else {
      this.asmCustomer = false;
    }
    
  }
  setLang(lang: string) {
    this.csService.getStaticContent(lang).subscribe((response:any)=>{
     this.asm=response.asmData
    });
  }
  onCloseBar() {
    this.toggleAsmHead = !this.toggleAsmHead;
  }
  keyDownFunction(event){
    if(event.keyCode==13){
      event.target.blur();
      this. onSubmitCSForm();
      return false;
    }
}
  onSubmitCSForm() {
    const that=this;
    let emailIsValid:boolean;
    const baseSite=this.singletonServ.catalogVersion;
    if (this.authForm.valid) {
      that.    csErrMsg=undefined;
      const _obj = this.authForm.value;
      let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      emailIsValid = pattern.test(_obj.username);
    if(emailIsValid) {
      if(that.csAgentRef){
        that.authForm.controls['username'].setErrors({'incorrect': true});
        that.csAgentRef.nativeElement.focus();
        that.checkwithEmailValidation=true;
      }
     }else{
      that.checkwithEmailValidation=false;
      this.csService.createUser(_obj).subscribe(
        response => {
          this.csAgentName=this.authForm.value['username'];
          this.csAgent = false;
          this.csAgentLogged=true;
          const _obj = {
            csAgentName:this.authForm.value['username'],
            csAgent: false,
            agentToken: response["access_token"],
            uid:this.authForm.value['username']
          };
          this.singletonServ.setStoreData(baseSite.csCustomer, JSON.stringify(_obj));
          if(this.customerRef){
            this.customerRef.nativeElement.focus();
          }
          if(this.singletonServ.getStoreData(baseSite.guest)){
            this.singletonServ.removeItem(baseSite.guest);
          }else if(this.singletonServ.getStoreData(baseSite.reg)){
            this.singletonServ.removeItem(baseSite.reg);
          }
          this.singletonServ.catalogVersion['csAgent']=true; 
          this.singletonServ.catalogVersion['agentToken']=response["access_token"];   
          this.singletonServ.sendMessage({'pointAsAsagent':true});  
          this.router.navigate(["store"]);
        },
        (err:any) => {
           if(err.error.error=="invalid_grant"){
           that.    csErrMsg={
            status: true,
            description: 'Your username or password may be incorrect. Please try again. '
          };
        }
        });
    }
    }else{
      that.validateAllFormFields(that.authForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {        
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {      
        this.validateAllFormFields(control);            
      }
    });
    }
  onAgentSignOut(){
    const baseSite = this.singletonServ.catalogVersion;
    this.singletonServ.removeItem(baseSite.reg);
    this.singletonServ.removeItem(baseSite.csCustomer);
    this.startSession=false;
    this.csAgent=true;
    this.csAgentLogged=false;
    this.ASMCustomerform.reset();
    this.authForm.reset();
    if(this.csAgentRef){
      this.csAgentRef.nativeElement.focus();
    }
    if (this.singletonServ.getStoreData(baseSite.csCustomer)) {
      this.singletonServ.removeItem(baseSite.csCustomer);
    }
    this.singletonServ.sendMessage({ retrieveAsASM: true });
    this.router.navigate(["store"]);
  }
  onEndCustomerSession(event){
    const baseSite = this.singletonServ.catalogVersion;
    this.singletonServ.removeItem(baseSite.reg);
    if (this.singletonServ.getStoreData(baseSite.csCustomer)) {
      const user = JSON.parse(this.singletonServ.getStoreData(baseSite.csCustomer));
      delete user.email;
      delete user.code;
      this.singletonServ.setStoreData(baseSite.csCustomer, JSON.stringify(user));
    }
    this.startSession=false;
    this.customerDetail=undefined;
    this.searchResults=undefined;    
    this.ASMCustomerform.reset();
    if(this.customerRef){
      this.customerRef.nativeElement.focus();
    }
    this.singletonServ.sendMessage({ retrieveAsASM: true,endSession:true });
    this.router.navigate(["store"]);
  }

onSearchUser(event) {
     const baseSite=this.singletonServ.catalogVersion;
      const email = this.ASMCustomerform.controls['customer'].value;
      email.trim();
      this.errMsgObj['status'] = false;
       if (this.singletonServ.getStoreData(baseSite.csCustomer)) {
        const user = JSON.parse(this.singletonServ.getStoreData(baseSite.csCustomer));
        const _searchKeyWord =email.trim();
          if(_searchKeyWord.length >2){        
            this.csService
              .retrieveUsersDetails(baseSite, user.agentToken, email)
              .subscribe(
                response => {
                  if (response) {
                    this.searchResults = response['entries'];
                    this.searchBlock = true;
                  }
                },
                err => {}
              );
        }else{
          this.searchResults=undefined;
        }
    }
   
  }
 




  onSelectCart(event, cart) {
    this.ASMCustomerform['controls']['customerOrderId'].patchValue(cart.code);
    this.searchOrderBlock = false;
    this.retrieveOrder = false;
  }






onBlurSearchUser(event){
  const _val: any = this.ASMCustomerform.value;
  if(_val['customer']){
    const customer =_val['customer'].trim();
    this.ASMCustomerform['controls']['customer'].patchValue(customer);
    if(customer.length == 0 || !_val['customer'] ){
        this.searchResults=undefined;
        this.ASMCustomerform['controls']['customer'].setValidators(null);
        this.ASMCustomerform['controls']['customer'].updateValueAndValidity();
        this.ASMCustomerform['controls']['customerOrderId'].setValidators([
                          Validators.required,
                          patternValidator(/^[0-9]{8,8}$/)
                        ]);
        this.ASMCustomerform['controls']['customerOrderId'].updateValueAndValidity();
    }

 }
}
onBlurOrderSearch(event){
  const _val: any = this.ASMCustomerform.value;
  if(_val['customerOrderId']){
    const customerOrderId =_val['customerOrderId'].trim();
    if(_val['customer']){
      const customer =_val['customer'].trim();
      this.ASMCustomerform['controls']['customer'].patchValue(customer);
    }
  
    this.ASMCustomerform['controls']['customerOrderId'].patchValue(customerOrderId);

    if(this.ASMCustomerform['controls']['customerOrderId'].valid){
    }
 }
}
onSelectUser(event, user) {
  const  _displayUid=user.displayUid.split('|');
  const _email =  (_displayUid.length ==1)?user.displayUid:_displayUid[1];
  this.ASMCustomerform['controls']['customerID'].setValue(user.customerId);
  this.ASMCustomerform['controls']['customer'].setValue(_email);
  if(!this.ASMCustomerform['controls']['customerOrderId'].valid){
    this.ASMCustomerform['controls']['customerOrderId'].setValidators(null);
    this.ASMCustomerform['controls']['customerOrderId'].updateValueAndValidity();
  }
  this.customerDetail=user;
  this.searchBlock = false;
}

searchMBUser(){
  const baseSite=this.singletonServ.catalogVersion;
  const _val: any = this.ASMCustomerform.value;
  const _customer=_val.customer;  
  if (this.singletonServ.getStoreData(baseSite.csCustomer)) {
    const user = JSON.parse(this.singletonServ.getStoreData(baseSite.csCustomer));
    const _searchKeyWord =_customer.trim();
  this.csService
  .retrieveUsersDetails(baseSite, user.agentToken, _searchKeyWord)
  .subscribe(
    (response:any) => {
      if (response) {
        const _entries:any = response['entries'];
        _entries.filter((obj)=>{
          if(_searchKeyWord === user.displayUid || user.firstName === _searchKeyWord || user.lastName === _searchKeyWord){
            return obj;
          }
        });
        if(_entries.length !=0){
          this.customerDetail=_entries[0];
          this.checkoutAsCSCustomer();
        }else{
          this.errMsgObj = {
            status:true,
            description: 'Please fill the valid details .'
          };
        }
      }
    },
    err => {}
  );
  }
}
onSearchOrderKeyDown(event){
  this.errMsgObj['status'] = false;
  if(event.keycode==13){
    this.onSubmitCSCustomerForm(event);
  }
}
onSubmitCSCustomerForm(event) {
  event.preventDefault();
  const _val: any = this.ASMCustomerform.value;
  const _searchKeyWord=_val.customer;
  if(_searchKeyWord ){
   _searchKeyWord.trim();
  }
  const _customerOrderId=_val.customerOrderId; 
  if(_customerOrderId ){
  _customerOrderId.trim();
}
  if(_searchKeyWord && _customerOrderId){
    if(_searchKeyWord !='' && _customerOrderId !="" ){
      if(this.searchResults.length !=0){
      const _findUSer=this.searchResults.find((user)=>{
        const _uid=user.uid.split('|');
        const _email=_uid[_uid.length-1];
        if(_searchKeyWord === _email || user.firstName === _searchKeyWord || user.lastName === _searchKeyWord){
          return user;
        }
      });
      if(_findUSer){
        this.customerDetail=_findUSer;
        this.onSearchOrder();
      }else{
        this.errMsgObj = {
          status:true,
          description: 'Please provide valid customer information'
       };
      }
     }else{
      this.errMsgObj = {
        status:true,
        description: 'Please provide valid customer information'
     };
     }
    } else    if (_searchKeyWord !='' ){
      if(  this.searchResults.length !=0){
       const _findUSer=this.searchResults.find((user)=>{
           const _uid=user.uid.split('|');
           const _email=_uid[_uid.length-1];
         if(_searchKeyWord==_email|| _searchKeyWord === user.displayUid || user.firstName === _searchKeyWord || user.lastName === _searchKeyWord){
           return user;
         }
       });
       if(_findUSer){
         this.customerDetail=_findUSer;
         this.checkoutAsCSCustomer();
       }else{
         this.errMsgObj = {
           status:true,
           description: 'Please provide valid customer information'
        };
       }
      }else{
       this.errMsgObj = {
         status:true,
         description: 'Please provide valid customer information'
      };  
      }
   } else
    if (_customerOrderId !=""){
     this.onSearchOrder();
   } 

  } else {

   if(_searchKeyWord){
   if (_searchKeyWord !='' ){
     if(  this.searchResults.length !=0){
      const _findUSer=this.searchResults.find((user)=>{
        const _uid=user.uid.split('|');
        const _email=_uid[_uid.length-1];
        if(_searchKeyWord === _email || user.firstName === _searchKeyWord || user.lastName === _searchKeyWord){
          return user;
        }
      });
      if(_findUSer){
        this.customerDetail=_findUSer;
        this.checkoutAsCSCustomer();
      }else{
        this.errMsgObj = {
          status:true,
          description: 'Please provide valid customer information'
       };
      }
     }else{
      this.errMsgObj = {
        status:true,
        description: 'Please provide valid customer information'
     };  
     }
  } else{
    this.errMsgObj = {
      status:true,
      description: 'Please provide valid customer information'
   };
  }
} else if(_customerOrderId){
  if (_customerOrderId !='' ){
     this.onSearchOrder();
  }else{
    this.errMsgObj = {
      status:true,
      description: 'Please provide valid customer information'
   };
  }
} else{
        this.errMsgObj = {
          status:true,
          description: 'Please provide valid customer or order information to proceed further'
    };
  }
}
}

onSearchOrder() {
  const baseSite=this.singletonServ.catalogVersion;
  const order = this.ASMCustomerform.controls['customerOrderId'].value;
  if(order){
   order.trim();
  if ( order !== '' ) {
    if (this.singletonServ.getStoreData(baseSite.csCustomer)) {
      const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.csCustomer));
      this.csService
        .retrieveOrderDetails(baseSite, _user.agentToken, order)
        .subscribe(
          response => {
            if (response) {
              const _val: any = this.ASMCustomerform.value;
              const customer =_val['customer'];
               if(response['entries']){
                const _dtl =response['entries'][0];
                if(customer){
               if(customer !=''){
                   customer.trim();
                  if (Object.values(_dtl).indexOf(customer) > -1) {
                      this.singletonServ.catalogVersion.csAgent=true; 
                      this.singletonServ.catalogVersion.agentToken=_user.agentToken;
                      this.singletonServ.sendMessage({'pointAsAsagent':true});
                      this. orderQueryResults(_dtl);
                  }else{
                    this.errMsgObj = {
                      status:true,
                      description: "Given  Order Id doesn't belong to the customer"
                    };
                  }
               }else{
                 this.singletonServ.catalogVersion.csAgent=true; 
                 this.singletonServ.catalogVersion.agentToken=_user.agentToken;
                 this.singletonServ.sendMessage({'pointAsAsagent':true});
                 this. orderQueryResults(_dtl);
                 this.ASMCustomerform['controls']['customer'].patchValue(_dtl.displayUid);
               }
              }else{
                this.singletonServ.catalogVersion.csAgent=true; 
                this.singletonServ.catalogVersion.agentToken=_user.agentToken;
                this.singletonServ.sendMessage({'pointAsAsagent':true});
                this. orderQueryResults(_dtl);
                this.ASMCustomerform['controls']['customer'].patchValue(_dtl.displayUid);
              }
            }
          }
          },
          err => {
            this.errMsgObj = {
              status:true,
              description: 'Please provide valid order id'
            };
          }
        );
  }
} 
  }
}
checkoutAsCSCustomer(){
 
  const user = this.customerDetail;
  const baseSite = this.singletonServ.catalogVersion;
  const _obj = JSON.parse(this.singletonServ.getStoreData(baseSite.csCustomer));
  this.csAgentName=_obj.uid;
  const _user = { email: "" };
  const  _displayUid=user.displayUid.split('|');
  const _email =  (_displayUid.length ==1)?user.displayUid:_displayUid[1];
  _user["email"] =  _email;
  _obj['email']  =  _email;
  this.singletonServ.catalogVersion.csAgent=true; 
  this.singletonServ.catalogVersion.agentToken=_obj.agentToken; 
  this.singletonServ.sendMessage({'pointAsAsagent':true});
  this.csService.generateToken(baseSite).subscribe(
    token => {
      _user['token']=   token["access_token"],
  this.csService
    .getCurrentUserRelevantCart(baseSite,token["access_token"],_email)
    .subscribe(
      resp => {
        if (resp["carts"]) {
          if (resp["carts"][0]) {
            const code = resp["carts"][0]["code"];
            _user["code"] = code;
            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user));
            this.singletonServ.setStoreData(baseSite.csCustomer, JSON.stringify(_obj));
            this.startSession=true;
            this.singletonServ.sendMessage({ retrieveAsASM: true });
            this.router.navigate(["store", "myaccount", "profile"]); 
          }else{
            this.startSession=true; 
            this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user));
            this.singletonServ.setStoreData(baseSite.csCustomer, JSON.stringify(_obj));
            this.singletonServ.sendMessage({ retrieveAsASM: true });
            this.router.navigate(["store", "myaccount", "profile"]); 
          }
        }
      },
      error => {
        this.startSession=true; 
        this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_user));
        this.singletonServ.setStoreData(baseSite.csCustomer, JSON.stringify(_obj));
        this.singletonServ.sendMessage({ retrieveAsASM: true });
        this.router.navigate(["store", "myaccount", "profile"]); 
      });

    });
}
orderQueryResults(_dtl){
  const baseSite=this.singletonServ.catalogVersion;
  this.customerDetail = _dtl;
  const order = this.ASMCustomerform.controls['customerOrderId'].value;
  const _user = JSON.parse(this.singletonServ.getStoreData(baseSite.csCustomer));
  const  _displayUid=  _dtl.uid.split('|');
  const _email =  (_displayUid.length ==1)?_dtl.uid:_displayUid[1];
  this.csAgentName =_email;
  _user['code'] = order;
  const _reg={
    email:_email
  };
  this.singletonServ.setStoreData(baseSite.reg, JSON.stringify(_reg));
  this.singletonServ.setStoreData(baseSite.csCustomer, JSON.stringify(_user));
  this.singletonServ.sendMessage({ retrieveAsASM: true });
  this.router.navigate(["store", "myaccount", "profile", "orderDetails"], {
    queryParams: { orderId: order},
    queryParamsHandling: "merge"
  });
  this.startSession = true;
}
ngAfterViewInit(){
 
}
}
