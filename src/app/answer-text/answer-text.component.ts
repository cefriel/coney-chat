import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-answer-text',
  templateUrl: './answer-text.component.html',
  styleUrls: ['./answer-text.component.css']
})
export class AnswerTextComponent implements OnInit {

  @Output() sendAnswer = new EventEmitter<string>();
  @Input() answerType: string;
  @Input() optional: number;

  showSkip = true;
  showSend = false;
  invalidMail = false;
  inputText="";

  constructor() {
  }

  ngOnInit() {
    console.log(this.answerType);
    console.log(this.optional);
  }

  callParent() {

    let textToSend = this.inputText.toString().trim();

    if(this.answerType=="email"){
      if(!this.validateEmail(textToSend)){
        this.invalidMail=true;
        return;
      }
    }
    console.log(textToSend);
    if (textToSend != ""){// && this.inputText.length > 5) {
      this.sendAnswer.emit(textToSend);
      this.inputText = "";
    }
  }

  skipQuestion() {
    this.sendAnswer.emit("skip");
  }

  edited() {
    this.invalidMail = false;

    if (this.inputText == "") {
      this.showSkip = true;
    } else {
      this.showSkip = false;
    }
    
    if (this.inputText.length > 5) {
      this.showSend = true;
    } else {
      this.showSend = false;
    }
  }

  resize(event){
    event.srcElement.style.height = "1px";
    event.srcElement.style.height = (10+event.srcElement.scrollHeight)+"px";
  }


  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}