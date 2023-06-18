import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/language/services/language.service';
import { CurrencyService } from '../../../shared/currency/services/currency.service';
import { CompareService } from '../../../services/compare.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
    constructor(
        public language: LanguageService,
        public currency: CurrencyService,
        public compare: CompareService,
    ) { }
}
