import { BackendService } from './backend.service';
import { Injectable, Output, Component, OnChanges } from '@angular/core';
import { Params, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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

    getParams: any;

    setup: any = {};
    public conversation$ = new BehaviorSubject<any>({});

    constructor(private backend: BackendService, private router: Router,
        private utils: HelperService, private route: ActivatedRoute) { }

    public dataGatheringComplete(error: string): Observable<any> {

        if (error != "") {
            this.setup.error = error;
            this.setup.ready = false;
            this.conversation$.next(this.setup);
            return this.conversation$.asObservable();
        }

        if (this.languagesOk != undefined && this.detailsOk != undefined) {

            this.setup.ready = true;
            this.conversation$.next(this.setup);
            return this.conversation$.asObservable();
        }
    }


    //get url data
    checkQueryParams() {

        this.getParams = this.router.events.subscribe(evt => {
            // this is an injected Router instance
            if (this.router.navigated) {
                if (!this.oneSwing) {
                    this.processParams(this.route.snapshot.queryParams);
                    this.oneSwing = true;
                }
            }
        });
    }

    processParams(params) {
        this.getParams.unsubscribe();

        if (params == undefined || params == {} || params.data == undefined) {
            this.dataGatheringComplete("The url is missing some information, unable to start the conversation");
            return;
        }

        var encryptedData = params.data;
        var temp = encryptedData.replace(/ /g, '+');
        encryptedData = temp;

        try {
            var decr = CryptoJS.AES.decrypt(encryptedData.trim(), "Cefriel").toString(CryptoJS.enc.Utf8);
            var decrArray = decr.toString(CryptoJS.enc.Utf8).split("*&*");
        } catch (error) {
            this.dataGatheringComplete("The url is not valid, unable to decrypt the data.");
            return;
        }

        if (decrArray.length < 4) {
            this.paramsOk = false;
            this.dataGatheringComplete("The url is missing some information, unable to get the conversation.");

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
            this.dataGatheringComplete("");
        }, err => {
            this.languagesOk = true;
            this.dataGatheringComplete("");
        });

    }

    //get details of conversations
    getDetailsOfConversation() {

        let endpoint = '/chat/getConversationDetails?conversationId=' + this.setup.convId;

        if (this.setup.userId == 'preview') {
            endpoint += '&preview=true'
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
                document.documentElement.style.setProperty('--primary-hover', details["chat_primary_color"] + "d9");
                document.documentElement.style.setProperty('--primary-active', details["chat_primary_color"] + "d9");
                document.documentElement.style.setProperty('--primary-shadow', details["chat_primary_color"] + "52");
                document.documentElement.style.setProperty('--accent-color', details["chat_secondary_color"]);
                document.documentElement.style.setProperty('--text-color', details["chat_text_color"]);
            }
            this.detailsOk = true;
            this.dataGatheringComplete("");
        }, err => {
            this.detailsOk = true;
            this.dataGatheringComplete("");
        });
    }


}