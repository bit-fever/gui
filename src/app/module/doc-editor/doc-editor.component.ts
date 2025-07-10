//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from "../../service/storage.service";
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {RightTitlePanel} from "../../component/panel/right-title/right-title.panel";

declare var $:any

//=============================================================================

@Component({
  selector   : 'editor',
  templateUrl: './doc-editor.component.html',
  styleUrl   : './doc-editor.component.scss',
  imports: [MatToolbarModule, MatButtonModule, ModuleTitlePanel, RightTitlePanel],
  standalone : true
})

//=============================================================================

export class DocEditorComponent implements OnInit {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private tsId : number = 0
  title : string = ""

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private route            : ActivatedRoute,
              private snackBar         : MatSnackBar,
              private storageService   : StorageService,
              private broadcastService : BroadcastService) {

    broadcastService.onEvent((e : BroadcastEvent)=>{
      if (e.type == EventType.TradingsSystem_Deleted) {
        window.close()
      }
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  ngOnInit() {
    $("#doc-editor").trumbowyg({
      svgPath: "assets/image/icons.svg"
    });

    this.tsId = Number(this.route.snapshot.paramMap.get("id"));
    this.storageService.getTradingSystemDoc(this.tsId).subscribe( res => {
      this.title = res.name
      $('#doc-editor').trumbowyg('html', res.documentation);
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onSaveClick() {
    let doc = $('#doc-editor').trumbowyg('html');

    this.storageService.setTradingSystemDoc(this.tsId, doc).subscribe( res => {
      this.snackBar.open("Documentation saved", undefined, { duration: 3000 })
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    window.close()
  }
}

//=============================================================================
