import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { Subscription } from "rxjs";

@Directive({
    selector: '[showIfLoggedIn]'
})
export class ShowIfLoggedInDirective implements OnInit, OnDestroy {
    private subs = new Subscription();

    constructor(
        private templateRef: TemplateRef<any>,
        private naoUsersService: NaoUserAccessService,
        private container: ViewContainerRef
    ) {
    }

    public ngOnInit(): void {
        // -->Subscribe: to logged in and disable the button
        this.subs.add(
            this.naoUsersService.isLoggedIn$.subscribe((isLoggedIn) => {
                this.checkShowHide(isLoggedIn);
            }),
        );
    }

    /**
     * Check: if we need to show or hide this element
     */
    public checkShowHide(value: boolean): void {
        value ? this.container.createEmbeddedView(this.templateRef) : this.container.clear();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
