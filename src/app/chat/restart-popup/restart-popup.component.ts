import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelperService } from 'src/app/app.service';

@Component({
  selector: 'restart-popup',
  templateUrl: './restart-popup.component.html'
})
export class RestartComponent implements OnInit {
  @Input() language: any;
  @Output() restartChoice = new EventEmitter<any>();
  
  constructor(private utils: HelperService) { }

  strings: any;
  restart = "Restart";
  continue = "Continue";
  text = "It looks like we were already having this conversation...";


  ngOnInit(): void {
    this.strings = this.utils.getStringTranslation(this.language);

    if(this.strings!=undefined){
      this.text = this.strings.doneConversation;
      this.continue = this.strings.continueButtonText;
      this.restart = this.strings.restartButtonText;
    }
    
  }

  buttonPressed(type: string){
    this.restartChoice.emit(type);
  }

}
