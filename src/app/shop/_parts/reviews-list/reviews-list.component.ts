// import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
// import { BehaviorSubject, merge, of, Subject } from 'rxjs';
// import { FormControl } from '@angular/forms';
// import { ReviewsList } from '../../../../interfaces/list';
// import { ShopApi } from '../../../../api';
// import { UrlService } from '../../../../services/url.service';
// import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
// import {AppService} from "../../../../app.service";
// import {NaoSettingsInterface} from "@naologic/nao-interfaces";

// @Component({
//     selector: 'app-reviews-list',
//     templateUrl: './reviews-list.component.html',
//     styleUrls: ['./reviews-list.component.scss'],
// })
// export class ReviewsListComponent implements OnInit, OnDestroy {
//     private destroy$: Subject<void> = new Subject<void>();
//     private productId$: BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);
//     public appSettings: NaoSettingsInterface.Settings;

//     currentPage: FormControl = new FormControl(1);

//     list: ReviewsList|null = null;

//     @Input() set productId(value: number) {
//         if (value !== this.productId$.value) {
//             this.currentPage.setValue(1, { emitEvent: false });
//             this.productId$.next(value);
//         }
//     }

//     @HostBinding('class.reviews-list') classReviewsList = true;

//     constructor(
//         private shop: ShopApi,
//         public url: UrlService,
//         private appService: AppService,
//     ) { }

//     ngOnInit(): void {
//         // -->Set: app settings
//         this.appSettings = this.appService.settings.getValue();

//         this.productId$.pipe(
//             switchMap(productId => {
//                 if (!productId) {
//                     return of(null);
//                 }

//                 return merge(
//                     of(this.currentPage.value),
//                     this.currentPage.valueChanges,
//                 ).pipe(
//                     distinctUntilChanged(),
//                     switchMap(page => this.shop.getProductReviews(productId, {
//                         limit: 8,
//                         page,
//                     })),
//                 );
//             }),
//         ).pipe(
//             takeUntil(this.destroy$),
//         ).subscribe(x => this.list = x);
//     }

//     ngOnDestroy(): void {
//         this.destroy$.next();
//         this.destroy$.complete();
//     }

//     reload(): void {
//         this.productId$.next(this.productId$.value);
//     }
// }
