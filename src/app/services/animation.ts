import {
    animation,
    trigger, 
    animateChild, 
    group,
    transition, 
    animate, 
    style, 
    query,
    state,
    stagger
  } from '@angular/animations';
  

  export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
      query(
        ':enter',
        [style({ opacity: 0 })],
        { optional: true }
      ),
      query(
        ':leave',
        [style({ opacity: 1 }), animate('0s', style({ opacity: 0 }))],
        { optional: true }
      ),
      query(
        ':enter',
        [style({ opacity: 0 }), animate('0.75s', style({ opacity: 1 }))],
        { optional: true }
      )
    ])
  ]);



  export const bottomErrorTransistion =trigger('errorHideShow', [
      state('err-open', style({
         opacity: 1,
         height:'100%',
         display: 'block',
         visibility: 'visible',
         animationDuration: '.5s',
         animationDelay: '.5s',
         minHeight: '19px'
      })),
      state('err-hide', style({
        display: 'none',
        visibility: 'hidden',
        height:'0px',
        minHeight: '0px',
        opacity: 0,
        animationDuration: '.5s',
        animationDelay: '.5s'
       })),
      transition('err-open => err-hide', [
        animate('.5s')
      ]),
      transition('err-hide => err-open', [
        animate('.5s')
      ]),
      transition('* => err-hide', [
        animate('.5s')
      ]),
      transition('* => err-open', [
        animate('0.5s')
      ]),
      transition('err-open <=> err-hide', [
        animate('0.5s')
      ]),
      transition ('* => err-open', [
        animate ('.5s',
          style ({ opacity: '*' }),
        ),
      ]),
      transition('* => *', [
        animate('1s')
      ]),
    ])

  export const transAnimation = animation([
    style({
      height: '{{ height }}',
      opacity: '{{ opacity }}',
      backgroundColor: '{{ backgroundColor }}'
    }),
    animate('{{ time }}')
  ]);
