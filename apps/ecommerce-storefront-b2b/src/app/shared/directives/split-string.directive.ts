import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[appSplitString]',
    exportAs: 'splitString',
})
export class SplitStringDirective {
    @Input() public set appSplitString(value: string) {
        this.parts = value.split('|');
    }

    private parts: string[] = [];

    constructor() { }

    /**
     * Get: part at the specified index
     */
    public getPart(index: number): string {
        return this.parts[index];
    }
}
