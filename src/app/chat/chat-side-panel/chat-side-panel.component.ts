import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'chat-side-panel',
    templateUrl: './chat-side-panel.component.html',
    styleUrls: ['./chat-side-panel.component.scss']
})
export class ChatSidePanelComponent {
    @Input() compilation: any | undefined;
    @Input() surveyProgress: any | undefined;
}

