/**
 * Default AminoApps API error
 * @property {string} message Error message
 * @property {string} name Error name
 * @property {string | null} response Response that caused an error
 */
export class AminoAppsError extends Error {
    /** Error message */
    message: string;

    /** Error name */
    name: string;

    /** Response that caused an error */
    response: string | null;

    /**
     * @param {string} message Err
     * @param {string} name
     * @param {string | null} response
     */
    constructor(message: string, name: string, response: string | null = null) {
        super(message);

        this.message = message;
        this.name = name;
        this.response = response;
    }
}

export class TemporaryBanError extends AminoAppsError {
    constructor(response: string) {
        super(
            "Temporary IP ban. Please retry later",
            "TemporaryBanError",
            response
        );
    }
}