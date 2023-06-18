import { NgModule } from '@angular/core';
import { SiteRoutingModule } from './site.routing';
import { SharedModule } from '../shared/shared.module';
import { PageAboutUsComponent } from './page-about-us/page-about-us.component';
import { PageFaqComponent } from './page-faq/page-faq.component';
import { PageTermsComponent } from './page-terms/page-terms.component';

@NgModule({
    declarations: [
        PageAboutUsComponent,
        PageFaqComponent,
        PageTermsComponent,
    ],
    imports: [
        SiteRoutingModule,
        SharedModule
    ],
})
export class SiteModule { }
