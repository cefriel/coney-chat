import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ans-select',
  templateUrl: './ans-select.component.html'
})
export class AnsSelectComponent implements OnInit {
  @Input() answersToDisplay: any;
  @Output() sendAnswer = new EventEmitter<any>();
  
  selectedAnswer: any = undefined;
  sendEnabled = false;

  constructor() { }

  ngOnInit() {
    this.answersToDisplay.answers.sort((a, b) => (a.order > b.order) ? 1 : -1);
  }

  sendAnswers() {
    this.sendAnswer.emit({
      type: "multiple",
      visualization: "option",
      block: this.selectedAnswer,
      blockId: this.answersToDisplay.questionId,
      toSend: this.selectedAnswer.order,
      text: this.selectedAnswer.text //value to be displayed
    });
  }
}
