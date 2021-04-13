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
  maxMinDisplayed = false;
  sendEnabled = false;

  min = 0;
  max = 0;

  currentValue = 0;
  constructor() { }

  ngOnInit() {

    this.disabled = false;
    this.sendEnabled = false;
    this.maxMinDisplayed = false;
  
    this.min = 0;
    this.max = 0;
  
    this.currentValue = 0;
    this.max = Math.max.apply(Math, this.answersToDisplay.answers.map(function(o) { return o.order; }));
    this.min = Math.min.apply(Math, this.answersToDisplay.answers.map(function(o) { return o.order; }));
    this.currentValue = this.answersToDisplay.answers.length/2 + 0.5; 
    console.log(this.answersToDisplay);

    this.answersToDisplay.answers.sort((a, b) => (a.order > b.order) ? 1 : -1);

    if(this.answersToDisplay.answers[0] && this.answersToDisplay.answers[0].text !='' 
    && this.answersToDisplay.answers[this.answersToDisplay.answers.length-1].text !='' 
    && this.answersToDisplay.answers[1].text ==''){
      this.maxMinDisplayed = true;
    }

  }

  valueChanged(){
    let index = this.answersToDisplay.answers.findIndex(x => x.order == this.currentValue);
    if(index!=-1){
      this.sendEnabled = true;
      this.selectedAnswer = this.answersToDisplay.answers[index];
    }
  }

  sendAnswers() {

    let valueToBeDisplayed = this.selectedAnswer.order + "/" + this.answersToDisplay.answers.length;
    if(this.selectedAnswer.text != ''){
      valueToBeDisplayed = this.selectedAnswer.text;
    }
    this.sendAnswer.emit({
      type: "multiple",
      visualization: "option",
      block: this.selectedAnswer,
      blockId: this.answersToDisplay.questionId,
      toSend: this.selectedAnswer.order,
      text: valueToBeDisplayed //value to be displayed
    });
  }
}
