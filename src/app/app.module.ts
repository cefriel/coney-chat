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
import { PinchZoomModule } from 'ngx-pinch-zoom';

import { StartInterfaceComponent } from './start-interface/start-interface.component';
import { EndUiComponent } from './end-interface/end-interface.component';

import { ChatComponent } from './chat/chat.component';
import { ChatInputBoxComponent } from './chat/chat-input-box/chat-input-box.component';
import { ChatContentComponent } from './chat/chat-content/chat-content.component';
import { ChatSidePanelComponent } from './chat/chat-side-panel/chat-side-panel.component';
import { ChatNavbarComponent } from './chat/chat-navbar/chat-navbar.component';
import { RestartComponent } from './chat/restart-popup/restart-popup.component';

import { AnsCheckboxComponent } from './chat/chat-input-box/ans-checkbox/ans-checkbox.component';
import { AnsEmojiComponent } from './chat/chat-input-box/ans-emoji/ans-emoji.component';
import { AnsOptionComponent } from './chat/chat-input-box/ans-option/ans-option.component';
import { AnsStarComponent } from './chat/chat-input-box/ans-star/ans-star.component';
import { AnsSelectComponent } from './chat/chat-input-box/ans-select/ans-select.component';
import { AnsSlideComponent } from './chat/chat-input-box/ans-slide/ans-slide.component';
import { AnsOpenComponent } from './chat/chat-input-box/ans-open/ans-open.component';

import { BackendService } from './chat/chat.service';
import { HelperService } from './app.service';
import { SetupService } from './start-interface/start-interface.service';

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
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(it);

@NgModule({
  declarations: [
    AppComponent,
    StartInterfaceComponent,
    EndUiComponent,
    ChatComponent,
    ChatContentComponent,
    ChatInputBoxComponent,
    ChatSidePanelComponent,
    ChatNavbarComponent,
    AnsCheckboxComponent,
    AnsEmojiComponent,
    AnsOptionComponent,
    AnsStarComponent,
    AnsSelectComponent,
    AnsSlideComponent,
    AnsOpenComponent,
    RestartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFittextModule,
    PinchZoomModule,
    NzDividerModule,
    NzSpinModule,
    NzSelectModule,
    NzCheckboxModule,
    NzProgressModule,
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
