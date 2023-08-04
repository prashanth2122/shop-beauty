import { 
  Component, 
  Input, 
  Output, 
  HostBinding, 
  EventEmitter, 
  OnInit,  
  OnChanges,
  SimpleChange, 
  ElementRef,
  ViewChild} from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss']
})
export class AccordionItemComponent implements OnInit,OnChanges {  
  public state: string = 'isClose';
  _isOpen: boolean = false;
  @ViewChild('accordionList') accordionList: ElementRef;
  @Input() expandContent: boolean;
  @Input('isOpen')
  set isOpen(value: boolean) {
    this._isOpen = value;
    this.state = this._isOpen ? 'isOpen' : 'isClose';
    if(this._isOpen) {
      $(this.accordionList.nativeElement).slideDown(1000);
    } else {
      $(this.accordionList.nativeElement).slideUp(1000);
    }
  }
  get isOpen(): boolean {
    return this._isOpen;
  }
  @Input() title: string;
  @Output() onToggle: EventEmitter<any> = new EventEmitter<any>();
  @Input() message: boolean;
  constructor() { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["expandContent"]) {
      if (changes["expandContent"]["currentValue"] != undefined) {
        this.isOpen = changes["expandContent"]["currentValue"];
        this.onToggle.emit(this.isOpen);
      }
    }
  }
  ngOnInit() {
  }
}