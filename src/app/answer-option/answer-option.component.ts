import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-answer-option',
  templateUrl: './answer-option.component.html',
  styleUrls: ['./answer-option.component.css']
})
export class AnswerOptionComponent implements OnInit, AfterViewInit{

  @Input() answers: [{ value: number, text: string }];
  @Input() numberOfAnswers: number;
  @Output() sendAnswer = new EventEmitter<any>();


  response = { value: 0, text: "" };
  length = 0;
  fits;

  constructor() {
  }

  ngOnInit(){
    this.length = this.answers.length;
  }

  ngAfterViewInit(){

  }

  callParent(answer: any) {
    if (answer != undefined) {
      
      this.response.value = answer.value;
      this.response.text = answer.text;
  
      this.sendAnswer.emit(this.response);
    }
  }
}