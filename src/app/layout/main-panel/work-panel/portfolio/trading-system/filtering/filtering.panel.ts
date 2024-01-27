//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';
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
  FilterAnalysisResponse,
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

//=============================================================================

@Component({
  selector    :   'trading-system-filtering',
  templateUrl :   './filtering.panel.html',
  styleUrls   : [ './filtering.panel.scss' ],
  imports: [CommonModule, RouterModule, MatExpansionModule, MatIconModule, MatFormFieldModule, FormsModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatSlideToggleModule, MatTabsModule, MatButtonModule,
    MatDividerModule, SelectTextRequired],
  standalone  : true
})

//=============================================================================

export class FilteringPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  filters             = new TradingFilters()
  tradingSystem  = new TradingSystemSmall();

  chart : any;

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
              private portfolioService: PortfolioService) {

    super(eventBusService, labelService, router, "portfolio.filtering");
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

  onShortLongPeriodsChange(e : MatSlideToggleChange) {
    this.filters.shoLonEnabled = e.checked;
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
  }

  //-------------------------------------------------------------------------

  onSaveClick() {
    this.portfolioService.setTradingFilters(this.tsId, this.filters).subscribe(
      result => {

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
    this.destroyChart();

    this.portfolioService.runFilterAnalysis(this.tsId, req).subscribe(
      result => {
        this.analysis      = result;
        this.filters       = result.filters;
        this.tradingSystem = result.tradingSystem;
        this.chart         = this.createChart(result);
      }
    )
  }

  //-------------------------------------------------------------------------

  private createChart(res: FilterAnalysisResponse): Chart {
      let config = Lib.chart.lineConfig("$")
      let days = Lib.chart.formatDays(res.equities.days);

      let datasets: any[] = [
        Lib.chart.buildDataSet(this.loc("chart.unfProfit"), days, res.equities.unfilteredProfit),
        Lib.chart.buildDataSet(this.loc("chart.filProfit"), days, res.equities.filteredProfit),
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

      if (res.filters.equAvgEnabled) {
        ds = Lib.chart.buildDataSet(this.loc("chart.average"), days, res.equities.average);
        ds.type="scatter"
        datasets = [...datasets, ds];
      }

      config.data.datasets = datasets;
      config.data.labels   = days;

      return new Chart("filteringChart", config);
  }

  //-------------------------------------------------------------------------

  private destroyChart() {
    if (this.chart != undefined) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }
}

//=============================================================================
