import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditTagComponent } from './edit-tag/edit-tag.component';

@NgModule({
    declarations: [EditTagComponent],
    imports: [CommonModule, SharedModule],
    exports: [EditTagComponent],
})
export class TagsModule {}
