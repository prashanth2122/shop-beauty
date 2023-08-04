import {
  Component,
  OnInit,
  ViewEncapsulation,
  SimpleChange,
  Input
} from "@angular/core";
@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {
  reviewBoxStatus: boolean;
  @Input() showUpReview: boolean;
  @Input() productInfo: any;
  code: string;
  constructor() {
    this.reviewBoxStatus = false;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["showUpReview"]) {
      if (changes["showUpReview"]["currentValue"] != undefined) {
        that.reviewBoxStatus = changes["showUpReview"]["currentValue"];
      }
    }
    if (changes["productInfo"]) {
      if (changes["productInfo"]["currentValue"] != undefined) {
        let _dt = changes["productInfo"]["currentValue"];
        that.code = _dt.code;
      }
    }
  }
  ngOnInit() {}
  onReviewClick() {
    this.reviewBoxStatus = !this.reviewBoxStatus;
  }
}
