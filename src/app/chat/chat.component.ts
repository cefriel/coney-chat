import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { BackendService } from 'src/app/chat/chat.service';
import { CookieService } from 'ngx-cookie-service';
import { HelperService } from 'src/app/app.service';
import { AnswersToDisplay, ChatMessage } from './chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger(
      'inputAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(40%)', opacity: 0 }),
        animate('200ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('100ms ease-out', style({ opacity: 0 }))
      ])
    ]
    )
  ],
})
export class ChatComponent implements OnInit {
  @Input() compilation: any;
  @Output() conversationFinished = new EventEmitter<any>();
  @ViewChild('scrollDiv', { static: false }) private scrollContainer: ElementRef;
  @ViewChild('messagesList', { static: false }) private messagesList: ElementRef;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  loading = false;
  messageLoading = false;

  continueWithDifferentConversation = false;
  recreatingConv = false; //defaults the delay to 20
  conversationOver: boolean = false;

  oldAnswer: any = undefined; //keep track of the previous answer for "undo" purpose
  undoEnabled: boolean = false;

  restartSession = "";
  showRestart = false;
  disableScrollDown = false;

  displayedMessages: ChatMessage[] = [];

  surveyProgress = 0;
  currentDepth = 0;

  postData: JSON = JSON.parse("{}");

  deviceWidth;

  errorMessage = "";

  chatTranslatedText: any;

  answersToDisplay: AnswersToDisplay = {
    subtype: "",
    visualization: "",
    questionId: 0,
    answers: []
  }


  constructor(private backend: BackendService,
    private cookieService: CookieService,
    private utils: HelperService) { }

  ngOnInit() {
    this.chatTranslatedText = this.utils.getStringTranslation(this.compilation.language.tag);
    this.deviceWidth = window.innerWidth;
    this.getConversation();
  }



  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.deviceWidth = window.innerWidth;
  }

  /**************** Messages logic methods ****************/

  /**
   * Get the initial conversation data and the first set of blocks to be published
   */
  getConversation() {

    if (this.compilation.userId == 'preview') {
      this.compilation.restart = 1;
    }

    this.backend.getConversationRequest(this.compilation).subscribe(res => {
      this.errorMessage = "";
      const json = JSON.parse(res);

      if (json["re-session"] != undefined && this.compilation.userId != "preview") {
        this.compilation.restartSession = json["re-session"];
        // GO TO RESTART 
        this.showRestart = true;
        return;
      } else if (this.compilation.restart == 2) {
        // REGENERATE CONVERSATION 
        this.recreatingConv = true;
      }

      var conversationJson = json["conversation"];
      this.compilation.convId = conversationJson["conversationId"];
      this.compilation.originalTitle = conversationJson["title"];
      this.compilation.chatLength = conversationJson["chatLength"];

      parent.postMessage(conversationJson["title"], "*");

      parent.postMessage(this.compilation.language.title, "*");

      this.compilation.userId = json["userId"];

      // sets the cookie
      this.cookieService.set('userId', json["userId"]);


      this.compilation.sessionId = json["session"];
      this.compilation.blocks = json["blocks"];


      this.messageLoading = true;

      //start displaying messages
      this.publishMessages(this.compilation.blocks);

    }, err => {
      console.error(err);
      if (err.status == 405) {
        this.errorMessage = this.chatTranslatedText.surveyAlreadyCompetedText;
      } else {
        if (this.compilation.userId == "preview") {
          this.errorMessage = "No preview available for this survey";
        } else {
          this.errorMessage = "Error";
        }
      }
      console.error(this.errorMessage);
    });

  }

  /**
   * @param messages 
   */
  continueConversation(undo: boolean, answer: any) {

    if (!undo) {

      this.postData["userId"] = this.compilation.userId;
      this.postData["session"] = this.compilation.sessionId;
      this.postData["conversationId"] = this.compilation.convId;
      this.postData["answerType"] = answer.type;
      this.postData["blockId"] = answer.blockId;
      this.postData["redo"] = "false";
      this.postData["lang"] = this.compilation.language.tag;

      this.postData["answer"] = answer.toSend;

    } else {
      this.postData["redo"] = "true";
    }

    let endpoint = '/chat/continueConversation';
    this.backend.postRequest(endpoint, this.postData).subscribe(json => {
      var blocksJsonArray = json["blocks"];
      this.publishMessages(blocksJsonArray);
    }, err => {
      //TODO
    });
  }



  /**************** Message display methods ****************/

  /**
   * @param messages array of messages to be displayed
   * Gradually parses messages and passes them to the display method
   */
  async publishMessages(messages: any) {
    for (var k = 0; k < messages.length; k++) {

      var block: any = messages[k];


      //gets the convId of the next conversation and starts it without finishing the previous
      //*********************TODO Logic block
      if (block["link"] != undefined && block["link"].includes("continue:")) {
        this.compilation.convId = block["link"].substr(9, block["link"].length);
        this.compilation.restart = 0;
        this.compilation.restartSession = "continue_" + this.compilation.sessionId;
        this.compilation.continueWithDifferentConversation = true;
        this.continueWithDifferentConversation = true;
        this.getConversation();
        return;
      }

      //postMessage 
      //**********************TODO Logic block
      if (block["link"] != undefined && block["link"].startsWith("_")) {
        parent.postMessage(block["link"].link, "*");
        continue;
      }

      //conversationi is over
      if (block["type"] == "end") {

        this.messageLoading = false;
        parent.postMessage("_survey_ended", "*");
        this.surveyProgress = 100;
        this.conversationOver = true;

        return;
      }


      await this.displayMessage(block, "auto");
      if (block["type"] == "Question" && messages[k + 1]["type"] != "AnswerCont") {
        this.answersToDisplay.subtype = block["subtype"];
        this.answersToDisplay.questionId = block["blockId"];
        this.answersToDisplay.visualization = block["visualization"];
        if (this.answersToDisplay.subtype == "checkbox") {
          this.answersToDisplay.visualization = "checkbox";
        }
        k++;
        for (k; k < messages.length; k++) {
          this.answersToDisplay.answers.push(messages[k]);
        }
        this.messageLoading = false;
        this.recreatingConv = false;
      }
    }
  }

  /**
   * @param message the single block it needs to publish
   * calculates the delay and publishes the message
   */
  async displayMessage(message: any, delayType: string) {

    let text = message["text"];
    this.disableScrollDown = false;
    
    
    //setup delay
    let delay = 200;
    let numberOfWord = 0;

    if (text != null) {
      if (delayType == "auto") {
        numberOfWord = text.split(' ').length;
        delay = 80 * numberOfWord + 150;
      } else if (delayType == "quick") {
        numberOfWord = text.split(' ').length;
        delay = 40 * numberOfWord + 150;
      } else if (delayType == "long") {
        numberOfWord = text.split(' ').length;
        delay = 120 * numberOfWord + 150;
      }
    }
    if (this.recreatingConv) { delay = 20; }


    //setup progress
    if (message["type"] == "Question") {
      if (this.currentDepth < message["depth"]) {
        this.currentDepth = message["depth"];
      }
    }
    if (message["type"] == "AnswerCont") {
      this.surveyProgress = Math.round(100 / this.compilation.chatLength * this.currentDepth);
      if (this.surveyProgress == 100) {
        this.surveyProgress--;
      }
    }

    let textToDisplay = message["text"];
    if(textToDisplay == ""){
      textToDisplay = message["value"]+"";
    }
    let msg: ChatMessage = {
      text : textToDisplay,
      imageUrl : message["imageUrl"],
      subtype : message["subtype"],
      type : message["type"],
      url : message["url"],
      visualization : undefined
    };
    await this.utils.delay(delay);
    this.displayedMessages.push(msg);
  }


  /**
   * Method called by the "input" component
   * @param $event {blockId: number, type: string, text: string, toSend: any, visualization: string, block: full block from API}
   */
  sendAnswer($event) {
    this.undoEnabled = true;

    //push new answer
    let ans: ChatMessage = {
      type : "Answer",
      subtype : $event.subtype,
      visualization : $event.visualization,
      text : $event.text,
      imageUrl: undefined,
      url: undefined
    }
    
    this.displayedMessages.push(ans)
    
    this.disableScrollDown = false;
    //answer input reset
    this.answersToDisplay = {
      subtype: "",
      visualization: "",
      questionId: 0,
      answers: []
    }

    this.surveyProgress = Math.round(100 / this.compilation.chatLength * this.currentDepth);
    if (this.surveyProgress == 100) {
      this.surveyProgress--;
    }

    parent.postMessage({
      type: "answer",
      questionId: $event.blockId,
      sentAnswer: $event.toSend,
      textAnswer: $event.text
    }, "*");

    this.oldAnswer = $event;

    this.messageLoading = true;
    //send to api and move on
    this.continueConversation(false, $event);
  }

  /**
   * Deletes all the array elements after the last answer given (ans included) and 
   * calls the "continueConversation" method with the previous answer
   * */
  undoLastAnswer() {
    this.undoEnabled = false;
    this.recreatingConv = true;
    this.conversationOver = false;

    var ansCount = false;
    var delQ = false;

    for(let i = (this.displayedMessages.length-1); i>=0; i--){
      if(delQ){
        break;
      }
      
      //iterate till you reach answers and than stop at the question
      if(this.displayedMessages[i].type=="Answer"){
        ansCount = true;
      }
      if (this.displayedMessages[i].type == "Question" && ansCount) {
        delQ = true;
      } 
      this.displayedMessages.pop();
    }

    //answer input reset
    this.answersToDisplay = {
      subtype: "",
      visualization: "",
      questionId: 0,
      answers: []
    }

  
    this.continueConversation(true, this.oldAnswer);
  }

  /**
   * When the restart screen is closed this method is invoked to continue or restart the survey
   */
  restartChoice($event: any) {

    if ($event == "continue") {
      this.compilation.restart = 2;
      this.getConversation();
    } else if ($event == "restart") {
      //start displaying messages
      this.compilation.restart = 1;
      this.getConversation();
    }

    this.showRestart = false;
  }

  //close chat
  closeConversation() {
    this.conversationFinished.emit(true);
  }
}
