//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {
  AfterViewInit,
  Component,
  ViewChild,
} from '@angular/core';
import {
  PortalModule, DomPortalOutlet,
} from '@angular/cdk/portal';


import {ApplicationRef, Injector, OnDestroy } from '@angular/core';
import {CdkPortal} from '@angular/cdk/portal';

import {AbstractSubscriber}   from "../../service/abstract-subscriber";
import {EventBusService}      from "../../service/eventbus.service";
import {PortalService} from "../../service/portal.service";
import {QuillEditorComponent} from "ngx-quill";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";

//=============================================================================

@Component({
  selector   :    'doc-editor',
  templateUrl:  './doc-editor.html',
  styleUrls  : ['./doc-editor.scss'],
  imports: [PortalModule, QuillEditorComponent, MatButtonToggle, MatButtonToggleGroup],
  standalone : true
})

//=============================================================================

export class DocEditor extends AbstractSubscriber implements AfterViewInit, OnDestroy {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @ViewChild(CdkPortal) portal : CdkPortal | undefined

  private extWindow : Window|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private applicationRef: ApplicationRef,
              private injector      : Injector,
              private portalService : PortalService,
              eventBusService: EventBusService) {

    super(eventBusService);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init/destroy
  //---
  //-------------------------------------------------------------------------

  ngAfterViewInit(){
    this.extWindow = window.open('', '', 'popup,width=600,height=400,left=200,top=200');

    if (this.extWindow == null) {
      console.log("DocEditor's window is null")
      return
    }

    let host = new DomPortalOutlet(
      this.extWindow.document.body,
      undefined,
      this.applicationRef,
      this.injector
    );

    host.attach(this.portal);

    window.document.querySelectorAll("link,style").forEach(htmlElement => {
      this.extWindow?.document.head.appendChild(htmlElement.cloneNode(true));
    })

    this.extWindow.onbeforeunload = () => {
      console.log("DocEditor unloaded")
      this.portalService.showDocEditor = false
    }
  }

  //-------------------------------------------------------------------------

  ngOnDestroy(){
    console.log("Destroying DocEditor...")
    this.extWindow?.close()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
