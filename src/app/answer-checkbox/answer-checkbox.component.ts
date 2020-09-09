import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-answer-checkbox',
  templateUrl: './answer-checkbox.component.html',
  styleUrls: ['./answer-checkbox.component.css']
})
export class AnswerCheckboxComponent implements OnInit {

  @Input() answers: [{ value: number, text: string, type: string }];
  @Output() sendAnswer = new EventEmitter<any>();

  values: any;
  valueFormGroup: FormGroup;
  selected: any;
  answerList = [];
  last: any = {};
  disabled = false;

  otherChecked = false;
  otherAnswer = "";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    console.log(this.answers);
    this.answers.sort((a, b) => (a.value > b.value) ? 1 : -1);

    for (var i = 0; i < this.answers.length; i++) {
      if (this.answers[i].type == "none") {
        this.last = this.answers[i];
      } else {
        this.answerList.push(this.answers[i]);
      }
    }
    if (this.last.text != undefined) {
      this.answerList.push(this.last);
    }

    this.answerList = this.answers;
    this.valueFormGroup = this.formBuilder.group({
      answerList: this.formBuilder.array([])
    });
  }


  onChange(event, dis, other) {
    const values = <FormArray>this.valueFormGroup.get('answerList') as FormArray;

    if (dis && !this.disabled) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }

    if (other) {
      this.change();
    }

    if (event.checked) {
      values.push(new FormControl(event.source.value))
    } else {
      const i = values.controls.findIndex(x => x.value === event.source.value);
      values.removeAt(i);
    }

    console.log(values);
  }

  callParent() {

    console.log(this.otherChecked);
    console.log(this.otherAnswer);
    var answers: any;
    if (this.disabled == true) {
      var disabledResult = [this.last];
      this.sendAnswer.emit(disabledResult);
    } else if (this.valueFormGroup.value.answerList.length != 0) {

      answers = this.valueFormGroup.value.answerList;

      if (this.otherChecked) {
        const i = this.valueFormGroup.value.answerList.findIndex(x => x.type === "other");
        if (i >= 0 && this.otherAnswer != "") {
          answers[i].text = this.otherAnswer;
        }
      }
      console.log(answers)
      this.sendAnswer.emit(this.valueFormGroup.value.answerList);
    }

  }

  change() {
    if (this.otherChecked == true) {
      this.otherChecked = false;
    } else {
      this.otherChecked = true;
    }
  }

}
