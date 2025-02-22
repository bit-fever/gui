//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatInputModule}       from "@angular/material/input";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {FlexTablePanel} from "../../../../../../../component/panel/flex-table/flex-table.panel";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {InventoryService} from "../../../../../../../service/inventory.service";
import {CollectorService} from "../../../../../../../service/collector.service";
import {MatChipsModule} from "@angular/material/chips";
import {MatSelectModule} from "@angular/material/select";
import {DataPoint, DataInstrumentDataResponse} from "../../../../../../../model/model";
import {FlexTableColumn} from "../../../../../../../model/flex-table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SelectRequired} from "../../../../../../../component/form/select-required/select-required";
import {DatePicker} from "../../../../../../../component/form/date-picker/date-picker";
import {DataPointTimeTranscoder} from "../../../../../../../component/panel/flex-table/transcoders";

//=============================================================================

@Component({
  selector    :     'instrumentData-data',
  templateUrl :   './instrument-data.data.html',
  styleUrls   : [ './instrument-data.data.scss' ],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
            RouterModule, FlexTablePanel, MatChipsModule, MatSelectModule, SelectRequired,
            DatePicker],
  standalone  : true
})

//=============================================================================

export class DataInstrumentDataPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id : number = 0

  fromDate      : number|null = null
  toDate        : number|null = null
  timeframe     : string = "60m"
  timezone      : string = "exchange"

  columns         : FlexTableColumn[] = [];
  dataPoints      : DataPoint[] = []
  serviceResponse?: DataInstrumentDataResponse

  timeframes: any
  timezones : any

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private route           : ActivatedRoute,
              private inventoryService: InventoryService,
              private collectorService: CollectorService) {

    super(eventBusService, labelService, router, "inventory.dataProduct.data");
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.timeframes = this.labelService.getLabel("map.timeframe");

    this.id = Number(this.route.snapshot.paramMap.get("id"));

    this.inventoryService.getExchanges().subscribe(
      result => {
        let exchange = {
          timezone : "exchange",
          code     : this.loc("exchange")
        }

        this.timezones = [ exchange, ...result.result]
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onFromChange(value:number|null) {
  }

  //-------------------------------------------------------------------------

  onToChange(value:number|null) {
  }

  //-------------------------------------------------------------------------

  onTimeframeChange(value: string) {
    this.timeframe = value;
  }

  //-------------------------------------------------------------------------

  onTimezoneChange(value: string) {
    this.timezone = value;
  }

  //-------------------------------------------------------------------------

  onReload = () => {
    if (this.tooManyDataPoints()) {
      alert(this.loc("tooManyDataPoints"))
      return
    }

    this.collectorService.getDataInstrumentData(this.id,
      this.buildDate(this.fromDate, false),
      this.buildDate(this.toDate, true),
      this.timeframe, this.timezone,
      0).subscribe(
      result => {
        this.serviceResponse = result;
        this.dataPoints      = result.dataPoints
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private setupColumns = () => {
    let instr = this.labelService.getLabel("model.dataPoint");

    this.columns = [
      new FlexTableColumn(instr, "time", new DataPointTimeTranscoder()),
      new FlexTableColumn(instr, "open"),
      new FlexTableColumn(instr, "high"),
      new FlexTableColumn(instr, "low"),
      new FlexTableColumn(instr, "close"),
      new FlexTableColumn(instr, "upVolume"),
      new FlexTableColumn(instr, "downVolume"),
    ]
  }

  //-------------------------------------------------------------------------

  private buildDate(value : number|null, isEnd : boolean) : string {
    if (value == null) {
      return ""
    }

    let v=value.toString()

    let y= v.substring(0,4)
    let m= v.substring(4,6)
    let d= v.substring(6)

    let suffix = isEnd ? " 23:59:59" :" 00:00:00"

    return y +"-"+ m +"-"+ d +suffix
  }

  //-------------------------------------------------------------------------

  private tooManyDataPoints() : boolean {
    if (this.fromDate == null || this.toDate == null) {
      return true
    }

    let fromY = this.fromDate / 10000
    let fromM = (this.fromDate / 100) % 100
    let fromD = (this.fromDate) % 100

    let toY = this.toDate / 10000
    let toM = (this.toDate / 100) % 100
    let toD = (this.toDate) % 100

    let days   = (toY - fromY)*365 + (toM - fromM)*12 + (toD - fromD)
    let pInDay = this.pointsInADay()

    if (pInDay == 0) {
      alert("Timeframe not managed: "+this.timeframe)
      return true
    }

    return (days*pInDay > 10000)
  }

  //-------------------------------------------------------------------------

  private pointsInADay() : number {
    switch (this.timeframe) {
      case "1m": return 1440
      case "5m": return 288
      case "10m": return 144
      case "15m": return 96
      case "30m": return 48
      case "60m": return 24
    }

    return 0
  }
}

//=============================================================================
