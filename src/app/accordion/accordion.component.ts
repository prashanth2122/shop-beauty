import { Component, ContentChildren, QueryList, AfterContentInit, OnInit } from '@angular/core';
import { animation, trigger, state, transition, animate, style, group, query, useAnimation, stagger } from '@angular/animations';
import { AccordionItemComponent } from '../accordion-item/accordion-item.component';
@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  animations: [
    trigger('testAnimation', [
      transition('* => *', [
        query('*', style({ opacity: 0 })),
        query('*', stagger('50ms', [animate('1s', style({ opacity: 1 }))]))
      ])
    ])   
  ] 
})
export class AccordionComponent implements OnInit, AfterContentInit {
  @ContentChildren(AccordionItemComponent) items: QueryList<AccordionItemComponent>;
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
   this.items.toArray().forEach((item) => {
      item.onToggle.subscribe(() => {
        this.itemToggleHandler(item);
      });
    });
  }

  itemToggleHandler(item: AccordionItemComponent) {
  }

}