import { Component, OnChanges, OnInit } from '@angular/core';
import { Params, ActivatedRoute, ActivationEnd, Router, NavigationEnd } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { BackendService } from './chat/chat.service';
import { HelperService } from './app.service';
import { SetupService } from './start-interface/start-interface.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';

/*
This is the component that starts the process
1) Check the link and get the metadata
2) Get the details of the conversation
3) Open the start screen
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('100ms ease-out', style({ opacity: 0 }))
      ])
    ]
    )
  ]
})
export class AppComponent implements OnInit {

  title = 'coney-chat';

  loading: boolean = true;

  step = 0;
  error = "";
  errorCount = 0;

  setup: any = undefined;
  compilation: any = {};

  //cookies consent is not required at this moment by the GDPR since we only store technical cookies.
  cookies = false;

  constructor(
    private convService: SetupService,
    private cookieService: CookieService) {
    this.loading = true;


  }

  ngOnInit() {

    this.error = "";
    this.convService.checkQueryParams();

    this.setup = this.convService.conversation$.subscribe(

      res => {
        if (res.ready) {
          this.unsubscribeFromService();
          this.setup = res;
          this.loading = false;
          this.step = 1;

          this.convService.conversation$.unsubscribe();
        } else {
          this.error = res.error;
        }
      }, err => {
        console.log(err);
      }
    );
  }

  unsubscribeFromService() {
    this.setup.unsubscribe();
  }

  startSurvey(language: any) {
    this.compilation = {
      language: language,
      userId: this.setup.userId,
      convId: this.setup.convId,
      meta1: this.setup.meta1,
      meta2: this.setup.meta2,
      noRepeat: this.setup.noRepeat,
      logo: this.setup.logo,
      title: this.setup.title,
      restart: 0,
      restartSession: "",
      continueWithDifferentConversation: false,
    }
    this.step = 2;

  }

  endSurvey($event) {
    this.step = 3;
  }

}
