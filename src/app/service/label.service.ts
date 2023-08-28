//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}       from '@angular/core';
import {AppEvent}         from "../model/event";
import {HttpService}      from "./http.service";
import {EventBusService}  from "./eventbus.service";
import {parse}            from 'yaml';

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

	private languageMap : Map<String, any>;
	private language    : string;
	private loadCounter : number;

	//-------------------------------------------------------------------------

	private languages : string[] = [ "en", "it" ];

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(private httpService : HttpService, private eventBusService: EventBusService) {

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

	public getLabelString(code: string) : string {
		return this.getLabel(code).toString();
	}

	//-------------------------------------------------------------------------

	public getLabel(code: string) : any {

		if (code == null) {
			return "?null?";
		}

		let labels : any|undefined = this.languageMap.get(this.language);

		if (labels == undefined) {
			return "?not-loaded?";
		}

		let tokens = code.split(".");

		for (var token of tokens) {
			labels = labels[token]

			if (labels == undefined) {
				return "?"+code+"?";
			}
		}

		return labels;
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

		let file : string = name +"-"+ language +".yaml";

		this.httpService.get<string>("assets/lang/"+ file, { responseType : "text" })
			.subscribe(	result => this.processFile(language, file, result),
									error => console.log("Cannot load labels file : "+ file));
	}

	//-------------------------------------------------------------------------

	private processFile(language : string, file:string, data : string) : void {

		console.log("Loaded labels file : "+ file);

		let yamlMap: any = parse(data.toString())
		this.languageMap.set(language, yamlMap);

		this.loadCounter--;

		if (this.loadCounter == 0) {
			console.log("All language files has been loaded. Localization is ready.");
			this.eventBusService.emitToApp(new AppEvent(AppEvent.LOCALIZATION_READY));
		}
	}
}

//=============================================================================
