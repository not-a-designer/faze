import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';

import { DefaultImageDirective } from './default-image/default-image.directive';


@NgModule({
    declarations: [ DefaultImageDirective ],

    imports: [ CommonModule ],

    exports: [ DefaultImageDirective ]
})
export class DirectivesModule {}