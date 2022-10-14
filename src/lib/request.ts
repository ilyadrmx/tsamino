import fetch from "node-fetch";
import { HeadersInit, RequestInit, Response } from "node-fetch";
// ---
import { Client } from "../client.js";
import { RequestParams, BasicResponse } from "./model.js";
import { AminoAppsError, TemporaryBanError } from "./errors.js";
// ---
import * as Util from "./util.js";
import * as Const from "./const.js";

/**
 * Class representing AminoApps API request builder
 * @description Request class is used inside the Client class. It helps to build the API request
 * @property {Client} client Amino client
 * @see Client
 */
export class Request {
    // Amino client
    private client: Client;

    public static readonly API_GLOBAL = "https://service.narvii.com/api/v1/g";
    public static readonly API_NDC = "https://service.narvii.com/api/v1/x";
    public static readonly NDC_GLOBAL = 0;

    public static readonly DEFAULT_METHOD = "GET";
    public static readonly METHOD_POST = "POST";

    /**
     * @param {Client} client Amino Client
     * @see Client
     */
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Make an HTTP request from params
     * @param {string} path AminoApps service path
     * @param {RequestParams} params Request parameters
     * @return {Response} Response
     * @see RequestParams
     */
    public async call(path: string, params: RequestParams): Promise<Response> {
        // Default request params
        let fetchParams: RequestInit = {
            method: Request.DEFAULT_METHOD
        }

        // Default request headers
        const requestHeaders: HeadersInit = {};
        requestHeaders[Request.HeaderNames.NDC_DEVICE_ID] = this.client.deviceId!;
        requestHeaders[Request.HeaderNames.USER_AGENT] = this.client.userAgent;

        // Set request method
        if (params.method)
            fetchParams.method = params.method;

        // Set "NDCAUTH" header
        if (this.client.sid)
            requestHeaders[Request.HeaderNames.NDC_AUTH] = "sid=" + this.client.sid;

        // Set "Content-Type" header
        if (params.contentType)
            requestHeaders[Request.HeaderNames.CONTENT_TYPE] = params.contentType;

        // Set request body
        if (params.data)
            switch (params.contentType) {
                case Request.HeaderValues.CONTENT_TYPE_APPLICATION_JSON:
                    requestHeaders[Request.HeaderNames.NDC_MSG_SIG] = Util.generateSigFromString(params.data);
                    fetchParams.body = params.data;
                    break;
                default:
                    requestHeaders[Request.HeaderNames.NDC_MSG_SIG] = Util.generateSigFromBuffer(params.data);
                    fetchParams.body = params.data;
            }

        // Set headers
        fetchParams.headers = requestHeaders;

        // Make request
        const response = await fetch(
            this.getPathFromNdcId(params.ndcId) + path,
            fetchParams
        );

        // Get status code
        const statusCode = response.status;

        // Debug
        if (this.client.debug) {
            const headersEntries = Object.entries(requestHeaders);
            let headersText = "\n";

            headersEntries.forEach((entry, index) => {
                const stringEnd = index == headersEntries.length - 1
                    ? ""
                    : "\n";
                headersText += "        " + entry[0] + ": " + entry[1] + stringEnd;
            });

            console.log(`[DEBUG] Request - ${params.method} ${path} --->`);
            console.log(`    Full URL: ${this.getPathFromNdcId(params.ndcId) + path}`);
            console.log(`    NDC ID: ${params.ndcId}`);
            console.log(`    Content type: ${params.contentType}`);
            console.log(`    Body: ${params.data}`);
            console.log(`    Headers: ${headersText}`);
            console.log(`<--- Status ${statusCode}`);
        }

        // Check 403 Forbidden
        if (statusCode == Const.StatusCodes.FORBIDDEN)
            throw new TemporaryBanError(await response.text());

        // Throw if response status is not 200
        if (params.withNot200Error) {
            if (statusCode != Const.StatusCodes.SUCCESS_HTTP) {
                const textResponse = await response.text();
                const basicResponse: BasicResponse = JSON.parse(textResponse);

                throw new AminoAppsError(basicResponse["api:message"], params.not200Text, textResponse);
            }
        }

        return response;
    }

    /** AminoApps API headers names*/
    public static HeaderNames = class {
        static readonly NDC_DEVICE_ID = "NDCDeviceId";
        static readonly NDC_MSG_SIG = "NDC-MSG-SIG";
        static readonly NDC_AUTH = "NDCAuth";
        static readonly USER_AGENT = "User-Agent";
        static readonly CONTENT_TYPE = "Content-Type";
    }

    /** AminoApps API default headers values */
    public static HeaderValues = class {
        static readonly CONTENT_TYPE_APPLICATION_JSON = "application/json";
    }

    /**
     * Get URL path from ndc ID
     * @param {number} ndcId Ndc ID
     * @return {string} Path
     * @private
     */
    private getPathFromNdcId(ndcId: number) {
        if (ndcId == Request.NDC_GLOBAL)
            return Request.API_GLOBAL + "/s";
        else if (ndcId > Request.NDC_GLOBAL)
            return Request.API_NDC + ndcId.toString() + "/s";

        return Request.API_GLOBAL + `/s-x${Math.abs(ndcId)}`;
    }
}