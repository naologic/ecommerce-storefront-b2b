import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAboutUsComponent } from './page-about-us/page-about-us.component';
import { PageFaqComponent } from './page-faq/page-faq.component';
import { PageTermsComponent } from './page-terms/page-terms.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'about-us',
    },
    {
        path: 'about-us',
        component: PageAboutUsComponent,
    },
    {
        path: 'terms',
        component: PageTermsComponent,
    },
    {
        path: 'faq',
        component: PageFaqComponent,
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SiteRoutingModule { }
