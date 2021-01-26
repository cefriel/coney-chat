import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment'
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class BackendService {

  url = environment.baseUrl + "/coney-api";

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  getRequest(endpoint: string) {
    return this.http.get(this.url + endpoint, {responseType: 'text'});
  }

  getConversationRequest(compilation: any) {

      let endpoint = '/chat/beginConversation';
     //conversation ID
     endpoint = endpoint + '?conversationId=' + compilation.convId;
     //language
     endpoint = endpoint + '&lang=' + compilation.language.tag;
     
     //user ID
     if (compilation.userId != null && compilation.userId != "") {
       endpoint = endpoint + '&userId=' + compilation.userId;      
     } else if (compilation.userId == null || compilation.userId == "") {
       

      compilation.userId = this.cookieService.get("userId");
      
       
 
       //If yes, the saved one is random
       if (compilation.userId != undefined 
         && compilation.userId.substr(0, 2) == "u_" 
         && compilation.userId.length == 8) {
         endpoint = endpoint + '&userId=' + compilation.userId;
       }
     }
 
     //metadata
     if (compilation.meta1 != null && compilation.meta1!="") {
       endpoint = endpoint + '&meta1=' + compilation.meta1.replace("&", "%26");
     }
     if (compilation.meta2 != null && compilation.meta2!="") {
       endpoint = endpoint + '&meta2=' + compilation.meta2.replace("&", "%26");
     }
 
     //continue or restart in case of multiple compilations
     endpoint = endpoint + '&restart=' + compilation.restart;
     if (compilation.restart == 1 || compilation.restart == 2 || compilation.continueWithDifferentConversation) {
       endpoint = endpoint + '&session=' + compilation.restartSession;
     }
 
     //limit set to 1 compilation per user
     if (compilation.noRepeat) {
       endpoint = endpoint + '&noRepeat=noRepeat';
     }

    return this.http.get(this.url + endpoint, {responseType: 'text'});
  }

 

  postRequest(endpoint: string, json: JSON): Observable<JSON> {
    return this.http.post<JSON>(this.url + endpoint, json);
  }

  deleteObject(endpoint: string) {
    return this.http.delete(this.url + endpoint);
  }

}
