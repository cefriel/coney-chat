import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ChatMessage } from '../chat.model';

@Component({
  selector: 'chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss'],
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
export class ChatContentComponent implements OnInit {
  @Input() displayedMessages: ChatMessage[] | undefined;
  @Input() disableScrollDown: boolean;
  @Input() loading: boolean | false;
  @Input() messageLoading: boolean | false;
  @Input() errorMessage: String | undefined;
  @Input() recreatingConv: boolean | false;

  @ViewChild('scrollDiv', { static: false }) private scrollContainer: ElementRef;
  @ViewChild('messagesList', { static: false }) private messagesList: ElementRef;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;


  isPicModalVisible = false;
  openPicture = "";


  ngOnInit() { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  /**************** Picture methods ****************/

  /**
   * picture modal
   */
  showPhotoDialog(photo) {
    this.openPicture = photo;
    if (this.openPicture != undefined && this.openPicture != "") {
      this.isPicModalVisible = true;
    }
  }

  imageLoaded(event) {
    let el: Element = event.path[1].firstChild;
    el.remove();
    this.scrollToBottom();
  }

  handleCancel() {
    this.isPicModalVisible = false;
    this.openPicture = undefined;
  }


  /**************** Scroll methods ****************/

  onScroll() {
    let element = this.myScrollContainer.nativeElement
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
    if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false
    } else {
      this.disableScrollDown = true
    }
  }

  onResize(event) {
    this.disableScrollDown = false;
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.disableScrollDown) {
      return
    }
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}