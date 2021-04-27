import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'chat-navbar',
    templateUrl: './chat-navbar.component.html',
    styleUrls: ['./chat-navbar.component.scss']
})
export class ChatNavbarComponent {
    @Input() compilation: any | undefined;
    @Input() surveyProgress: any | undefined;
    @Input() undoEnabled: boolean | undefined;
    @Input() messageLoading: boolean | undefined;
    @Output() undoLastAnswer: EventEmitter<any> = new EventEmitter();

}

