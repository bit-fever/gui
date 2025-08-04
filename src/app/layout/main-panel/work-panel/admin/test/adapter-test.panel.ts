//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from "@angular/core";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {SystemAdapterService} from "../../../../../service/system-adapter.service";
import {LabelService} from "../../../../../service/label.service";
import {EventBusService} from "../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {InputTextRequired} from "../../../../../component/form/input-text-required/input-text-required";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {TestAdapterRequest} from "../../../../../model/model";
import {InputTextOptional} from "../../../../../component/form/input-text-optional/input-text-optional";

//=============================================================================

@Component({
  selector: 'service-test',
  templateUrl: './adapter-test.panel.html',
  styleUrls:  ['./adapter-test.panel.scss'],
  imports: [
    InputTextRequired,
    MatButton,
    MatInput,
    InputTextOptional
  ]
})

//=============================================================================

export class AdapterTestPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  connCode : string = ""
  service  : string = ""
  query    : string = ""
  result   : string = ""

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private systemService: SystemAdapterService) {

    super(eventBusService, labelService, router, "admin.test");
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRunClick() {
    let tar: TestAdapterRequest = {
      service: this.service,
      query  : this.query,
    };

    this.result = ""

    this.systemService.testAdapter(this.connCode, tar).subscribe(result => {
      this.result = JSON.stringify(JSON.parse(result), );
    });
  }
}

//=============================================================================
