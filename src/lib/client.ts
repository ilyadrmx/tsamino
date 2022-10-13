import {Request} from "./request.js";
import * as Models from "./model.js";
import * as Util from "./util.js";
import * as Const from "./const.js";
import {AminoAppsError} from "./errors.js";

export class Client {
    // Client's device ID used in "NDCDEVICEID" header
    deviceId: string | null;

    // Client's session ID used in "NDCAUTH" header
    sid: string | null;

    // Client's NDC used in API path
    ndcId = 0;

    // Client's user agent used in "User-Agent" header
    userAgent = Client.USER_AGENT;

    // Debug requests
    debug = false;

    // Default user agent
    static USER_AGENT = "Mozilla/5.0 (Linux; Android 10; SM-G980F Build/QP1A.190711.020; wv)" + " " +
        "AppleWebKit/537.36 (KHTML, like Gecko)" + " " +
        "Version/4.0" + " " +
        "Chrome/78.0.3904.96" + " " +
        "Mobile Safari/537.36";

    // Client's request executor and builder
    request: Request;

    /**
     * Class representing AminoApps API client
     * @description Main library class that provides and executes calls to the AminoApps API
     * @param deviceId Client's device ID used in "NDCDEVICEID" header
     * @param debug Debug requests
     */
    constructor(deviceId: string = Util.generateDeviceId(), debug: boolean = false) {
        this.deviceId = deviceId;
        this.sid = null;
        this.debug = debug;

        this.request = new Request(this);
    }

    async loginWithEmail(
        email: string,
        password: string
    ): Promise<Models.LoginResponse> {
        const body: Models.LoginWithEmail = {
            email: email,
            secret: "0 " + password,
            clientType: 100,
            deviceID: this.deviceId!,
            action: "normal",
            timestamp: Date.now()
        }

        const response = await this.request.call(
            "/auth/login", {
                method: Request.METHOD_POST,
                ndcId: 0,
                contentType: Request.HeaderValues.CONTENT_TYPE_APPLICATION_JSON,
                data: JSON.stringify(body)
            } as Models.RequestParams
        );

        const textResponse = await response.text();
        const basicResponse: Models.BasicResponse = JSON.parse(textResponse);

        if (basicResponse["api:statuscode"] != Const.StatusCodes.SUCCESS)
            throw new AminoAppsError(
                basicResponse["api:message"] || "No message",
                "Email login error",
                textResponse
            );

        return JSON.parse(textResponse);
    }
}