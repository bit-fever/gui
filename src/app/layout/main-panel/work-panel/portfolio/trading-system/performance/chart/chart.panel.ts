//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}    from '@angular/core';
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {Router} from "@angular/router";

//=============================================================================

@Component({
  selector: 'performance-chart-panel',
  templateUrl: './chart.panel.html',
  styleUrls: ['./chart.panel.scss'],
  imports: []
})

//=============================================================================

export class PerformanceChartPanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router) {
    super(eventBusService, labelService, router, "", "")
  }
}

//=============================================================================
