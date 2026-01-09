//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {Metrics, QualityAnalysisResponse} from "../../../model/quality";

//=============================================================================

const DarkGray = "#E0E0E0"
const Gray     = "#F8F8F8"
const Red3     = "#A00000"
const Red2     = "#C04040"
const Red1     = "#F06060"
const Orange   = "#B0B060"
const Green1   = "#60F060"
const Green2   = "#04C040"
const Green3   = "#00F000"

//=============================================================================

@Component({
  selector: 'quality-market-panel',
  templateUrl: './market.panel.html',
  styleUrls:  ['./market.panel.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
  ]
})

//=============================================================================

export class QualityMarketPanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input()
  set qar(qar : QualityAnalysisResponse) {
    this._qar = qar
    this.rebuild()
  }

  get qar() : QualityAnalysisResponse|undefined {
    return this._qar
  }

  _qar? : QualityAnalysisResponse

  //---------------------------------------------------------------------------

  tradeType   = new FormControl("all")
  returnType  = new FormControl("net")
  metricType  = new FormControl("sqn")

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService) {
    super(eventBusService, labelService, router, "module.quality.market", "")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.rebuild()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onTradeTypeChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------

  onReturnTypeChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  data(dir : number, vol : number) : number|undefined {
    let list = this.getList()
    if (list.length == 0) {
      return undefined
    }

    let cell   = list[dir+2][vol]

    if (this.metricType.value == "sqn") {
      return cell.sqn
    }

    if (this.metricType.value == "sqn100") {
      return cell.sqn100
    }
    if (this.metricType.value == "trades") {
      return cell.trades
    }
    if (this.metricType.value == "tradesPerc") {
      return cell.tradesPerc
    }

    return cell.maxDrawdown
  }

  //-------------------------------------------------------------------------

  bg(dir : number, vol : number) : string {
    let list = this.getList()
    if (list.length == 0) {
      return ""
    }

    let metric = this.metricType.value
    if (metric == "trades" || metric == "tradesPerc" || metric == "maxDrawdown") {
      return ""
    }

    let cell   = list[dir+2][vol]
    if (cell.trades < 15) {
      return DarkGray
    }
    if (cell.trades < 30) {
      return Gray
    }

    let value = (this.metricType.value == "sqn")
                                    ? cell.sqn
                                    : cell.sqn100

    value = (value == undefined) ? 0 : value

    if (value < -2)  { return Red3   }
    if (value < -1)  { return Red2   }
    if (value <  0)  { return Red1   }
    if (value < 1.5) { return Orange }
    if (value < 2.0) { return Green1 }
    if (value < 3.0) { return Green2 }

    return Green3
  }

  //-------------------------------------------------------------------------

  getList() : Metrics[][] {
    if (this._qar == undefined) {
      return []
    }

    //--- All case

    if (this.tradeType.value == "all") {
      if (this.returnType.value == "gross") {
        return this._qar.qualityAllGross
      }
      if (this.returnType.value == "net") {
        return this._qar.qualityAllNet
      }
    }

    //--- Long case

    if (this.tradeType.value == "long") {
      if (this.returnType.value == "gross") {
        return this._qar.qualityLongGross
      }
      if (this.returnType.value == "net") {
        return this._qar.qualityLongNet
      }
    }

    //--- Short case

    if (this.returnType.value == "gross") {
      return this._qar.qualityShortGross
    }

    return this._qar.qualityShortNet
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private rebuild() {
  }

  //-------------------------------------------------------------------------

}

//=============================================================================
