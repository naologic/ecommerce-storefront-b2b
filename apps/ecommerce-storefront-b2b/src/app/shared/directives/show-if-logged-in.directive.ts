import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { NaoUserAccessService } from "@naologic/nao-user-access";

@Directive({
    selector: '[showIfLoggedIn]'
})
export class ShowIfLoggedInDirective {

    constructor(
        private templateRef: TemplateRef<any>,
        private naoUsersService: NaoUserAccessService,
        private container: ViewContainerRef
    ) {
        this.naoUsersService.isLoggedIn() ? this.container.createEmbeddedView(this.templateRef) : this.container.clear();
    }
}
