import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type Task = () => Promise<void>;

interface LibrariesDef {
    [name: string]: Task;
}

@Injectable({
    providedIn: 'root',
})
export class ResourcesService {
    private loaded: { [url: string]: Promise<void>; } = {};
    private libraries: LibrariesDef = {
        photoSwipe: ResourcesService.parallel(
            this.styleTask('assets/vendor/photoswipe/photoswipe.css'),
            this.styleTask('assets/vendor/photoswipe/default-skin/default-skin.css'),
            this.scriptTask('assets/vendor/photoswipe/photoswipe.min.js'),
            this.scriptTask('assets/vendor/photoswipe/photoswipe-ui-default.min.js'),
        ),
    };

    /**
     * Run: tasks in series
     */
    static series(...tasks: Task[]): Task {
        // -->Get: and remove first task
        const task = tasks.shift();

        // -->Check: task
        if (!task) {
            // -->Resolve: promise
            return () => Promise.resolve();
        }

        // -->Run: other tasks in series after current task is completed
        return () => task().then(ResourcesService.series(...tasks));
    }

    /**
     * Run: tasks in parallel
     */
    static parallel(...tasks: Task[]): Task {
        // -->Check: tasks
        if (!tasks.length) {
            // -->Resolve: promise
            return () => Promise.resolve();
        }

        // -->Run: all tasks in parallel
        return () => Promise.all(tasks.map(task => task())).then(() => {});
    }

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) { }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Load: script
     */
    public loadScript(url: string): Promise<void> {
        return this.scriptTask(url)();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Load: style
     */
    public loadStyle(url: string): Promise<void> {
        return this.styleTask(url)();
    }

    /**
     * Load: library
     */
    public loadLibrary(library: string): Promise<void> {
        return this.libraries[library]();
    }

    /**
     * Append: script to document head
     */
    private scriptTask(url: string): Task {
        return () => {
            // -->Check: url property exists
            if (!this.loaded.hasOwnProperty(url)) {
                this.loaded[url] = new Promise<void>((resolve, reject) => {
                    // -->Create: script element
                    const script = this.document.createElement('script');

                    // -->Set: script events
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Loading error: ' + url));
                    // -->Set: script source property
                    script.src = url;

                    // -->Append: script element to document head
                    this.document.head.appendChild(script);
                });
            }

            return this.loaded[url];
        };
    }

    /**
     * Append: style to document head
     */
    private styleTask(url: string): Task {
        return () => {
            // -->Check: url property exists
            if (!this.loaded.hasOwnProperty(url)) {
                this.loaded[url] = new Promise<void>((resolve, reject) => {
                    // -->Create: link element
                    const link = this.document.createElement('link');

                    // -->Set: link events
                    link.onload = () => resolve();
                    link.onerror = () => reject(new Error('Loading error: ' + url));
                    // -->Set: link properties
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.href = url;

                    // -->Append: link element to document head
                    this.document.head.appendChild(link);
                });
            }

            return this.loaded[url];
        };
    }
}
