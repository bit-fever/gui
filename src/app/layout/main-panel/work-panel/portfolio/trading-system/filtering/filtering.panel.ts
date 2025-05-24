//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {
  FilterAnalysisRequest,
  FilterAnalysisResponse, FilterRun, Serie, Summary,
  TradingFilter, TradingSystemSmall,
} from "../../../../../../model/model";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {Lib} from "../../../../../../lib/lib";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {SimpleTablePanel} from "../../../../../../component/panel/simple-table/simple-table.panel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {OptimizeProgressDialog} from "./optimize/progress/progress.dialog";
import {OptimizeResultDialog} from "./optimize/result/result.dialog";
import {OptimizeParameterDialog} from "./optimize/parameter/parameter.dialog";
import {ChartComponent} from "ng-apexcharts";
import {buildActivationChartOptions, buildEquityChartOptions} from "./charts-config";
import {DialogData} from "./optimize/dialog-data";
import {MatCardModule} from "@angular/material/card";
import {FlatButton} from "../../../../../../component/form/flat-button/flat-button";
import {ChartOptions} from "../../../../../../lib/chart-lib";
import {InputTextOptional} from "../../../../../../component/form/input-text-optional/input-text-optional";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";

//=============================================================================

@Component({
    selector: 'trading-system-filtering',
    templateUrl: './filtering.panel.html',
    styleUrls: ['./filtering.panel.scss'],
  imports: [CommonModule, RouterModule, MatExpansionModule, MatIconModule, MatFormFieldModule, FormsModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatSlideToggleModule, MatTabsModule, MatButtonModule,
    MatDividerModule, SelectRequired, MatGridListModule, SimpleTablePanel, MatDialogModule, ChartComponent, MatCardModule,
    FlatButton, InputTextOptional, InputNumberRequired]
})

//=============================================================================

export class FilteringPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  selectedPeriod : number = 0
  periods        : any

  startDate          : string|undefined
  startDateDisplayed : string|undefined

  filter             = new TradingFilter()
  tradingSystem= new TradingSystemSmall()
  summary              = new Summary()

  equityChartOptions : ChartOptions
  activChartOptions  : ChartOptions

  summaryColumns: FlexTableColumn[] = [];
  summaryData   : SummaryRow[]      = []

  @ViewChild("table") table : FlexTablePanel<SummaryRow>|null = null;

  //-------------------------------------------------------------------------

  private tsId : number = 0;
  private analysis = new FilterAnalysisResponse();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private route           : ActivatedRoute,
              private snackBar        : MatSnackBar,
              private portfolioService: PortfolioService,
              public  dialog          : MatDialog) {

    super(eventBusService, labelService, router, "portfolio.filtering");

    let ts = this.labelService.getLabel("page.portfolio.filtering.summ");

    this.summaryColumns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "unfiltered"),
      new FlexTableColumn(ts, "filtered")
    ]

    this.equityChartOptions = buildEquityChartOptions    (this.loc("equities"), this.onChartClick)
    this.activChartOptions  = buildActivationChartOptions(this.loc("activation"))
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.tsId      = Number(this.route.snapshot.paramMap.get("id"));
    this.periods   = this.labelMap("periods");
    this.callService(new FilterAnalysisRequest())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(value: number) {
    if (value == -1) {
    }
    else if (value == 0) {
      this.startDate          = undefined
      this.startDateDisplayed = undefined
      this.setAnnotationDate(undefined)
    }
    else {
      let date = this.findDateFromDays(value)
      this.startDate          = date.toISOString()
      this.startDateDisplayed = this.startDate.substring(0, 10)
      this.setAnnotationDate(date)
    }
  }

  //-------------------------------------------------------------------------

  onPositiveProfitChange(e : MatSlideToggleChange) {
    this.filter.posProEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onOldVsNewChange(e : MatSlideToggleChange) {
    this.filter.oldNewEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onWinningPercentageChange(e : MatSlideToggleChange) {
    this.filter.winPerEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onEquityAverageChange(e : MatSlideToggleChange) {
    this.filter.equAvgEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onTrendlineChange(e : MatSlideToggleChange) {
    this.filter.trendlineEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onDrawdownChange(e : MatSlideToggleChange) {
    this.filter.drawdownEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onRunClick() {
    this.callService(new FilterAnalysisRequest(this.startDate, this.filter))
  }

  //-------------------------------------------------------------------------

  onOptimizeClick() {
    this.portfolioService.getFilterOptimizationInfo(this.tsId).subscribe(
      result => {
        if (result.status == "idle") {
          this.openParametersDialog()
        }
        else if (result.status == "running"){
          this.openProgressDialog()
        }
        else {
          this.openResultDialog()
        }
      }
    )
  }

  //-------------------------------------------------------------------------

  onSaveClick() {
    this.portfolioService.setTradingFilters(this.tsId, this.filter).subscribe(
      result => {
        this.snackBar.open(this.loc("filterSaved"), undefined, { duration: 3000 })
      }
    )
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    this.callService(new FilterAnalysisRequest());
  }

  //-------------------------------------------------------------------------

  onChartClick = (e: any, chart?: any, options?: any) => {
    if (this.analysis.equities.time.length > 0) {
      this.selectedPeriod     = -1
      this.startDate          = this.analysis.equities.time[options.dataPointIndex]
      this.startDateDisplayed = this.startDate.substring(0,10)
      this.setAnnotationDate(new Date(this.startDate))
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private callService(req : FilterAnalysisRequest) {
    console.log("Calling service")
    this.portfolioService.runFilterAnalysis(this.tsId, req).subscribe(
      result => {
        this.analysis       = result;
        this.filter         = result.filter;
        this.tradingSystem  = result.tradingSystem;
        this.summary        = result.summary;
        this.summaryData    = this.buildSummary(this.summary)
        this.createEquityChart(result);
        this.createActivationChart(result);
      }
    )
  }

  //-------------------------------------------------------------------------

  private findDateFromDays(daysBack : number) : Date {
    let now   = new Date().getTime()
    let delta = daysBack * 24 * 3600 * 1000
    let past    = new Date(now-delta)

    return new Date(past)
  }

  //-------------------------------------------------------------------------

  private setAnnotationDate(d : Date|undefined) {
    let date = undefined
    let text = ""

    if (d != undefined) {
      date = d.getTime()
      text = d.toISOString().substring(0, 10)
    }

    this.equityChartOptions.annotations = {
      xaxis: [
        {
          x: date,
          borderColor: '#775DD0',
          label: {
            style: {
              color: '#000000',
            },
            text: text
          }
        }
      ]
    }
  }

  //-------------------------------------------------------------------------

  private buildSummary(s : Summary) : SummaryRow[] {
    return [
      new SummaryRow(this.loc("summ.netProfit"),    String(s.unfProfit),       String(s.filProfit)),
      new SummaryRow(this.loc("summ.maxDrawdown"),  String(s.unfMaxDrawdown),  String(s.filMaxDrawdown)),
      new SummaryRow(this.loc("summ.winningPerc"),  s.unfWinningPerc+ " %", s.filWinningPerc +" %"),
      new SummaryRow(this.loc("summ.averageTrade"), String(s.unfAverageTrade), String(s.filAverageTrade))
    ]
  }

  //-------------------------------------------------------------------------

  private createEquityChart(res: FilterAnalysisResponse) {
    let e = res.equities

      let datasets = [
        Lib.chart.buildDataset(this.loc("chart.unfEquity"),   e.time, e.unfilteredEquity),
        Lib.chart.buildDataset(this.loc("chart.filEquity"),   e.time, e.filteredEquity),
        Lib.chart.buildDataset(this.loc("chart.unfDrawdown"), e.time, e.unfilteredDrawdown, true),
        Lib.chart.buildDataset(this.loc("chart.filDrawdown"), e.time, e.filteredDrawdown, true),
      ]

      //--- Moving average

      if (res.equities.average) {
        let avg = res.equities.average
        datasets = [...datasets, Lib.chart.buildDataset(this.loc("chart.average"), e.time, avg.values) ]
      }

      this.equityChartOptions.series = datasets
  }

  //-------------------------------------------------------------------------

  private createActivationChart(res: FilterAnalysisResponse) {
    let datasets: any[] = [
    ];

    //--- Average activation

    let factor = 0

    if (res.activations.equityVsAverage) {
      let ds = this.addActivationDataset(res.activations.equityVsAverage, "chart.equOverAvg", factor)
      datasets = [...datasets, ds];
      factor += 2
    }

    if (res.activations.positiveProfit) {
      let ds = this.addActivationDataset(res.activations.positiveProfit, "chart.positProfit", factor)
      datasets = [...datasets, ds];
      factor += 2
    }

    if (res.activations.oldVsNew) {
      let ds = this.addActivationDataset(res.activations.oldVsNew, "chart.oldVsNew", factor)
      datasets = [...datasets, ds];
      factor += 2
    }

    if (res.activations.winningPercentage) {
      let ds = this.addActivationDataset(res.activations.winningPercentage, "chart.winningPerc", factor)
      datasets = [...datasets, ds];
      factor += 2
    }

    if (res.activations.trendline) {
      let ds = this.addActivationDataset(res.activations.trendline, "chart.trendline", factor)
      datasets = [...datasets, ds];
      factor += 2
    }

    let ds = this.addActivationDatasetBase(res.equities.time, res.equities.filterActivation, "chart.filterActivation", factor)
    datasets = [...datasets, ds];

    this.activChartOptions.series = datasets;
  }

  //-------------------------------------------------------------------------

  private addActivationDataset(serie : Serie, label : string, factor : number) : any {
    return this.addActivationDatasetBase(serie.time, serie.values, label, factor)
  }

  //-------------------------------------------------------------------------

  private addActivationDatasetBase(time:any[], values:number[], label : string, factor : number) : any {
    for (let i=0; i<values.length; i++) {
      values[i] += factor
    }

    let ds = Lib.chart.buildDataset(this.loc(label), time, values);

    return ds
  }

  //-------------------------------------------------------------------------

  private openParametersDialog() {
    const dialogRef = this.dialog.open(OptimizeParameterDialog, {
      minWidth : "1280px",
      data: <DialogData>{
        tsId     : this.tradingSystem.id,
        tsName   : this.tradingSystem.name,
        startDate: this.startDate,
        baseline : this.filter
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openProgressDialog()
      }
    })
  }

  //-------------------------------------------------------------------------

  private openProgressDialog() {
    const dialogRef = this.dialog.open(OptimizeProgressDialog, {
      minWidth: "1024px",
      data: {
        tsId  : this.tradingSystem.id,
        tsName: this.tradingSystem.name
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openResultDialog()
      }
    })
  }

  //-------------------------------------------------------------------------

  private openResultDialog() {
    const dialogRef = this.dialog.open(OptimizeResultDialog, {
      minWidth: "1600px",
      data: {
        tsId    : this.tradingSystem.id,
        tsName  : this.tradingSystem.name,
        baseline: this.filter
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let run : FilterRun = result["run"]
        if (run != null) {
          console.log("Got run to use: ")
          this.filter = run.filter
          this.onRunClick()
        }
        else {
          this.openParametersDialog()
        }
      }
    })
  }
}

//=============================================================================

class SummaryRow {
  name?       : string
  unfiltered? : string
  filtered?   : string

  constructor(name:string, unfiltered:string, filtered:string) {
    this.name       = name
    this.unfiltered = unfiltered
    this.filtered   = filtered
  }
}

//=============================================================================
