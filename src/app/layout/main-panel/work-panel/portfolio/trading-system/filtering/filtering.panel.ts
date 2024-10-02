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
  FilterAnalysisResponse, FilterRun, Plot, Summary,
  TradingFilters, TradingSystemSmall,
} from "../../../../../../model/model";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {Chart} from "chart.js/auto";
import {Lib} from "../../../../../../lib/lib";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {SimpleTablePanel} from "../../../../../../component/panel/simple-table/simple-table.panel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {OptimizeProgressDialog} from "./optimize/progress.dialog";
import {OptimizeResultDialog} from "./optimize/result.dialog";
import {OptimizeParameterDialog} from "./optimize/parameter.dialog";

//=============================================================================

@Component({
  selector    :   'trading-system-filtering',
  templateUrl :   './filtering.panel.html',
  styleUrls   : [ './filtering.panel.scss' ],
  imports: [CommonModule, RouterModule, MatExpansionModule, MatIconModule, MatFormFieldModule, FormsModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatSlideToggleModule, MatTabsModule, MatButtonModule,
    MatDividerModule, SelectTextRequired, MatGridListModule, SimpleTablePanel, MatDialogModule],
  standalone  : true
})

//=============================================================================

export class FilteringPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  filters           = new TradingFilters()
  tradingSystem= new TradingSystemSmall()
  summary               = new Summary()

  equityChart     : any;
  activationChart : any;

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
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.tsId = Number(this.route.snapshot.paramMap.get("id"));
    this.callService(new FilterAnalysisRequest())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onPositiveProfitChange(e : MatSlideToggleChange) {
    this.filters.posProEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onOldVsNewChange(e : MatSlideToggleChange) {
    this.filters.oldNewEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onWinningPercentageChange(e : MatSlideToggleChange) {
    this.filters.winPerEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onEquityAverageChange(e : MatSlideToggleChange) {
    this.filters.equAvgEnabled = e.checked;
  }

  //-------------------------------------------------------------------------

  onRunClick() {
    this.callService(new FilterAnalysisRequest(this.filters))
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
    this.portfolioService.setTradingFilters(this.tsId, this.filters).subscribe(
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
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private callService(req : FilterAnalysisRequest) {
    this.destroyCharts();

    this.portfolioService.runFilterAnalysis(this.tsId, req).subscribe(
      result => {
        this.analysis       = result;
        this.filters        = result.filters;
        this.tradingSystem  = result.tradingSystem;
        this.summary        = result.summary;
        this.equityChart    = this.createEquityChart(result);
        this.activationChart= this.createActivationChart(result);

        this.summaryData = this.buildSummary(this.summary)
      }
    )
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

  private createEquityChart(res: FilterAnalysisResponse): Chart {
      let config = Lib.chart.lineConfig("$")
      let days = Lib.chart.formatDays(res.equities.days);

      let datasets: any[] = [
        Lib.chart.buildDataSet(this.loc("chart.unfEquity"), days, res.equities.unfilteredEquity),
        Lib.chart.buildDataSet(this.loc("chart.filEquity"), days, res.equities.filteredEquity),
      ];

      //--- Unfiltered drawdown

      let ds = Lib.chart.buildDataSet(this.loc("chart.unfDrawdown"), days, res.equities.unfilteredDrawdown);
      ds.fill = {
        target: {value: 0},
        below: "#E0808080"
      };

      datasets = [...datasets, ds];

      //--- Filtered drawdown

      ds = Lib.chart.buildDataSet(this.loc("chart.filDrawdown"), days, res.equities.filteredDrawdown);
      ds.fill = {
        target: {value: 0},
        below: "#C0808080"
      };

      datasets = [...datasets, ds];

      //--- Moving average

      if (res.equities.average) {
        let avg = res.equities.average
        ds = Lib.chart.buildDataSet(this.loc("chart.average"), Lib.chart.formatDays(avg.days), avg.values);
        ds.type="scatter"
        datasets = [...datasets, ds];
      }

      config.data.datasets = datasets;
      config.data.labels   = days;

      return new Chart("equityChart", config);
  }

  //-------------------------------------------------------------------------

  private createActivationChart(res: FilterAnalysisResponse): Chart {
    let config = Lib.chart.lineConfig("")
    let days = Lib.chart.formatDays(res.equities.days);

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

    let ds = this.addActivationDatasetBase(res.equities.days, res.equities.filterActivation, "chart.filterActivation", factor)
    datasets = [...datasets, ds];

    config.data.datasets = datasets;
    config.data.labels   = days;

    return new Chart("activationChart", config);
  }

  //-------------------------------------------------------------------------

  private addActivationDataset(plot : Plot, label : string, factor : number) : any {
    return this.addActivationDatasetBase(plot.days, plot.values, label, factor)
  }

  //-------------------------------------------------------------------------

  private addActivationDatasetBase(days:number[], values:number[], label : string, factor : number) : any {
    for (let i=0; i<values.length; i++) {
      values[i] += factor
    }

    let ds = Lib.chart.buildDataSet(this.loc(label), Lib.chart.formatDays(days), values);

    ds.step    = true
    ds.stepped = "before"

    return ds
  }

  //-------------------------------------------------------------------------

  private destroyCharts() {
    if (this.equityChart != undefined) {
      this.equityChart.destroy();
      this.equityChart = undefined;
    }

    if (this.activationChart != undefined) {
      this.activationChart.destroy();
      this.activationChart = undefined;
    }
  }

  //-------------------------------------------------------------------------

  private openParametersDialog() {
    const dialogRef = this.dialog.open(OptimizeParameterDialog, {
      minWidth: "1280px",
      data: {
        tsId  : this.tradingSystem.id,
        tsName: this.tradingSystem.name
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
      minWidth: "1024px",
      data: {
        tsId  : this.tradingSystem.id,
        tsName: this.tradingSystem.name
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let run : FilterRun = result["run"]
        if (run != null) {
          console.log("Got run to use: ")
          this.filters = this.convertRun(run)
          this.onRunClick()
        }
        else {
          this.openParametersDialog()
        }
      }
    })
  }

  //-------------------------------------------------------------------------

  private convertRun(run : FilterRun) : TradingFilters {
    let f = new TradingFilters()

    if (run.filterType == "posProfit") {
      f.posProEnabled = true
      f.posProDays    = run.days
    }

    else if (run.filterType == "oldVsNew") {
      f.oldNewEnabled = true
      f.oldNewOldDays = run.days
      f.oldNewNewDays = run.newDays
      f.oldNewOldPerc = run.percentage
    }

    else if (run.filterType == "winPerc") {
      f.winPerEnabled = true
      f.winPerDays    = run.days
      f.winPerValue   = run.percentage
    }

    else if (run.filterType == "equVsAvg") {
      f.equAvgEnabled = true
      f.equAvgDays    = run.days
    }

    else {
      console.log("Unknown filter type: "+ run.filterType)
    }

    return f
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
