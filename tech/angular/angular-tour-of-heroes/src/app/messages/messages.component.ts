import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @Output() handleClear: EventEmitter<string>;

  constructor(public messageService: MessageService) {
    this.handleClear = new EventEmitter();
  }

  ngOnInit() {
  }

  clear() {
    console.log('click');
    this.handleClear.emit('click emit');
  }

}
