import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { it_IT } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';
import { AngularResizedEventModule } from 'angular-resize-event';
import { AngularFittextModule } from 'angular-fittext';

import { StartUiComponent } from './screens/start-ui/start-ui.component';
import { EndUiComponent } from './screens/end-ui/end-ui.component';
import { ChatUiComponent } from './screens/chat-ui/chat-ui.component';
import { RestartComponent } from './screens/restart-ui/restart-ui.component';

import { AnsCheckboxComponent } from './inputs/ans-checkbox/ans-checkbox.component';
import { AnsEmojiComponent } from './inputs/ans-emoji/ans-emoji.component';
import { AnsOptionComponent } from './inputs/ans-option/ans-option.component';
import { AnsStarComponent } from './inputs/ans-star/ans-star.component';
import { AnsSelectComponent } from './inputs/ans-select/ans-select.component';
import { AnsSlideComponent } from './inputs/ans-slide/ans-slide.component';
import { AnsOpenComponent } from './inputs/ans-open/ans-open.component';

import { CookiesComponent } from './cookies/cookies.component';
import { BackendService } from './service/backend.service';
import { HelperService } from './service/utils.service';
import { SetupService } from './service/setup.service';

import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(it);

@NgModule({
  declarations: [
    AppComponent,
    StartUiComponent,
    EndUiComponent,
    ChatUiComponent,
    AnsCheckboxComponent,
    AnsEmojiComponent,
    AnsOptionComponent,
    AnsStarComponent,
    AnsSelectComponent,
    AnsSlideComponent,
    AnsOpenComponent,
    CookiesComponent,
    RestartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFittextModule,
    NzDividerModule,
    NzSpinModule,
    NzSelectModule,
    NzCheckboxModule,
    NzSliderModule,
    NzRateModule,
    NzInputNumberModule,
    NzButtonModule,
    NzDatePickerModule,
    NzIconModule,
    NzModalModule,
    NzTimePickerModule,
    AngularResizedEventModule,
    RouterModule.forRoot([])
  ],
  providers: [
    BackendService,
    HelperService,
    SetupService,
    { provide: NZ_I18N, useValue: it_IT }],
  bootstrap: [AppComponent]
})
export class AppModule { }
