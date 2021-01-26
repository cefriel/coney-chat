import { BackendService } from './backend.service';
import { Injectable, Output, Component, OnChanges } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HelperService } from './utils.service';


@Injectable()
export class SetupService {

    //once all the steps are completed it stops loading
    detailsOk = undefined;
    languagesOk = undefined;
    paramsOk = undefined; 

    oneSwing = false;

    setup: any = {};
    public conversation$ = new BehaviorSubject<any>({});

    constructor(private backend: BackendService,
        private utils: HelperService, private route: ActivatedRoute) { }

    public dataGatheringComplete(): Observable<any> {
        
        if(!this.paramsOk){
            this.setup.error ="Wrong link or missing info";
            this.setup.ready = false;
            this.conversation$.next(this.setup);
            return this.conversation$.asObservable();
        } else {
            this.setup.error = "";
        }

        if (this.languagesOk != undefined && this.detailsOk != undefined) {

            this.setup.ready = true;
            this.conversation$.next(this.setup);
            return this.conversation$.asObservable();
        }
    }


    //get url data
    checkQueryParams() {
       
        this.route.queryParams.forEach((params: Params) => {
            var encryptedData = params['data'];
            if (encryptedData != undefined) {
                var temp = encryptedData.replace(/ /g, '+');
                encryptedData = temp;
                try{
                    var decr = CryptoJS.AES.decrypt(encryptedData.trim(), "Cefriel").toString(CryptoJS.enc.Utf8);
                    var decrArray = decr.toString(CryptoJS.enc.Utf8).split("*&*");
                } catch (error){
                    if(!this.oneSwing){
                        this.oneSwing = true;
                        return;
                    } else {
                        this.paramsOk = false;
                        this.dataGatheringComplete();
                    }
                    
                }
                
                //Wrong link
                if (decrArray.length < 4) {

                    this.paramsOk = false;
                    this.dataGatheringComplete();
                } else {
                    
                    this.paramsOk = true;
                    this.setup.userId = decrArray[0];
                    this.setup.meta1 = decrArray[1].replace("%26", "&");;
                    this.setup.meta2 = decrArray[2].replace("%26", "&");
                    this.setup.convId = decrArray[3];

                    if (decrArray[4] != undefined && decrArray != null && decrArray[4] == "noRepeat") {
                        this.setup.noRepeat = true;
                    }

                    this.getLanguagesOfConversation();
                    this.getDetailsOfConversation();
                }
               
            } else {

                if(this.oneSwing){
                    this.paramsOk = false;
                    console.log("exiting");
                    this.dataGatheringComplete();
                }
                this.oneSwing = true;
               
            }
        });
    }

    //get url details
    getLanguagesOfConversation() {
        var getReqLanguages = [];

        let endpoint = '/chat/getLanguagesOfConversation?conversationId=' + this.setup.convId;
        this.backend.getRequest(endpoint).subscribe(res => {
            
            getReqLanguages = JSON.parse(res);
            var outputLanguages = [];
            var languages = this.utils.getLanguageArray();
            
            for (var i = 0; i < languages.length; i++) {

                var index = getReqLanguages.findIndex(x => x.language == languages[i].tag);
                if (index != -1) {
                    languages[i].title = getReqLanguages[index].title;
                    languages[i].privacyLink = getReqLanguages[index].privacyLink;
                    languages[i].introText = getReqLanguages[index].introText;
                    //this.conversation.languages[i].title = getReqLanguages[index].title; -> enable for new
                    outputLanguages.push(languages[i]);
                }
               
            }

            if (getReqLanguages.length == 0) {
                // this.error = "Couldn't load the languages. Something went wrong...";
            }

            this.setup.languages = outputLanguages;
            this.languagesOk = true;
            this.dataGatheringComplete();
        }, err => {
            this.languagesOk = true;
            this.dataGatheringComplete();
        });

    }

    //get details of conversations
    getDetailsOfConversation() {

        let endpoint = '/chat/getConversationDetails?conversationId=' + this.setup.convId;

        if(this.setup.userId == 'preview'){
            endpoint+='&preview=true'
        }


        this.backend.getRequest(endpoint).subscribe(res => {

            if (res == null || res == undefined || res == "") {
                this.detailsOk = true;
                //return; TODO Remove comment
            }

            var details: JSON = JSON.parse(res);
            if (details["chat_image"] != null && details["chat_image"] != undefined && details["chat_image"] != "") {
                this.setup.logo = details["chat_image"];
            }

            if (details["chat_privacy_notice"] != null && details["chat_privacy_notice"] != undefined && details["chat_privacy_notice"] != "") {
                this.setup.privacyLink = details["chat_privacy_notice"];
            }

            if (details["chat_intro_text"] != null && details["chat_intro_text"] != undefined && details["chat_intro_text"] != "") {
                this.setup.privacyText = details["chat_intro_text"];
            }

            if (details["chat_primary_color"] != null && details["chat_primary_color"] != undefined) {

                document.documentElement.style.setProperty('--primary-color', details["chat_primary_color"]);
                document.documentElement.style.setProperty('--primary-hover', details["chat_primary_color"]+"d9");
                document.documentElement.style.setProperty('--primary-active', details["chat_primary_color"]+"d9");
                document.documentElement.style.setProperty('--primary-shadow', details["chat_primary_color"]+"52");
                document.documentElement.style.setProperty('--accent-color', details["chat_secondary_color"]);
                document.documentElement.style.setProperty('--text-color', details["chat_text_color"]);
            }
            this.detailsOk = true;
            this.dataGatheringComplete();
        }, err => {
            this.detailsOk = true;
            this.dataGatheringComplete();
        });
    }


}