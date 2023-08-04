import { Component, OnInit } from '@angular/core';
import {RegistrationForm} from '../../forms/registration.form';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import {StorePortalService} from '../store-portal.service';
import { SingletonService } from "../../services/singleton.service";
import * as _ from "lodash";
@Component({
  selector: 'app-store-portal-authentication',
  templateUrl: './store-portal-authentication.component.html',
  styleUrls: ['./store-portal-authentication.component.scss']
})
export class StorePortalAuthenticationComponent implements OnInit {
  storesList:Array<any>=[];
  authForm:FormGroup;
  constructor(
    public customerForm: RegistrationForm,
    private fb: FormBuilder,
    public router: Router,
    public portalServ : StorePortalService,
    public singletonServ: SingletonService
  ) {
    this.authForm = this.fb.group(customerForm.StorePortalAuthForm());
   }


    ngOnInit() {
      this.retrieveMBStores();
   }
   retrieveMBStores(){
    const baseSite=this.singletonServ.catalogVersion;
     this.portalServ.getStores(baseSite).subscribe(
       response => {
         const store = response["kaoStores"];
         if( store.length !=0 ){
          const _stores = store.map((obj)=>{
              if(obj['country'] == "United Kingdom" || obj['country']=="United States"){
                if(obj['stores']){
                    const _store =obj['stores'].find((item)=>{
                        if(item.storeType== "Molton Brown Stores") {
                          return  item
                      }
                    });
                    if(_store){
                      return _store;
                    }
                }
              }
            });
           const  _moltystores = _stores.filter(function( element ) {
              return element !== undefined;
             });
             if(_moltystores.length !=0){
                  const _storesType = _moltystores.reduce(function(prev, curr) {
                    return prev.stores.concat(curr.stores);
                  });
                  _storesType.sort(function(a, b){
                              if(a < b) { return -1; }
                              if(a > b) { return 1; }
                              return 0;
                          })
                    _.uniq(_storesType);
                    this.storesList = _storesType;
            }    
        }
     
       },
       err => {}
     );
   }
  onSubmitForm(event){
    const baseSite=this.singletonServ.catalogVersion;
    if(this.authForm.valid){
      const _val =this.authForm.value;
      this.portalServ.generateToken(baseSite).subscribe(resp=>{
        const tokenId = resp["access_token"];
        const _storeName =encodeURIComponent(_val.storeName);
       this.portalServ.portalAuthentication(baseSite,tokenId,_storeName,_val.password ).subscribe((portal)=>{
        this.singletonServ.portalStoreName=_val.storeName;
        this.singletonServ.setStoreData('portalEncoder',JSON.stringify({storeName:_val.storeName,status:true,token:tokenId}));
        let _obj ={
          auth:{
            status:true,
            storeName:_val.storeName
          }
        };
        this.singletonServ.sendMessage(_obj);
        this.router.navigate(['store','storeportal','info_table']);
      },err=>{

      });
    },err=>{

    });
  }
}

}
