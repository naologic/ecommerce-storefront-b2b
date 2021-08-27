import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface SectionHeaderGroup {
    label: string;
}

export interface SectionHeaderLink {
    label: string;
    url: string;
}

@Component({
    selector: 'app-section-header',
    templateUrl: './section-header.component.html',
    styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent implements OnInit {
    @Input() public sectionTitle: string = '';
    @Input() public arrows = false;
    @Input() public groups: SectionHeaderGroup[] = [];
    @Input() public links: SectionHeaderLink[] = [];
    @Input() public currentGroup?: SectionHeaderGroup;

    @Output() public prev: EventEmitter<void> = new EventEmitter<void>();
    @Output() public next: EventEmitter<void> = new EventEmitter<void>();
    @Output() public changeGroup: EventEmitter<SectionHeaderGroup> = new EventEmitter<SectionHeaderGroup>();

    constructor() { }

    public ngOnInit(): void {
        if (this.currentGroup === undefined && this.groups.length > 0) {
            this.currentGroup = this.groups[0];
        }
    }

    /**
     * Handle: section header group item click events
     */
    public onGroupClick(group: SectionHeaderGroup): void {
        // -->Check: if action is needed
        if (this.currentGroup !== group) {
            this.currentGroup = group;
            this.changeGroup.emit(group);
        }
    }
}
