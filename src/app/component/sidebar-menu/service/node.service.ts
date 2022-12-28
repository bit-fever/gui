//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { NodeComponent } from '../component/node/node.component';

//=============================================================================

@Injectable()
export class NodeService {
  public openedNode = new Subject<{ nodeComponent: NodeComponent; nodeLevel: number }>();
  public toggleIconClasses?: string;
}

//=============================================================================
