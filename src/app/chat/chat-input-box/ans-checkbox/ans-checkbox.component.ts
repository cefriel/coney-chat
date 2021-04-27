import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ans-checkbox-input',
  templateUrl: './ans-checkbox.component.html'
})
export class AnsCheckboxComponent implements OnInit {
  @Input() answersToDisplay: any;
  @Input() maxAnswersText: any;
  @Output() sendAnswer = new EventEmitter<any>();
  
  checked = true;
  toReturn: any = undefined;
  answerList = [];
  disabled = false;
  openAnswer = "";
  maxAnswers: number = 0;
  sendEnabled = false;
  maxReached = false;

  constructor() { }

  /**
   * prepares the answers array
   */
  ngOnInit() {
    this.answersToDisplay.answers.sort((a, b) => (a.order > b.order) ? 1 : -1);
    for(var i = 0; i<this.answersToDisplay.answers.length; i++){
      this.answerList.push(
        {
          type: this.answersToDisplay.answers[i].checkboxType,
          order: this.answersToDisplay.answers[i].order,
          text: this.answersToDisplay.answers[i].text,
          checked: false
        }
      );
      this.maxAnswers = this.answersToDisplay.answers[i].maxAnswers;
    }
    this.maxAnswersText = this.maxAnswersText.replace("**", ""+this.maxAnswers);
  }

  /**
   * triggers on cb change detection
   * @param type string, can be 'normal', 'none', 'other' depending on the cb pressed
   * @param index number: index of the cb pressed
   */
  updateAllChecked(type: string, index: number){
    //it none is checked, disable the rest
    if(type == "none"){
      this.disabled = !this.disabled;
    }

    //count the total selected
    let total = 0;
    for(var i = 0; i<this.answerList.length; i++){
      if(this.answerList[i].checked){total++;}
    }
    
    if(type == "none"){
      this.sendEnabled = false;
      if(this.disabled || total>0){
        this.sendEnabled = true;
      } 
      return;
    }

    this.maxReached = false;
    //deselect if a max is set and it exceeds it
    if(this.maxAnswers!=0 && total==this.maxAnswers){
     // this.answerList[index].checked = false;
     this.maxReached = true;
    }

    //no checked
    this.sendEnabled = true;
    var noAnswers = this.answerList.findIndex(x => x.checked == true);
    if(noAnswers == -1){
      this.sendEnabled = false;
    }
  }

  /**
   * parses and sends the answers back to chat-ui component
   */
  sendAnswers(){
    let answersToSend = [];
    let textToDisplay = "";
    let first = true;

    //if none is selected, selects only that one
    if(this.disabled){
      var index = this.answerList.findIndex(x => x.type == "none");
      answersToSend.push({
        type: this.answerList[index].checkboxType,
        order: this.answerList[index].order,
        text: this.answerList[index].text
      });

      textToDisplay = this.answerList[index].text;

      //finds the selected ones
    } else {
      for(var i = 0; i<this.answerList.length; i++){
        if(this.answerList[i].checked){

          //add the open input value
          if(this.answerList[i].type == "other"){
            if(this.openAnswer != ""){
              this.answerList[i].text = this.openAnswer;
            }
          }

          //add the answer to the array to be returned
          answersToSend.push(
            {
              type: this.answerList[i].type,
              order: this.answerList[i].order,
              text: this.answerList[i].text
            }
          );
            
          //sets the text 
          if(first){
            textToDisplay += "<ul><li>"+this.answerList[i].text;
            first = false;
            continue;
          }
          textToDisplay += "</li><li>" + this.answerList[i].text;
        }
      }
      textToDisplay +="</li></ul>"
    }

    

    this.sendAnswer.emit({
      type: "checkbox",
      visualization: "checkbox",
      block: undefined,
      blockId: this.answersToDisplay.questionId,
      toSend: answersToSend,
      text: textToDisplay
    });

    
  }

}
