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
  answerTooShort = false;
  noNumber = false;
  inputText:any="";

  constructor() {
  }

  ngOnInit() {
    console.log(this.answerType);
    console.log(this.optional);
  }

  callParent() {

    if (this.inputText !== null && this.inputText !== ""){
      return;
    }
    let textToSend = this.inputText.toString().trim();

    if(this.answerType=="email"){
      if(!this.validateEmail(textToSend)){
        this.invalidMail=true;
        return;
      }
    }
    
    this.sendAnswer.emit(textToSend);
    this.inputText = "";
    
  }

  skipQuestion() {
    this.sendAnswer.emit("skip");
  }

  edited() {
    
    this.invalidMail = false;

    if ((this.inputText === null || this.inputText === "") && this.answerType!="number") {
      this.showSkip = true;
    } else {
      if(this.answerType=="number" && (this.inputText<0 || this.inputText>100)){
        this.noNumber = true;
      } else {
        this.noNumber = false;
      }
      this.showSkip = false;
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