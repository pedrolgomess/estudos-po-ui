import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sample-po-page-dynamic-search-basic',
  templateUrl: './sample-po-page-dynamic-search-basic.component.html'
})
export class SamplePoPageDynamicSearchBasicComponent {

  @Output() quickSearch = new EventEmitter<string>();
  @Output() advancedSearch = new EventEmitter<any>();

  onQuickSearch(search: string) {
    this.quickSearch.emit(search);
  }

  onAdvancedSearch(filters: any) {
    this.advancedSearch.emit(filters);
  }
}
