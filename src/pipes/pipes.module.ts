import { NgModule } from '@angular/core';

import { CommonModule }        from '@angular/common';

import { CDVPhotoLibraryPipe } from './cdv-photo-library/cdv-photo-library.pipe';


@NgModule({
    declarations: [ CDVPhotoLibraryPipe ],

    imports: [ CommonModule ],
    
    exports: [ CDVPhotoLibraryPipe ]
})
export class PipesModule {}