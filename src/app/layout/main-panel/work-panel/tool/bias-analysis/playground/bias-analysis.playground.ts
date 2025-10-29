//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  NgApexchartsModule
} from "ng-apexcharts";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {
} from "../../../../../../model/model";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {CollectorService} from "../../../../../../service/collector.service";
import {ChipSetTextComponent} from "../../../../../../component/form/chip-text-set/chip-set-text";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn, ListResponse, ListService, Transcoder} from "../../../../../../model/flex-table";
import {Observable} from "rxjs";
import {ListLabelTranscoder, OperationTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {MatGridListModule} from "@angular/material/grid-list";
import {Url} from "../../../../../../model/urls";
import {BiasConfig, BiasSummaryResponse, DataPointDowList, DataPointEntry} from "../model";
import {ToggleButton} from "../../../../../../component/form/toggle-button/toggle-button";
import {Lib} from "../../../../../../lib/lib";
import {MinMax} from "../../../../../../lib/min-max";

//=============================================================================

@Component({
    selector: 'bias-analysis-playground',
    templateUrl: './bias-analysis.playground.html',
    styleUrls: ['./bias-analysis.playground.scss'],
  imports: [CommonModule, MatButton, MatIcon, NgApexchartsModule,
    ChipSetTextComponent, MatFormField, MatLabel,
    MatIconButton, MatInput, MatSuffix, ReactiveFormsModule, MatTabGroup, MatTab, MatButtonToggle, MatButtonToggleGroup, FlexTablePanel,
    MatGridListModule, ToggleButton]
})

//=============================================================================

export class BiasAnalysisPlaygroundPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  baId : number = 0

  showLabels: boolean = false
  showProfit: boolean = false

  result    : BiasSummaryResponse = new BiasSummaryResponse()

  monthsControl = new FormControl<number[]>([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])

  selMonths  : boolean[] = [ true, true, true, true, true, true, true, true, true, true, true, true ]
  excludedSet: string[] = []

  selSlot?   : SelectedSlot
  startSlot? : SelectedSlot
  endSlot?   : SelectedSlot

  selRangeProfit? : Profit

  dowList : string[] = []

  //--- Configs -------------------------------------------

  selConfigs?:BiasConfig[]
  columns    : FlexTableColumn[] = [];
  service    : ListService<BiasConfig>;

  @ViewChild("configsTable") configsTable : FlexTablePanel | undefined

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private route           : ActivatedRoute,
              private collectorService: CollectorService) {

    super(eventBusService, labelService, router, "tool.biasPlayground");

    this.dowList = this.labelService.getLabel("list.dowShort")
    this.service = this.getBiasConfigs
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.baId = Number(this.route.snapshot.paramMap.get("id"));
    this.reloadBiasAnalysis()
    this.setupColumns()
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.biasConfig");

    this.columns = [
      new FlexTableColumn(ts, "startDay",   new ListLabelTranscoder(this.labelService, "list.dowLong")),
      new FlexTableColumn(ts, "startSlot",  new SlotTranscoder()),
      new FlexTableColumn(ts, "endDay",     new ListLabelTranscoder(this.labelService, "list.dowLong")),
      new FlexTableColumn(ts, "endSlot",    new SlotTranscoder()),
      new FlexTableColumn(ts, "months",     new MonthsTranscoder(this.labelService)),
      new FlexTableColumn(ts, "excludes"),
      new FlexTableColumn(ts, "operation",  new OperationTranscoder(this.labelService)),
      new FlexTableColumn(ts, "grossProfit",new MoneyTranscoder(this)),
      new FlexTableColumn(ts, "netProfit",  new MoneyTranscoder(this)),
    ]
  }

  //-------------------------------------------------------------------------

  private getBiasConfigs = (): Observable<ListResponse<BiasConfig>> => {
    return this.collectorService.getBiasConfigsByAnalysisId(this.baId)
  }

  //-------------------------------------------------------------------------

  private reloadBiasAnalysis() {
    this.collectorService.getBiasSummary(this.baId).subscribe( result => {
      this.result = result
      this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onLabelsChange() {
    // @ts-ignore
    this.options.dataLabels = <ApexDataLabels>{
      enabled: this.showLabels,
      style: {
        fontSize: '12px',
        fontWeight: 'plain',
      }
    }
  }

  //-------------------------------------------------------------------------

  onProfitChange() {
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

  //-------------------------------------------------------------------------

  onMonthChange(e: MatButtonToggleChange) {
    let month : number  = e.value
    let found : boolean = false

    this.monthsControl.value?.forEach( value => {
      if (month == value) {
        found = true
      }
    })

    this.selMonths[month] = found
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

  //-------------------------------------------------------------------------

  onChartClick = (e: any, chart?: any, options?: any) => {
    this.selSlot = new SelectedSlot(6-options.seriesIndex, options.dataPointIndex, this.dowList[6-options.seriesIndex])

    let entries = this.result.result[this.selSlot.dayIndex].slots[this.selSlot.slotIndex].list
    this.buildBarChart(entries)
  }

  //-------------------------------------------------------------------------

  onMonthLeft() {
    for (let i=0; i<12; i++) {
      if (this.selMonths[i]) {
        this.selMonths[i] = false

        if (i == 0) {
          i = 12
        }

        this.selMonths[i-1] = true
        this.updateFormControlFromMonths()
        this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
        return
      }
    }
  }

  //-------------------------------------------------------------------------

  onMonthToggle() {
    for (let i=0; i<12; i++) {
      this.selMonths[i] = !this.selMonths[i]
    }
    this.updateFormControlFromMonths()
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

  //-------------------------------------------------------------------------

  onMonthRight() {
    for (let i=0; i<12; i++) {
      if (this.selMonths[i]) {
        this.selMonths[i]          = false
        this.selMonths[(i+1) % 12] = true
        this.updateFormControlFromMonths()
        this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
        return
      }
    }
  }

  //-------------------------------------------------------------------------

  onExcludedChange(excludes : string[]) {
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Strategy methods
  //---
  //-------------------------------------------------------------------------

  onSetStart() {
    this.startSlot = this.selSlot
    this.updateRangeProfit()
  }

  //-------------------------------------------------------------------------

  onSetEnd() {
    this.endSlot = this.selSlot
    this.updateRangeProfit()
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    let bc = this.createBiasConfig()
    this.collectorService.addBiasConfig(this.baId, bc).subscribe( res => {
      this.configsTable?.reload()
    })
  }

  //-------------------------------------------------------------------------

  onReplaceClick() {
    let bc = this.createBiasConfig()

    if (this.selConfigs != undefined) {
      bc.id = this.selConfigs[0].id
    }

    this.collectorService.updateBiasConfig(this.baId, bc).subscribe( res => {
      this.configsTable?.reload()
    })
  }

  //-------------------------------------------------------------------------

  onDeleteClick() {
    if (this.selConfigs != undefined) {
      this.selConfigs.forEach( bc => {
        // @ts-ignore
        this.collectorService.deleteBiasConfig(this.baId, bc.id).subscribe( res => {
          this.configsTable?.reload()
        })
      })
    }
  }

  //-------------------------------------------------------------------------

  onBacktestClick() {
    this.navigateTo([ Url.Tool_BiasAnalyses, this.baId, Url.Sub_Backtest ]);
  }

  //-------------------------------------------------------------------------

  onConfigSelected(selection : BiasConfig[]) {
    this.selConfigs = selection
  }

  //-------------------------------------------------------------------------

  isCreateEnabled() : boolean {
    return this.startSlot != undefined && this.endSlot != undefined
  }

  //-------------------------------------------------------------------------

  isReplaceEnabled() : boolean {
    if (this.selConfigs != undefined && this.selConfigs.length == 1) {
      return this.isCreateEnabled()
    }

    return false
  }

  //-------------------------------------------------------------------------

  isDeleteEnabled = () : boolean => {
    return (this.selConfigs != undefined && this.selConfigs.length > 0)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Other methods
  //---
  //-------------------------------------------------------------------------

  validator(value : string) : boolean {
    if (value.length == 4) {
      let year = Number(value)

      return (year >= 2000 && year <= 3000)
    }

    if (value.length == 6 || value.length == 7) {
      let sep = value.at(4)

      if (sep != "-") {
        return false
      }

      let year  = Number(value.substring(0,4))
      let month = Number(value.substring(5))

      return (year >= 2000 && year <= 3000) && (month >= 1 && month <= 12)
    }

    return false
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateRangeProfit() {
    if (this.startSlot && this.endSlot) {
      this.selRangeProfit = this.calcRangeNetProfit()
      this.selRangeProfit.gross = Math.abs(this.selRangeProfit.gross)
    }
  }

  //-------------------------------------------------------------------------

  private createBiasConfig() : BiasConfig {
    let bc = new BiasConfig()

    bc.startDay = this.startSlot?.dayIndex
    bc.startSlot= this.startSlot?.slotIndex
    bc.endDay   = this.endSlot?.dayIndex
    bc.endSlot  = this.endSlot?.slotIndex
    bc.months   = this.selMonths
    bc.excludes = this.excludedSet

    let profit = this.calcRangeNetProfit()
    bc.grossProfit = profit.gross
    bc.netProfit   = profit.net
    bc.operation   = profit.operation

    return bc
  }

  //-------------------------------------------------------------------------

  private calcRangeNetProfit = () : Profit => {
    // @ts-ignore
    let startDay = this.startSlot.dayIndex
    // @ts-ignore
    let startSlot= this.startSlot.slotIndex
    // @ts-ignore
    let endDay   = this.endSlot.dayIndex
    // @ts-ignore
    let endSlot     = this.endSlot.slotIndex
    let grossProfit = this.calcGrossProfit(startDay, startSlot)
    let length      = this.calcLength(startDay, startSlot)
    let count       = 1

    while (startDay != endDay || startSlot != endSlot) {
      if (++startSlot == 48) {
        startSlot = 0
        startDay  = (startDay +1) % 7
      }

      count++
      grossProfit += this.calcGrossProfit(startDay, startSlot)
    }

    let profit = new Profit()
    profit.gross = Math.trunc(grossProfit)

    if (grossProfit < 0) {
      profit.gross *= -1
      profit.operation = 1
    }

    // @ts-ignore
    profit.net      = Math.trunc(profit.gross - 2 * this.result.brokerProduct.costPerOperation * length)
    profit.avgGross = Math.round(profit.gross / length * 100) / 100
    profit.avgNet   = Math.round(profit.net   / length * 100) / 100

    return profit
  }

  //-------------------------------------------------------------------------

  private calcGrossProfit(dayIndex : number, slotIndex:number) : number {
    let profit  = 0
    let dowList = this.result.result[dayIndex]

    if (dowList != null) {
      let slotList = dowList.slots[slotIndex]

      if (slotList != null) {
        let list    = slotList.list
        let exclSet = new ExcludedSet(this.excludedSet)

        list.forEach( dpe => {
          if (this.selMonths[dpe.month -1] && !exclSet.shouldBeExcluded(dpe)) {
            // @ts-ignore
            profit += dpe.delta * this.result.brokerProduct.pointValue
          }
        })
      }
    }

    return profit
  }

  //-------------------------------------------------------------------------

  private calcLength(dayIndex : number, slotIndex:number) : number {
    let dowList = this.result.result[dayIndex]
    if (dowList != null) {
      let slotList = dowList.slots[slotIndex]
      if (slotList != null) {
        return slotList.list.length
      }
    }

    return 0
  }

  //-------------------------------------------------------------------------

  private setupSeries(result : BiasSummaryResponse|null, months : boolean[], excludes : string[]) : any {
    if (result == undefined) {
      return []
    }

    let minMax  = new MinMax()
    let exclSet = new ExcludedSet(excludes)

    let series = [
      this.buildSerie("sat", result.result[6], minMax, months, exclSet),
      this.buildSerie("fri", result.result[5], minMax, months, exclSet),
      this.buildSerie("thu", result.result[4], minMax, months, exclSet),
      this.buildSerie("wed", result.result[3], minMax, months, exclSet),
      this.buildSerie("tue", result.result[2], minMax, months, exclSet),
      this.buildSerie("mon", result.result[1], minMax, months, exclSet),
      this.buildSerie("sun", result.result[0], minMax, months, exclSet),
    ]

    this.options.plotOptions = Lib.chart.buildHeathmapPlotOptions(minMax)
    this.buildBarChart([])

    return series
  }

  //-------------------------------------------------------------------------

  private buildSerie(code : string, dpdl : DataPointDowList, minMax : MinMax, months : boolean[], exclSet : ExcludedSet) : any {
    let data : any[] = []

    if (dpdl != null) {
      dpdl.slots.forEach(dpsl => {
        let delta = 0

        if (dpsl != null) {
          dpsl.list.forEach(dpe => {
            if (months[dpe.month -1] && !exclSet.shouldBeExcluded(dpe)) { // @ts-ignore
              delta += this.calcDelta(dpe)
            }
          })
        }

        delta = Math.trunc(delta)
        data = [...data, delta ]
        minMax.update(delta)
      })
    }

    return {
      name: this.labelService.getLabelString("map.dows."+code),
      data: data
    }
  }

  //-------------------------------------------------------------------------

  private buildBarChart(entries : DataPointEntry[]) {
    let axis : string[] = []
    let data : number[] = []

    let currX : string = ""
    let currD : number = 0
    let currE : DataPointEntry

    let exclSet = new ExcludedSet(this.excludedSet)

    entries.forEach( e => {
      if (this.selMonths[e.month -1] && !exclSet.shouldBeExcluded(e)) {
        if (currE == undefined) {
          currE = e
          currX = e.year +"-"+ e.month
          currD = this.calcDelta(e)
        }
        else {
          if (currE.year == e.year && currE.month == e.month) {
            currD += this.calcDelta(e)
          }
          else {
            currD = Math.trunc(currD)

            axis  = [...axis, currX]
            data  = [...data, currD]
            currE = e
            currX = e.year +"-"+ e.month
            currD = this.calcDelta(e)
          }
        }
      }
    })

    // @ts-ignore
    if (currE != undefined) {
      currD = Math.trunc(currD)
      axis  = [...axis, currX]
      data  = [...data, currD]

      this.barOptions.series = <ApexAxisChartSeries>[
        {
          name:"x",
          data: data
        }]

      this.barOptions.xaxis = {
        categories: axis
      }
    }
    else {
      this.selSlot           = undefined
      this.barOptions.series = []
    }
  }

  //-------------------------------------------------------------------------

  private calcDelta(dpe : DataPointEntry) : number {
    if (this.showProfit) {
      // @ts-ignore
      return dpe.delta * this.result.brokerProduct.pointValue
    }
    else {
      return dpe.delta
    }
  }

  //-------------------------------------------------------------------------

  private updateFormControlFromMonths() {
    let list : number[] = []

    for (let i=0; i<this.selMonths.length; i++) {
      if (this.selMonths[i]) {
        list = [...list, i ]
      }
    }

    this.monthsControl.setValue(list)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Chart spec
  //---
  //-------------------------------------------------------------------------

  options = {
    chart: <ApexChart>{
      type: "heatmap",
      height: 350,
      animations: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: this.onChartClick,
      }
    },

    series: [],

    dataLabels: {
      enabled: this.showLabels
    },

    plotOptions: {},

    xaxis: {
      categories: categories
    },

    legend: {
      show: false
    },
  }

  //-------------------------------------------------------------------------

  barOptions = {
    chart: <ApexChart>{
      type: "bar",
      height: 400,
      toolbar: {
        show: false
      },
    },
    series: <ApexAxisChartSeries>[],

    plotOptions: {
      bar: {
        colors: {
          ranges:[
            {
              from: -3000000,
              to: 0,
              color: '#E04040'
            },
            {
              from: 0,
              to: 3000000,
              color: '#40E040'
            }
          ]
        }
      }
    },

    dataLabels: {
      enabled: false
    },

    xaxis: <ApexXAxis>{
      categories: []
    }
  }
}

//=============================================================================

class ExcludedPeriod {
  year : number
  month: number

  //-------------------------------------------------------------------------

  constructor(value : string) {
    if (value.length == 4) {
      this.year = Number(value)
      this.month= 0
    }
    else {
      this.year  = Number(value.substring(0,4))
      this.month = Number(value.substring(5))
    }

    if (Number.isNaN(this.month) || Number.isNaN(this.year)) {
      console.log("ExcludedPeriod: either month or year is NaN!", this.month, this.year)
    }
  }

  //-------------------------------------------------------------------------

  shouldBeExcluded(month : number, year : number) : boolean {
    if (year == this.year) {
      return (this.month == 0) || (this.month == month)
    }

    return false
  }
}

//=============================================================================

class ExcludedSet {
  periods : ExcludedPeriod[] = []

  //-------------------------------------------------------------------------

  constructor(items : string[]) {
    items.forEach( item => {
      this.periods = [...this.periods, new ExcludedPeriod(item)]
    })
  }

  //-------------------------------------------------------------------------

  shouldBeExcluded(dpe:DataPointEntry) : boolean {
    let shouldExclude = false

    this.periods.forEach( ep => {
      if (ep.shouldBeExcluded(dpe.month, dpe.year)) {
        shouldExclude = true
      }
    })

    return shouldExclude
  }
}

//=============================================================================

class Profit {
  gross     : number = 0
  net       : number = 0
  avgGross  : number = 0
  avgNet    : number = 0
  operation : number = 0
}

//=============================================================================

class SelectedSlot {
  dayIndex  : number = -1
  slotIndex : number = -1
  period    : string = ""

  constructor(day : number, slot : number, dow : string) {
    this.dayIndex  = day
    this.slotIndex = slot
    this.period = dow +" "+ categories[slot]
  }
}

//=============================================================================

export let categories = [
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
]

//=============================================================================

class SlotTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    return categories[value]
  }
}

//=============================================================================

export class MonthsTranscoder implements Transcoder {
  transcode(value: boolean[], row?: any): string {
    let res : string[] = []

    for (let i=0; i<12; i++) {
      if (value[i]) {
        res = [...res, this.labelService.getLabel("list.monShort")[i] ]
      }
    }

    return res.join("  -  ")
  }

  constructor(private labelService:LabelService) {}
}

//=============================================================================

class MoneyTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    return value +" " //+ this.outer.result.brokerProduct.currencyCode
  }

  constructor(private outer:BiasAnalysisPlaygroundPanel) {}
}

//=============================================================================
