import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { BackendService } from 'src/app/service/backend.service';
import { CookieService } from 'ngx-cookie-service';
import { HelperService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.css'],
  animations: [
    trigger(
      'inputAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('200ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('100ms ease-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]
    )
  ],
})
export class ChatUiComponent implements OnInit {
  @Input() compilation: any;
  @Output() conversationFinished = new EventEmitter<any>();
  @ViewChild('scrollDiv', { static: false }) private scrollContainer: ElementRef;
  @ViewChild('messagesList', { static: false }) private messagesList: ElementRef;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  loading = false;
  messageLoading = false;

  isPicModalVisible = false;
  openPicture = "";

  continueWithDifferentConversation = false;
  recreatingConv = false; //defaults the delay to 20
  conversationOver: boolean = false;

  oldAnswer: any = undefined; //keep track of the previous answer for "undo" purpose
  undoEnabled: boolean = false;

  restartSession = "";
  showRestart = false;
  disableScrollDown = false

  postData: JSON = JSON.parse("{}");

  errorMessage = "";

  chatTranslatedText: any;

  answersToDisplay: any = {
    subtype: "",
    visualization: "",
    questionId: 0,
    answers: []
  }


  constructor(private backend: BackendService,
    private cookieService: CookieService,
    private utils: HelperService) { }

  ngOnInit() {
    console.log(this.compilation);
    this.chatTranslatedText = this.utils.getStringTranslation(this.compilation.language.tag);
    this.getConversation();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
}

   /**************** Messages logic methods ****************/

  /**
   * Get the initial conversation data and the first set of blocks to be published
   */
  getConversation() {

    if(this.compilation.userId == 'preview'){
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
      console.log(json);
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
    console.log(messages);

    for (var k = 0; k < messages.length; k++) {

      var block: any = messages[k];

      
      //gets the convId of the next conversation and starts it without finishing the previous
      if(block["link"]!= undefined && block["link"].includes("continue:")){
        console.log("continue conv");
        this.compilation.convId = block["link"].substr(9, block["link"].length);
        this.compilation.restart = 0;
        this.compilation.restartSession = "continue_" + this.compilation.sessionId;
        this.compilation.continueWithDifferentConversation = true;
        this.continueWithDifferentConversation = true;
        this.getConversation();
        return;
      }

      //conversationi is over
      if(block["type"] == "end"){
        
      this.messageLoading = false;
        console.log("conversation finished");
        console.log("conversation finished");
        this.conversationOver = true;
        
        return;
      }


      await this.displayMessage(block, "auto");

      if (block["type"] == "Question" && messages[k+1]["type"]!="AnswerCont") {
        this.answersToDisplay.subtype = block["subtype"];
        this.answersToDisplay.questionId = block["blockId"];
        this.answersToDisplay.visualization = block["visualization"];
        if(this.answersToDisplay.subtype == "checkbox"){
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
    //calculate delay
    let delay = 200;
    let numberOfWord = 0;
    if (text != null && delayType == "auto") {
      numberOfWord = text.split(' ').length;
      delay = 120 * numberOfWord + 150;
    }
    if(this.recreatingConv){delay = 20;}

    //create message item
    const li = document.createElement('li');
    if(message["type"]=="AnswerCont"){
      li.classList.add('answer');
    } else {
      li.classList.add('message');
    }
    
    if(message["subtype"]=="link"){
      li.innerHTML = "<p><a href='"+message["url"]+"'  class='msg-link'>"+message["text"]+"</a></p>";
    } else if(message["subtype"]=="imageUrl"){
      li.innerHTML = "<img src='"+message["imageUrl"]+"' class='msg-image' />";
      li.addEventListener('click', this.showPhotoDialog.bind(this));
    } else {
      li.innerHTML = "<p>"+text+"</p>";
    }
   

    //add item to ui and scroll
    
    await this.utils.delay(delay);
    this.messagesList.nativeElement.appendChild(li);
    //this.scrollToBottom();
  }


  /**
   * Method called by the "input" component
   * @param $event {blockId: number, type: string, text: string, toSend: any, visualization: string, block: full block from API}
   */
  sendAnswer($event) {
    this.undoEnabled = true;
    console.log($event);
    const li = document.createElement('li');
    li.classList.add('answer');
    if($event.text.includes("<ul>")){
      li.innerHTML = "<div>"+$event.text+"</div>";
    } else {
      li.innerHTML = "<p>"+$event.text+"</p>";
    }
    this.messagesList.nativeElement.appendChild(li);
    this.disableScrollDown = false;
    //answer input reset
    this.answersToDisplay = {
      subtype: "",
      visualization: "",
      questionId: 0,
      answers: []
    }

    this.oldAnswer = $event;

    this.messageLoading = true;
    //send to api and move on
    this.continueConversation(false, $event);
  }

  /**
   * Deletes all the <li> elements after the last answer given (ans included) and 
   * calls the "continueConversation" method with the previous answer
   * */  
  undoLastAnswer(){
    this.undoEnabled = false;
    this.recreatingConv = true;
    this.conversationOver = false;

    var list = document.getElementsByTagName("li");
    var ansCount = false;
    var delQ = false;

    //answer input reset
    this.answersToDisplay = {
      subtype: "",
      visualization: "",
      questionId: 0,
      answers: []
    }

    for (var i = list.length; i > 0; i--) {

      var el = list[i - 1];
      var cname = el.className;

      if (!delQ) {
        el.remove();
        if (cname.includes("answer")) {
          ansCount = true;
        }
        if (!cname.includes("answer") && ansCount) {
          delQ = true;
        }

      } else {
        break;
      }
    }

    console.log(this.oldAnswer);
    this.continueConversation(true, this.oldAnswer);
  }

  /**************** Other methods ****************/

  showPhotoDialog(photo){
    console.log(photo);
    console.log(photo.srcElement.currentSrc);
    this.isPicModalVisible = true;
    this.openPicture = photo.srcElement.currentSrc;
  }

  handleCancel(){this.isPicModalVisible = false;}


  /**
   * When the restart screen is closed this method is invoked to continue or restart the survey
   */
  restartChoice($event: any) {
    console.log($event);

    if($event == "continue"){
      this.compilation.restart = 2;
      this.getConversation();
    } else if($event == "restart"){
      //start displaying messages
      this.compilation.restart = 1;
      this.getConversation();
    }
    
    this.showRestart = false;
  }

  //onresize
  onResize(event){
    this.disableScrollDown = false;
    this.scrollToBottom();
  }

  //Scroll
  private onScroll() {
    console.log("onscroll");
    let element = this.myScrollContainer.nativeElement
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
    if (this.disableScrollDown && atBottom) {
        this.disableScrollDown = false
    } else {
        this.disableScrollDown = true
    }
}


private scrollToBottom(): void {
    if (this.disableScrollDown) {
        return
    }
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
}

  //close chat
  closeConversation(){
    this.conversationFinished.emit(true);
  }
}
