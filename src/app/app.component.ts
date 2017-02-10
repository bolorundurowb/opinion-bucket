/**
 * Created by bolorundurowb on 2/10/17.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'pm-app',
  template: `
        <div><h1>{{pageTitle}}</h1>
          
        </div>
    `
})
export class AppComponent {
  pageTitle: string = 'Acme Product Management';
}
