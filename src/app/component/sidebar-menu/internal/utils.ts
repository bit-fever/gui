//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { TrackByFunction } from '@angular/core';

import { MenuItem } from '../model';

//=============================================================================

export const trackByItem: TrackByFunction<MenuItem> = (index, item) => {
  return item.id || index;
};

//=============================================================================
