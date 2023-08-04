import {
  Inject,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ElementRef,
  Renderer2,
  AfterViewInit,
  forwardRef,
  HostListener
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SingletonService } from "../../services/singleton.service";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements OnInit,AfterViewInit {
  @Input() dropdownDetails:any;
  @Input() countries:any;
  @Output() onSelectVal: EventEmitter<any> = new EventEmitter<any>();
  @Input() parentForm: FormGroup;
  @Input() formInnerControlName: string;
  buttonDorp:any;
  arrowkeyLocation = 0;
  @HostListener('document:click')
  onCloseDropDown() {
   this.closeAllSelect(this.buttonDorp);
  }
  constructor(
    @Inject(DOCUMENT) public dom,
    public renderer: Renderer2,
    public singletonServ: SingletonService, 
    ) {
  }
  keyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
        case 38: // this is the ascii of arrow up
                 this.arrowkeyLocation--;
                 break;
        case 40: // this is the ascii of arrow down
                 this.arrowkeyLocation++;
                 break;
    }
}

  ngOnInit() { }
 
ngAfterViewInit(){
  this.createCountryDomEl('custom-country-select');
  // let  _countryBlock = this.dom.getElementsByClassName('custom-country-select');
  //   let  err=this.dom.createElement("DIV");
  //   err.setAttribute("class","dropdown-err");      
  //   err.innerHTML=this.dropdownDetails.errMSG;
  //   _countryBlock[0].appendChild(err);  
}
   createCountryDomEl(classs){
    const that=this;
    let parent, i, j, selElmnt, dropdown, dropdownMenu,dropdownCont,dropdownContainer, dropdownMenuList,unorderList,dropdownMenuListAnchor;
    parent = this.dom.getElementsByClassName(classs);
    for (i = 0; i < parent.length; i++) {
      selElmnt = parent[i].getElementsByTagName("select")[0];
      dropdownContainer = this.dom.createElement("DIV");
      dropdownContainer.setAttribute("class","dropdown-container")
      dropdownCont = this.dom.createElement("DIV");
      dropdownCont.setAttribute("class","dropdown");
      dropdown = this.dom.createElement("button");
      dropdown.setAttribute("class", "select-selected dropdown-toggle");
      dropdown.setAttribute("type", "button");
      dropdown.setAttribute("data-toggle", "dropdown");
      dropdown.setAttribute("id", "dropdownCountry");
      if(selElmnt.selectedIndex !=-1){
      dropdown.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      }
      dropdownCont.appendChild(dropdown);  
      let  err=this.dom.createElement("DIV");
      err.setAttribute("class","dropdown-err");      
      err.innerHTML=this.dropdownDetails.errMSG;
      dropdownCont.appendChild(err);     
      // parent[i].appendChild(dropdownCont);
      dropdownMenu = this.dom.createElement("DIV");
      dropdownMenu.setAttribute("class", "dropdown-menu");
      dropdownMenu.setAttribute("style","max-height: 200px;");
      unorderList=   this.dom.createElement("UL");
      unorderList.setAttribute("class", "inner");
      unorderList.setAttribute("style","max-height: 200px; overflow-y: auto;background-color:#fff;");
      unorderList.setAttribute("role", "menu");
    
      for (j = 0; j < selElmnt.length; j++) {
        dropdownMenuList = this.dom.createElement("LI");
        dropdownMenuListAnchor= this.dom.createElement("A");
        dropdownMenuListAnchor.setAttribute("class", "dropdown-item");
        dropdownMenuListAnchor.setAttribute("href",`javascript:void(${j})`);
        dropdownMenuListAnchor.setAttribute("data-id",`${j}`);
        dropdownMenuList.appendChild(dropdownMenuListAnchor);
        dropdownMenuListAnchor.innerHTML = selElmnt.options[j].innerHTML;
        dropdownMenuListAnchor.addEventListener("click", function(e) {
            if(e.target.dataset.id =="0"){
              dropdown.setAttribute("class", "select-selected has-error");
              this.setAttribute("class", "same-as-selected has-error");
            }else{
              dropdown.classList.remove('has-error');
              this.setAttribute("class", "same-as-selected");
            }
            this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("button")[0].innerHTML = this.innerHTML;
            that.onSelectVal.emit({id:e.target.dataset.id});
          });
          dropdownMenuListAnchor.addEventListener("keydown", function(e) {
            if(e.key=="Enter"){
            //   this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("button").focus(function() {
            //     this.blur();
            // });
              if(e.target.dataset.id =="0"){
                dropdown.setAttribute("class", "select-selected has-error");
                this.setAttribute("class", "same-as-selected has-error");
              }else{
                dropdown.classList.remove('has-error');
                this.setAttribute("class", "same-as-selected");
              }
              this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("button")[0].innerHTML = this.innerHTML;
              that.onSelectVal.emit({id:e.target.dataset.id});
          }
        });
        unorderList.appendChild(dropdownMenuList);
      }
      dropdownMenu.appendChild(unorderList);
      dropdownCont.appendChild(dropdownMenu);
      dropdownContainer.appendChild(dropdownCont);
      parent[i].appendChild(dropdownContainer);
      } 

    }
     closeAllSelect(elmnt) {
      var x, y, i, arrNo = [];
      x = this.dom.getElementsByClassName("select-items");
      y = this.dom.getElementsByClassName("select-selected");
      for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i)
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }


}




export interface SimpleOption {
  id: string;
  name: string;
}