import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-answer-text',
  templateUrl: './answer-text.component.html',
  styleUrls: ['./answer-text.component.css']
})
export class AnswerTextComponent implements OnInit {

  @Output() sendAnswer = new EventEmitter<string>();
  @Input() answerType: string;

  showSkip = true;
  showSend = false;
  inputText="";

  constructor() {
  }

  ngOnInit() {
    console.log(this.answerType);
  }

  callParent() {
    if (this.inputText != "" && this.inputText.length > 5) {
      this.inputText.toString().trim();
      this.sendAnswer.emit(this.inputText.toString());
      this.inputText = "";
    }
  }

  skipQuestion() {
    this.sendAnswer.emit("skip");
  }

  edited() {
    
    if (this.inputText == "") {
      this.showSkip = true;
    } else {
      this.showSkip = false;
    }
    /*
   if (this.inputText.length > 5) {
    this.showSend = true;
  } else {
    this.showSend = false;
  }*/

  }

}