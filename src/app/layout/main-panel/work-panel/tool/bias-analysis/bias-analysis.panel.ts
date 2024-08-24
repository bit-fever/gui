//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButton, MatButtonModule, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {
  BiasSummaryResponse,
  DataPointDowList,
  DataPointEntry,
  DataInstrumentFull,
  BrokerProduct
} from "../../../../../model/model";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {InventoryService} from "../../../../../service/inventory.service";
import {InstrumentSelectorPanel} from "../../../../../component/form/instrument-selector/instrument-selector.panel";
import {CollectorService} from "../../../../../service/collector.service";
import {
  ApexAxisChartSeries,
  ApexChart, ApexDataLabels,
  ApexOptions,
  ApexPlotOptions, ApexXAxis,
  NgApexchartsModule
} from "ng-apexcharts";
import {
  MatChipGrid,
  MatChipInput,
  MatChipListbox,
  MatChipOption, MatChipRemove, MatChipRow,
  MatChipSelectionChange
} from "@angular/material/chips";
import {SelectTextRequired} from "../../../../../component/form/select-required/select-text-required";
import {ChipSetTextComponent} from "../../../../../component/form/chip-text-set/chip-set-text";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

//=============================================================================

@Component({
  selector    :     'bias-analyzer',
  templateUrl :   './bias-analysis.panel.html',
  styleUrls   : [ './bias-analysis.panel.scss' ],
  imports: [CommonModule, InstrumentSelectorPanel, MatButton, MatIcon, MatFabButton, NgApexchartsModule, MatChipListbox, MatChipOption, SelectTextRequired, MatMiniFabButton, ChipSetTextComponent, MatChipGrid, MatChipInput, MatChipRemove, MatChipRow, MatFormField, MatLabel, MatError, MatIconButton, MatInput, MatSuffix, ReactiveFormsModule],
  standalone  : true
})

//=============================================================================

export class BiasAnalysisPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  currIdf   : DataInstrumentFull = {}
  brokers   : BrokerProduct[] = []
  showLabels: boolean = false

  selBroker?: BrokerProduct
  result    : BiasSummaryResponse = { result: [] }

  brokersMap : Map<number, BrokerProduct> = new Map()
  selMonths  : boolean[] = [ true, true, true, true, true, true, true, true, true, true, true, true ]
  excludedSet: string[] = []

  startPeriod : string = ""
  endPeriod   : string = ""

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService,
              private collectorService: CollectorService) {

    super(eventBusService, labelService, router, "tool.biasAnalysis");

    this.inventoryService.getBrokerProducts(true).subscribe( result => {
      this.brokers = result.result
      this.brokersMap = new Map()
      this.brokers.forEach( pb => {
        if (pb.id != null) {
          this.brokersMap.set(pb.id, pb)
          pb.name = pb.name +" ("+pb.pointValue +" "+ pb.currencyCode +")"
        }
      })
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {}

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  onInstrumentSelected(idf : DataInstrumentFull) {
    this.currIdf= idf

    if (this.currIdf?.id) {
      this.collectorService.getBiasSummary(this.currIdf.id).subscribe( result => {
        this.result = result
        this.options.series = this.setupSeries(result, this.selMonths, this.excludedSet)
      })
    }
  }

  //-------------------------------------------------------------------------

  onLabelsChange(e: MatChipSelectionChange) {
    this.showLabels = e.selected;
    // @ts-ignore
    this.options.dataLabels = <ApexDataLabels>{
      enabled: this.showLabels,
      style: {
        fontSize: '12px',
        fontWeight: 'plain',
        // colors: [ '#000000' ]
      }
    }
  }

  //-------------------------------------------------------------------------

  onBrokerChange(key: number) {
    this.selBroker = this.brokersMap.get(key)
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

  //-------------------------------------------------------------------------

  onMonthChange(e: MatChipSelectionChange, month: number) {
    this.selMonths[month] = e.selected
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

  //-------------------------------------------------------------------------

  onChartClick = (e: any, chart?: any, options?: any) => {
    let serieIndex : number = options.seriesIndex
    let pointIndex : number = options.dataPointIndex

    console.log("Heatmap cell clicked: serie=", serieIndex, " point=", pointIndex)

    let entries = this.result.result[6-serieIndex].slots[pointIndex].list
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
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

  //-------------------------------------------------------------------------

  onMonthRight() {
    for (let i=0; i<12; i++) {
      if (this.selMonths[i]) {
        this.selMonths[i]          = false
        this.selMonths[(i+1) % 12] = true
        this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
        return
      }
    }
  }

  //-------------------------------------------------------------------------

  onExcludedChange(excludes : string[]) {
    console.log("EXCLUDED CHANGED: ", excludes)
    this.options.series = this.setupSeries(this.result, this.selMonths, this.excludedSet)
  }

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

  onSetStart() {

  }

  //-------------------------------------------------------------------------

  onSetEnd() {

  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private setupSeries(result : BiasSummaryResponse|null, months : boolean[], excludes : string[]) : any {
    if (result == undefined || this.selBroker == undefined) {
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

    this.options.plotOptions = this.buildPlotOptions(minMax)
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
              delta += dpe.delta * this.selBroker?.pointValue
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

  private buildPlotOptions(mm : MinMax) : ApexPlotOptions {
    return {
      heatmap: {
        enableShades: false,
        colorScale: {
          min: mm.minVal,
          max: mm.maxVal,
          ranges: [
            {
              from: mm.minVal*4/4,
              to:   mm.minVal*3/4,
              color: '#FF1010',
              name: 'very negative',
            },
            {
              from: mm.minVal*3/4,
              to:   mm.minVal*2/4,
              color: '#E03030',
              name: 'very negative',
            },
            {
              from: mm.minVal*2/4,
              to:   mm.minVal*1/4,
              color: '#D06060',
              name: 'very negative',
            },
            {
              from: mm.minVal*1/4,
              to: -0.0000001,
              color: '#B08080',
              name: 'negative',
            },
            {
              from: 0,
              to: 0,
              color: '#808080',
              name: 'zero',
            },
            {
              from: 0.000001,
              to: mm.maxVal*1/4,
              color: '#80B080',
              name: 'positive',
            },
            {
              from: mm.maxVal*1/4,
              to: mm.maxVal*2/4,
              color: '#60D060',
              name: 'very positive',
            },
            {
              from: mm.maxVal*2/4,
              to: mm.maxVal*3/4,
              color: '#30E030',
              name: 'very positive',
            },
            {
              from: mm.maxVal*3/4,
              to: mm.maxVal*4/4,
              color: '#10FF10',
              name: 'very positive',
            }
          ]
        }
      }
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
      this.barOptions.series = []
    }
  }

  //-------------------------------------------------------------------------

  private calcDelta(e : DataPointEntry) : number {
    // @ts-ignore
    return e.delta * this.selBroker?.pointValue
  }

  //-------------------------------------------------------------------------
  //---
  //--- Chart spec
  //---
  //-------------------------------------------------------------------------

  categories = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
  ]

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
      categories: this.categories
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
              color: '#F00000'
            },
            {
              from: 0,
              to: 3000000,
              color: '#00F000'
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

class MinMax {
  minVal : number =  3000000
  maxVal : number = -300000

  update(delta : number) {
    this.minVal = Math.min(this.minVal, delta)
    this.maxVal = Math.max(this.maxVal, delta)
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
