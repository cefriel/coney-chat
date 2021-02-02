import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { en_GB, NzI18nService } from 'ng-zorro-antd/i18n';
import format from 'date-fns/format';

@Component({
  selector: 'app-ans-open',
  templateUrl: './ans-open.component.html'
})
export class AnsOpenComponent implements OnInit {
  @Input() answersToDisplay: any;
  @Output() sendAnswer = new EventEmitter<any>();

  constructor(private i18n: NzI18nService) {
    this.i18n.setLocale(en_GB);
   }

  openAnswer: any;

  openAnswerDate: Date; 

  answerType = "";
  optional = 0;
  skipVisible = false;
  sendEnabled = false;
  invalidMail = false;
  invalidTime = false;
  answerTooShort = false;

  ngOnInit() {
    
    this.answerType = this.answersToDisplay.visualization;
    this.optional = this.answersToDisplay.answers[0].optional;

    if (this.optional == 1) {
      this.skipVisible = true;
    }
  }

  inputChange($event) {
    if ($event.srcElement.scrollHeight < 160) {
      $event.srcElement.style.height = 'auto';
      $event.srcElement.style.height = ($event.srcElement.scrollHeight) + 'px';
    }
  }

  /**
   * optional = 1 -> skippable question
   * optional = 0 -> mandatory question
   * @param $event input from the various methods
   */
  valueChanged($event) {

    if ($event == undefined || $event == '') {
      if (this.optional == 0) {
        this.skipVisible = false;
      } else if (this.optional == 1) {
        this.skipVisible = true;
      }

      if($event != 0){
        this.sendEnabled=false;
        this.openAnswer = '';
      } else if(this.answerType=="number") {
        this.sendEnabled = true;
        this.openAnswer = 0;
      }
      

    } else {
      if(this.answerType == "date"){
        this.openAnswer = format($event, "dd/MM/yyyy");
      } else { 
        this.openAnswer = $event.toString();
     }

      this.answerTooShort = false;
      this.invalidMail = false;
      this.invalidTime = false;

      if (this.optional == 0) {
        this.skipVisible = false;
      } else if (this.optional == 1) {
        this.skipVisible = true;
        this.sendEnabled=true;
      }

      if ((this.answerType == "text" && this.openAnswer.length > 1)
        || (this.answerType == "date" && this.openAnswer.length > 5)
        || (this.answerType == "number")
        || (this.answerType == "url" && this.openAnswer.length > 1)) {
        this.sendEnabled = true;
      } else {
        this.answerTooShort = true;
      }
    }

    if (this.answerType == "email") {
      if (!this.validateEmail(this.openAnswer)) {
        this.invalidMail = true;
        this.sendEnabled = false;
      } else {
        this.sendEnabled = true;
      }
    }

    if (this.answerType == "time") {
      if (!this.validateTime(this.openAnswer)) {
        this.invalidTime = true;
        this.sendEnabled = false;
      } else {
        this.sendEnabled = true;
      }
    }
  }

  /**
   * @param content the boolean is false when the user presses skip
   */
  sendAnswers(content: boolean) {
    if (!content || this.openAnswer == undefined) {
      this.openAnswer = "skip";
    }

    this.sendAnswer.emit({
      type: "open",
      visualization: this.answerType,
      block: this.openAnswer.toString().trim(),
      blockId: this.answersToDisplay.questionId,
      toSend: this.openAnswer.toString().trim(),
      text: this.openAnswer.toString().trim() //value to be displayed
    });
  }


  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateTime(time){
    var re = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ ;
    return re.test(String(time).toLowerCase());
  }
}
