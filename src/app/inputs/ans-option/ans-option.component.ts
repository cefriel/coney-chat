import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ans-option',
  templateUrl: './ans-option.component.html'
})
export class AnsOptionComponent implements OnInit {
  @Input() answersToDisplay: any;
  @Output() sendAnswer = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.answersToDisplay.answers.sort((a, b) => (a.order > b.order) ? 1 : -1);
  }

  answerChosen(answer){
    this.sendAnswer.emit({
      type: "multiple",
      visualization: "option",
      block: answer,
      blockId: this.answersToDisplay.questionId,
      toSend: answer.order,
      text: answer.text //value to be displayed
    });
  }
}

