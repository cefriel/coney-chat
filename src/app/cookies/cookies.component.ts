import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {
  @Input() data: any;
  @Output() closeCookies = new EventEmitter<any>();

  privacyNoticeLink:string;
  language:string;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
    this.privacyNoticeLink = this.data.privacy;
    this.language = this.data.language;
  }

  agreeAndCloseDialog(){
    this.closeCookies.emit("agree");
  }
}
