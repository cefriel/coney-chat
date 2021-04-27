import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ans-emoji-input',
  templateUrl: './ans-emoji.component.html'
})
export class AnsEmojiComponent implements OnInit {
  @Input() answersToDisplay: any;
  @Output() sendAnswer = new EventEmitter<any>();

  numberOfAnswers: number = 0;
  sendEnabled = false;
  selectedAnswer: any;
  size = "large";

  constructor() { }

  ngOnInit() {
    this.answersToDisplay.answers.sort((a, b) => (a.order > b.order) ? 1 : -1);
    this.numberOfAnswers = this.answersToDisplay.answers.length
  }

  setBtnStyle(event:HTMLElement){
    var items = document.getElementsByClassName("emoji-btn");
    for (var i = 0; i < items.length; i++) {
      var b: any; b = items[i].children[0];
      b.style.fontSize = "35px";
      b.style.marginTop = "0px";
    }

    var btn: any;
    btn = event;
    btn.style.fontSize = "45px";
    b.style.marginTop = "-10px";
  }

  emojiSelected($event, number){
    if(number == 0){
      this.selectedAnswer = this.answersToDisplay.answers[0];
      this.sendAnswers();
      return;
    }

    var index = 0;//where to get the answer

    if(number == 1 || number == 2){
      index = number-1;
    } else if(number == 3){
      if(this.numberOfAnswers == 3){
        index = 1;
      } else {
        index = 2;
      }
    } else if(number == 4){
      if(this.numberOfAnswers == 4){
        index = 2;
      } else {
        index = 3;
      }
    } else if(number == 5){
      index = this.numberOfAnswers-1;
    }

    this.selectedAnswer = this.answersToDisplay.answers[index];
    this.setBtnStyle($event.srcElement);
    this.sendEnabled = true;
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
