import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HelperService } from 'src/app/app.service';

@Component({
  selector: 'start-interface',
  templateUrl: './start-interface.component.html',
  styleUrls: ['./start-interface.component.scss']
})
export class StartInterfaceComponent implements OnInit {
  @Input() setup: any;
  @Output() startSurvey = new EventEmitter<any>();

  
  selectedLanguage: any;
  chatTranslatedText:any;

  

  constructor(private utils: HelperService,
    private titleService: Title) { }


  ngOnInit(){

    this.titleService.setTitle(this.setup.title);
    if(this.setup.languages!=undefined && this.setup.languages!=""){
      this.selectedLanguage = this.setup.languages[0];  
      this.chatTranslatedText = this.utils.getStringTranslation(this.selectedLanguage.tag);
      this.titleService.setTitle(this.selectedLanguage.title);
    }
    

    if(this.selectedLanguage.introText !=undefined && this.selectedLanguage.introText != ""){
      this.chatTranslatedText.introText = this.selectedLanguage.introText;
    } else if (this.setup.introText!=undefined) {
      this.chatTranslatedText.introText = this.setup.introText;
    } 


    if(this.selectedLanguage.privacyLink !=undefined && this.selectedLanguage.privacyLink != ""){
      this.chatTranslatedText.privacyLink = this.selectedLanguage.privacyLink;
    } else if(this.setup.privacyLink!=undefined || this.setup.privacyLink!=""){
      this.chatTranslatedText.privacyLink = this.setup.privacyLink;
    }
    
    if(this.setup.logo==undefined){
      this.setup.logo = "./assets/icons/ic_logo.svg";
    }

    if(this.chatTranslatedText.privacyLink == undefined || this.chatTranslatedText.privacyLink == ""){
      this.chatTranslatedText.privacyLink = "https://www.cefriel.com/en/privacy";
    }
    if(this.chatTranslatedText.title == undefined || this.chatTranslatedText.title == ""){
      this.chatTranslatedText.title = this.titleService.getTitle();
    }
    if(this.chatTranslatedText.introText == undefined || this.chatTranslatedText.introText == ""){
      this.chatTranslatedText.introText = this.utils.getStringTranslation(this.selectedLanguage.tag).introText;
    }
  }

  startPressed(){
    this.startSurvey.emit(this.selectedLanguage);
  }
 

  setButtonsLanguage(){
    this.chatTranslatedText = this.utils.getStringTranslation(this.selectedLanguage.tag);
    
    if(this.selectedLanguage.introText!=""){
      this.chatTranslatedText.introText = this.selectedLanguage.introText;
    }
    if(this.selectedLanguage.privacyLink!=""){
      this.chatTranslatedText.privacyLink = this.selectedLanguage.privacyLink;
    }
    
    this.titleService.setTitle(this.selectedLanguage.title);
  }



}
