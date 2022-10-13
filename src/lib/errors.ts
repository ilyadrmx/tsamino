/** Default AminoApps API error */
export class AminoAppsError extends Error {
    message: string;
    name: string;
    response: string | null;

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