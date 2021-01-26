import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ans-slide',
  templateUrl: './ans-slide.component.html'
})
export class AnsSlideComponent implements OnInit {
  @Input() answersToDisplay: any;
  @Output() sendAnswer = new EventEmitter<any>();

  selectedAnswer: any;

  disabled = false;
  sendEnabled = false;

  min = 0;
  max = 0;

  currentValue = 0;
  constructor() { }

  ngOnInit() {

    this.disabled = false;
    this.sendEnabled = false;
  
    this.min = 0;
    this.max = 0;
  
    this.currentValue = 0;
    console.log(this.answersToDisplay);
    this.max = Math.max.apply(Math, this.answersToDisplay.answers.map(function(o) { return o.order; }));
    this.min = Math.min.apply(Math, this.answersToDisplay.answers.map(function(o) { return o.order; }));
    this.currentValue = this.answersToDisplay.answers.length/2 + 0.5; 

  }

  valueChanged(){
    let index = this.answersToDisplay.answers.findIndex(x => x.order == this.currentValue);
    if(index!=-1){
      this.sendEnabled = true;
      this.selectedAnswer = this.answersToDisplay.answers[index];
    }
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
