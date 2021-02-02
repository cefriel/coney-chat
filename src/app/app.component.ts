import { Component, OnChanges, OnInit } from '@angular/core';
import { Params, ActivatedRoute, ActivationEnd, Router, NavigationEnd } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { BackendService } from './service/backend.service';
import { HelperService } from './service/utils.service';
import { SetupService } from './service/setup.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

/*
This is the component that starts the process
1) Check the link and get the metadata
2) Get the details of the conversation
3) Open the start screen
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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

  constructor(private backend: BackendService,
    private convService: SetupService,
    private cookieService: CookieService) {
    this.loading = true;


  }

  ngOnInit() {

    if (this.cookieService.get('cco') === "true") {
      this.hideBanner(undefined);
    }

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



  cookieReadMorePressed() {
    /* console.log(this.languageValue);
     const dialogRef = this.dialog.open(CookieConsentComponent, {
       width: '400px',
       maxHeight: '90vh',
       data: {
         lang: this.languageValue.tag
       }
     });
     dialogRef.afterClosed().subscribe(res => {
       if (res != undefined && res == "agree") {
         this.cookieService.set('cco', "true");
         this.hideBanner(undefined);
       }
     });*/
  }

  hideBanner(type: any) {

    this.cookies = false;

    if (type != undefined) {
      this.cookieService.set('cco', "true");
    }
  }
}
