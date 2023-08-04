import { Directive, HostListener, Input } from '@angular/core';
import { FacebookParams } from '../directives/shareIcon/facebookParams'
import { TwitterParams } from '../directives/shareIcon/twitterParams';
import { PinterestParams } from '../directives/shareIcon/pinterestParams';
// import { EmailParams } from '../directives/shareIcon/emailParams';

@Directive({
  selector: '[ceiboShare]'
})
export class CeiboShare {
    @Input() facebook : FacebookParams;
    @Input() twitter : TwitterParams;
    @Input() pinterest : PinterestParams;
    // @Input() email : EmailParams;
    url;
    title;
    hashtags;
    to;
    image;
    description;
    subject;
  private sharers = {
                    facebook: {
                        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
                        params: {u: this.url}
                    },
                    twitter: {
                        shareUrl: 'https://twitter.com/intent/tweet/',
                        params: {
                            text: this.title,
                            url: this.url,
                            hashtags: this.hashtags
                            //via: this.via
                        }
                    },
                    // email: {
                    //     shareUrl: 'mailto:' + this.to,
                    //     params: {
                    //         subject: this.subject,
                    //         body: this.title + '\n' + this.url
                    //     },
                    //     isLink: true
                    // },
                    pinterest: {
                        shareUrl: 'https://in.pinterest.com/moltonbrownuk/',
                        params: {
                            url: this.url,
                            media: this.image,
                            description: this.description
                        }
                    },

                }

                  constructor() {}


  private urlSharer(sharer: any) {
            var p = sharer.params || {},
                keys = Object.keys(p),
                i: any,
                str = keys.length > 0 ? '?' : '';
            for (i = 0; i < keys.length; i++) {
                if (str !== '?') {
                    str += '&';
                }
                if (p[keys[i]]) {
                    str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
                }
            }

            var url = sharer.shareUrl + str;

            if (!sharer.isLink) {
                var popWidth = sharer.width || 600,
                    popHeight = sharer.height || 480,
                    left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
                    top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
                    popParams = 'scrollbars=no, width=' + popWidth + ', height=' + popHeight + ', top=' + top + ', left=' + left,
                    newWindow = window.open(url, '', popParams);

                if (window.focus) {
                    newWindow.focus();
                }
            } else {
                window.location.href = url;
            }
        }


private getSharer(){
    var _sharer: any = {};
    if(this.facebook){
        _sharer= this.sharers['facebook']
        _sharer.params = this.facebook
    }


    if(this.twitter){
        _sharer = this.sharers['twitter'];
        _sharer.params = this.twitter;
    }

    if(this.pinterest) {
        _sharer = this.sharers['pinterest'];
        _sharer.params = this.pinterest;
    }
    // if(this.email) {
    //     _sharer = this.sharers['email'];
    //     _sharer.params = this.email;
    // }


    return _sharer;

}

  @HostListener('click') share(){
        

            var s = this.getSharer()

            return s !== undefined ? this.urlSharer(s) : false;

  }

   

}
