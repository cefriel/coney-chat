import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { HelperService } from 'src/app/app.service';

@Component({
    selector: 'chat-input-box',
    templateUrl: './chat-input-box.component.html',
    styleUrls: ['./chat-input-box.component.scss'],
    animations: [
        trigger(
          'inputAnimation', [
          transition(':enter', [
            style({ transform: 'translateY(40%)', opacity: 0 }),
            animate('200ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
          ]),
          transition(':leave', [
            style({ opacity: 1 }),
            animate('100ms ease-out', style({ opacity: 0 }))
          ])
        ]
        )
      ],
})
export class ChatInputBoxComponent {
    @Input() answersToDisplay: any | undefined;
    @Input() conversationOver: boolean | undefined;
    @Input() language: string | undefined;
    @Output() sendAnswer: EventEmitter<any> = new EventEmitter();
    @Output() closeConversation: EventEmitter<any> = new EventEmitter();

    chatTranslatedText: any;
    maxAnswersText: string = "Max ** answers";

    constructor(private utils: HelperService){

    }

    ngOnInit(): void {
      this.chatTranslatedText = this.utils.getStringTranslation(this.language);
      if(this.chatTranslatedText){
        this.maxAnswersText = this.chatTranslatedText.maxAnswers;
      }
    }
}

