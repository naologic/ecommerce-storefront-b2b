export namespace NaoStreamInterface {
    /**
     * @sync
     *    > keep in sync with nao-mongo.interface.NaoQueryOptions
     */
    export interface NaoQueryOptions {
        /**
         * Set the docName to process
         */
        docName?: string;
        /**
         * Set the policy to process
         */
        accessPolicy?: string;
        /**
         * Sub-type for this document
         */
        subType?: string;
        /**
         * Rules for including sub-types in this document
         *    > null   @default > include all sub-types
         *    > []              > no sub-types
         *    > ['founder']     > include only sub-types from array
         */
        subTypeInclude?: string[];
        /**
         * Add immutable docs
         */
        immutable?: boolean;
        /**
         * Include deleted docs in the response
         */
        includeDeleted?: boolean;
        /**
         * Set a default projection (when needed)
         */
        projection?: any;
        /**
         * Return updated document (when needed)
         *    @WARNING: this was a bad idea. I replaced it with returnDocuments
         */
        returnOriginal?: boolean;
        /**
         * Return modified documents
         */
        returnDocuments?: boolean;
        /**
         * Set the cfpPath
         */
        cfpPath?: string;
        /**
         * Set the user mode
         */
        userMode?: string;
        /**
         * Set a session Id for this transaction
         */
        sessionId?: string;
        /**
         * A user session id
         *    @example
         *      const userSessionId = generateUUID();
         */
        userSessionId?: string;
        /**
         * Pass a transactionId and track it in other events
         */
        transactionId?: string;
        /**
         * Set an event log
         */
        eventLog?: string|EventLogRequest;
        /**
         * Add an activity to this request
         */
        activity?: ActivityRequest;
    }

    export interface ActivityRequest {
        /**
         * Name of the activity
         */
        activity: string; // 'due_date_added'
        /**
         * Extra data object
         *    > maximum 5 elements
         *    > no $ functions
         */
        extraData?: {
            [index: string]: any
        }
    }

    export interface EventLogRequest {
        /**
         * Event category
         */
        category: string;
    }
}


export namespace NaoDocumentInterface {
    /**
     * Set a default for nao query options
     */
    export function naoQueryOptionsDefault(extraData?: NaoStreamInterface.NaoQueryOptions): NaoStreamInterface.NaoQueryOptions {
        return { ...{ docName: 'doc' }, ...(extraData || {}) };
    }
}
