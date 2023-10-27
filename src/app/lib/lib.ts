//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {StringLib} from "./string-lib";
import {ChartLib}  from "./chart-lib";

//=============================================================================

export class Lib {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	public static str  = new StringLib();
  public static chart = new ChartLib();
}

//=============================================================================
