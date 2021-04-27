import { BackendService } from './chat/chat.service';
import { Injectable, Output } from "@angular/core";
import { ENUM_CS_STRINGS, ENUM_DE_STRINGS, ENUM_EL_STRINGS, ENUM_EN_STRINGS, ENUM_ES_STRINGS, ENUM_FI_STRINGS, ENUM_FR_STRINGS, ENUM_HR_STRINGS, ENUM_IT_STRINGS, ENUM_PT_STRINGS, ENUM_SK_STRINGS, ENUM_UK_STRINGS } from './app.model';

@Injectable()
export class HelperService {

  constructor(private backend: BackendService) { }

  getLanguageArray(){
    let   languages = [{ title: "", introText: "", privacyLink: "", lang: "Afrikaans", tag: "af" }, { title: "", introText: "", privacyLink: "", lang: "Albanian ", tag: "sp" }, { title: "", introText: "", privacyLink: "", lang: "Arabic", tag: "ar" }, { title: "", introText: "", privacyLink: "", lang: "Basque", tag: "eu" },
    { title: "", introText: "", privacyLink: "", lang: "Byelorussian ", tag: "be" }, { title: "", introText: "", privacyLink: "", lang: "български език", tag: "bg" }, { title: "", introText: "", privacyLink: "", lang: "Català", tag: "va" }, { title: "", introText: "", privacyLink: "", lang: "Hrvatski", tag: "hr" }, { title: "", introText: "", privacyLink: "", lang: "Čeština", tag: "cs" },
    { title: "", introText: "", privacyLink: "", lang: "Dansk", tag: "da" }, { title: "", introText: "", privacyLink: "", lang: "Nederlands", tag: "nl" }, { title: "", introText: "", privacyLink: "", lang: "English", tag: "en" }, { title: "", introText: "", privacyLink: "", lang: "Esperanto", tag: "eo" }, { title: "", introText: "", privacyLink: "", lang: "Eesti", tag: "et" },
    { title: "", introText: "", privacyLink: "", lang: "Suomi", tag: "fi" }, { title: "", introText: "", privacyLink: "", lang: "Faronese", tag: "fo" }, { title: "", introText: "", privacyLink: "", lang: "Français", tag: "fr" },
    { title: "", introText: "", privacyLink: "", lang: "Galego", tag: "gl" }, { title: "", introText: "", privacyLink: "", lang: "Deutsch", tag: "de" }, { title: "", introText: "", privacyLink: "", lang: "Ελληνικά", tag: "el" }, { title: "", introText: "", privacyLink: "", lang: "עברית", tag: "he" }, { title: "", introText: "", privacyLink: "", lang: "Magyar", tag: "hu" },
    { title: "", introText: "", privacyLink: "", lang: "Icelandic", tag: "is" }, { title: "", introText: "", privacyLink: "", lang: "Italiano", tag: "it" }, { title: "", introText: "", privacyLink: "", lang: "Irish", tag: "ga" }, { title: "", introText: "", privacyLink: "", lang: "Japanese", tag: "ja" }, { title: "", introText: "", privacyLink: "", lang: "Korean", tag: "ko" },
    { title: "", introText: "", privacyLink: "", lang: "Latviešu", tag: "lv" }, { title: "", introText: "", privacyLink: "", lang: "Mакедонски", tag: "mk" }, { title: "", introText: "", privacyLink: "", lang: "Malti", tag: "mt" }, { title: "", introText: "", privacyLink: "", lang: "Norsk", tag: "nb" },
    { title: "", introText: "", privacyLink: "", lang: "Polski", tag: "pl" }, { title: "", introText: "", privacyLink: "", lang: "Português", tag: "pt" }, { title: "", introText: "", privacyLink: "", lang: "Română", tag: "ro" },
    { title: "", introText: "", privacyLink: "", lang: "Русский", tag: "ru" }, { title: "", introText: "", privacyLink: "", lang: "Scottish", tag: "gd" }, { title: "", introText: "", privacyLink: "", lang: "Slovenčina", tag: "sk" }, { title: "", introText: "", privacyLink: "", lang: "Slovenščina", tag: "sl" },
    { title: "", introText: "", privacyLink: "", lang: "Српски", tag: "sr" }, { title: "", introText: "", privacyLink: "", lang: "Español", tag: "es" }, { title: "", introText: "", privacyLink: "", lang: "Svenska", tag: "sv" }, { title: "", introText: "", privacyLink: "", lang: "Türkçe", tag: "tr" }, { title: "", introText: "", privacyLink: "", lang: "Українська", tag: "uk" }];
    
    return languages;
  }
 

  //gets browser language
  getBrowserLanguage() {
    var langArr = navigator.language.split("-");
    var languageValue = { title: "", introText: "", privacyLink: "", lang: "", tag: "" };
    languageValue.tag = langArr[0];
    return languageValue;
  }

  getStringTranslation(languageTag: string) {
    if (languageTag == "it") {
      return ENUM_IT_STRINGS;
    } else if(languageTag == "fr"){
      return ENUM_FR_STRINGS;
    } else if(languageTag == "el"){
      return ENUM_EL_STRINGS;
    } else if(languageTag == "fi"){
      return ENUM_FI_STRINGS;
    } else if(languageTag == "sk"){
      return ENUM_SK_STRINGS;
    } else if(languageTag == "cs"){
      return ENUM_CS_STRINGS;
    } else if(languageTag == "es"){
      return ENUM_ES_STRINGS;
    } else if(languageTag == "de"){
      return ENUM_DE_STRINGS;
    } else if(languageTag == "uk"){
      return ENUM_UK_STRINGS;
    } else if(languageTag == "hr"){
      return ENUM_HR_STRINGS;
    } else if(languageTag == "pt"){
      return ENUM_PT_STRINGS;
    } else {
      return ENUM_EN_STRINGS;
    }
  }

  //delay method
  delay(time: any) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}