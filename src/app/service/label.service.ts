//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}  from '@angular/core';

import {AppEvent}        from "../model/event";
import {HttpService}     from "./http.service";
import {EventBusService} from "./eventbus.service";

//=============================================================================

type LabelMap  = Map<string, string>;
type EntityMap = Map<string, LabelMap>;

//=============================================================================

@Injectable()
export class LabelService {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	private static APPLICATION_FILE : string = "application";

	//-------------------------------------------------------------------------

	private languageMap : Map<String, EntityMap>;
	private language    : string;
	private loadCounter : number;

	//-------------------------------------------------------------------------

	private languages : string[] = [ "en", "it" ];

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(private httpService    : HttpService,
                private eventBusService: EventBusService) {

		this.languageMap = new Map();
		this.language    = "en";
		this.loadCounter = 0;

		//--- Load language files

		this.languages.forEach( (language : string) => {
			this.initLanguage(language);
		});
	}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	public getLanguage() : string {
		return this.language;
	}

	//-------------------------------------------------------------------------

	public setLanguage(language : string) : void {
		this.language = language;
	}

	//-------------------------------------------------------------------------

	public getLabel(entity : string, code : string) : string {

		if (code == null) {
			return "???";
		}

		let labels : LabelMap|undefined = this.getLabelMap(entity);

		if (labels == undefined) {
			return "?"+entity+"?";
		}

		let label : string|undefined = labels.get(code);

		if (label == undefined) {
			return entity+".?"+ code +"?";
		}

		return label;
	}

	//-------------------------------------------------------------------------

	public getLabelMap(entity : string) : LabelMap|undefined {

		let entities : EntityMap|undefined = this.languageMap.get(this.language);

		if (entities != undefined) {
			return entities.get(entity);
		}

		//--- Probably, we are still loading data
		return undefined;
	}

	//-------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

	private initLanguage(language : string) : void {
    this.loadCounter++;
		this.loadLanguageFile(language, LabelService.APPLICATION_FILE);
	}

	//-------------------------------------------------------------------------

	private loadLanguageFile(language : string, name : string) {

		let file : string = name +"-"+ language +".json";

		this.httpService.get("assets/lang/"+ file)
						.subscribe(	result => this.processFile(language, file, result),
									error => console.log("Cannot load labels file : "+ file));
	}

	//-------------------------------------------------------------------------

	private processFile(language : string, file:string, data : any) : void {

		console.log("Loaded labels file : "+ file);

		let entities : EntityMap|undefined = this.languageMap.get(language);

		if (entities == undefined) {
			entities = new Map<string, LabelMap>();
			this.languageMap.set(language, entities);
		}

		for (let key in data) {
			entities.set(key, this.buildLabelMap(data[key]));
		}

    this.loadCounter--;

    if (this.loadCounter == 0) {
      console.log("All language files has been loaded. Localization is ready.");
      this.eventBusService.emitToApp(new AppEvent(AppEvent.LOCALIZATION_READY));
    }
	}

  //-------------------------------------------------------------------------

  private buildLabelMap(data : any) : LabelMap {

    let labels = new Map<string, string>();

    for (let key in data) {
      labels.set(key, data[key]);
    }

    return labels;
  }
}

//=============================================================================
