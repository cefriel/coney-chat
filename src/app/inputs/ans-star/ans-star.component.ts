import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ans-star',
  templateUrl: './ans-star.component.html'
})
export class AnsStarComponent implements OnInit {
  @Input() answersToDisplay: any;
  @Output() sendAnswer = new EventEmitter<any>();
  
  size: any;
  value: any;

  selectedAnswer: any = undefined;
  sendEnabled = false;

  constructor() { }

  ngOnInit() {
    this.size = this.answersToDisplay.answers.length;
  }

  valueChanged($event){
    let index = this.answersToDisplay.answers.findIndex(x => x.order = $event);
    if(index != -1){
      this.sendEnabled = true;
      this.value = $event;
      this.selectedAnswer = this.answersToDisplay.answers[index];
    } else {
      this.sendEnabled = false;
    }
  }

  sendAnswers() {

    this.sendAnswer.emit({
      type: "multiple",
      visualization: "star",
      block: this.selectedAnswer,
      blockId: this.answersToDisplay.questionId,
      toSend: this.selectedAnswer.order,
      text: this.value + "/" + this.size //value to be displayed
    });
  }
}
