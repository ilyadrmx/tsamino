import * as Models from "./lib/model.js";
import * as Util from "./lib/util.js";
// ---
import { Request } from "./lib/request.js";
import { Socket } from "./socket.js";

// noinspection JSUnusedGlobalSymbols
/**
 * Class representing AminoApps API client
 * @description Main library class that provides and executes calls to the AminoApps API
 * @property {string | null} deviceId Client's device ID used in "NDCDEVICEID" header
 * @property {string | null} sid Client's session ID used in "NDCAUTH" header
 * @property {number} ndcId Client's NDC used in API path
 * @property {string} userAgent Client's user agent used in "User-Agent" header
 * @property {boolean} debug Debug requests
 * @property {Socket} ws Websocket
 * @property {Request} request Client's request executor and builder
 * @see Request
 * @see Socket
 */
export class Client {
    // Client's device ID used in "NDCDEVICEID" header
    public deviceId: string | null;

    // Client's session ID used in "NDCAUTH" header
    public sid: string | null;

    // Client's account information
    public account: Models.Account | null;

    // Client's profile information;
    public profile: Models.UserProfile | null;

    // Client's NDC used in API path
    public ndcId = 0;

    // Client's user agent used in "User-Agent" header
    public userAgent = Client.USER_AGENT;

    // Debug requests
    public debug = false;

    // Websocket
    public ws: Socket;

    // Client's request executor and builder
    public request: Request;

    // Default user agent
    public static USER_AGENT = "Mozilla/5.0 (Linux; Android 10; SM-G980F Build/QP1A.190711.020; wv)" + " " +
        "AppleWebKit/537.36 (KHTML, like Gecko)" + " " +
        "Version/4.0" + " " +
        "Chrome/78.0.3904.96" + " " +
        "Mobile Safari/537.36";

    /**
     * @param {Models.ClientParams} [clientParams] Client parameters
     * @see Models.ClientParams
     */
    constructor(clientParams: Models.ClientParams = {}) {
        this.deviceId = clientParams.deviceId || Util.generateDeviceId();
        this.sid = null;
        this.debug = clientParams.debug || false;

        this.request = new Request(this);
    }

    /*------------------*\
     |                  |
     |    AUTH BLOCK    |
     |                  |
    \*------------------*/

    /**
     * Login to account with email
     * @param {string} email Account's email
     * @param {string} password Account's password
     * @return {Promise<Models.LoginResponse>} Account information
     */
    public async loginWithEmail(email: string, password: string): Promise<Models.LoginResponse> {
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
                data: JSON.stringify(body),
                withNot200Error: true,
                not200Text: "Email login error"
            }
        );

        const textResponse = await response.text();
        const loginResponse: Models.LoginResponse = JSON.parse(textResponse);

        this.sid = loginResponse.sid;
        this.request = new Request(this);
        this.profile = loginResponse.userProfile;
        this.account = loginResponse.account;

        // Debug
        if (this.debug)
            console.log(`[DEBUG] Logged in (email): ${this.profile.uid}`);

        return JSON.parse(textResponse);
    }

    /**
     * Login with session ID
     * @param {string} sid Session ID
     */
    public async loginWithSid(sid: string) {
        this.sid = sid;
        this.request = new Request(this);

        const sidInfo = Util.decodeSid(sid);
        const profile = await this.getUserProfile(sidInfo["2"]);
        this.profile = profile.userProfile;

        const account = await this.getAccountInfo();
        this.account = account.account;

        // Debug
        if (this.debug)
            console.log(`[DEBUG] Logged in (SID): ${this.profile.uid}`);
    }

    /**
     * Set community
     * @param {number} [ndcId=0] Community ID
     * @return {Client} Client with local NDC
     */
    public setNdc(ndcId: number | null = 0) {
        this.ndcId = ndcId;
        this.request = new Request(this);

        // Debug
        if (this.debug)
            console.log(`[DEBUG] Set NDC: ${ndcId}`);

        return this;
    }

    /*------------------*\
     |                  |
     |    POST BLOCK    |
     |                  |
    \*------------------*/

    /**
     * Send chat message
     * @param {Models.MessageParams} messageParams Message params
     * @return {Promise<Models.ChatMessage>} Sent chat message information
     * @see Models.MessageParams
     */
    public async sendMessage(messageParams: Models.MessageParams): Promise<Models.ChatMessage> {
        let body: Models.MessageRequest = {
            type: 0,
            timestamp: Date.now(),
            replyMessageId: null,
            content: null,
            extensions: null
        };

        if (messageParams.replyTo)
            body.replyMessageId = messageParams.replyTo;

        if (messageParams.text)
            body.content = messageParams.text;

        if (messageParams.mentionedArray)
            body.extensions = {
                mentionedArray: messageParams.mentionedArray
            };

        const response = await this.request.call(
            `/chat/thread/${messageParams.threadId}/message`, {
                method: Request.METHOD_POST,
                ndcId: this.ndcId,
                contentType: Request.HeaderValues.CONTENT_TYPE_APPLICATION_JSON,
                data: JSON.stringify(body),
                withNot200Error: true,
                not200Text: "Send message error"
            }
        );

        return JSON.parse(await response.text());
    }

    /*-----------------*\
     |                 |
     |    GET BLOCK    |
     |                 |
    \*-----------------*/

    /**
     * Get community information
     * @param {string} ndcId Community ID
     * @return {Promise<Models.community.Community>} Community information
     */
    public async getCommunityInfo(ndcId: number | string): Promise<Models.community.Community> {
        ndcId = typeof ndcId == "string"
            ? -(parseInt(ndcId))
            : -ndcId;

        const response = await this.request.call(
            `/community/info?withInfluencerList=1&withTopicList=true&influencerListOrderStrategy=fansCount`, {
                method: Request.DEFAULT_METHOD,
                ndcId: ndcId,
                withNot200Error: true,
                not200Text: "Get community info error"
            }
        );

        return JSON.parse(await response.text());
    }

    /**
     * Get account info
     * @return {Promise<Models.AccountResponse>} Account info
     */
    public async getAccountInfo(): Promise<Models.AccountResponse> {
        const response = await this.request.call(`/account`, {
            method: Request.DEFAULT_METHOD,
            ndcId: this.ndcId,
            withNot200Error: true,
            not200Text: "Get account info error"
        });

        return JSON.parse(await response.text());
    }

    /**
     * Get user profile information
     * @param {string} uid User's ID
     * @return {Promise<Models.UserProfileResponse>} User profile
     */
    public async getUserProfile(uid: string): Promise<Models.UserProfileResponse> {
        const response = await this.request.call(`/user-profile/${uid}`, {
            method: Request.DEFAULT_METHOD,
            ndcId: this.ndcId,
            withNot200Error: true,
            not200Text: "Get profile error"
        });

        return JSON.parse(await response.text());
    }

    /**
     * Get chat thread information
     * @param {string} threadId ID of the chat thread
     * @return {Promise<Models.ThreadResponse>} Chat thread information
     */
    public async getThreadInfo(threadId: string): Promise<Models.ThreadResponse> {
        const response = await this.request.call(`/chat/thread/${threadId}`, {
            method: Request.DEFAULT_METHOD,
            ndcId: this.ndcId,
            withNot200Error: true,
            not200Text: "Get chat thread info error"
        });

        return JSON.parse(await response.text());
    }

    /**
     * Get chat threads information
     * @param {number} [start=0] Where to start getting chats threads
     * @param {number} [size=100] Size of the returned chat threads list
     * @return {Promise<Models.ThreadResponse>} Chat threads information
     */
    public async getThreadsInfo(start: number = 0, size: number = 100): Promise<Models.ThreadsResponse> {
        const response = await this.request.call(`/chat/thread` +
            `?type=joined-me&start=${start}&size=${size}`, {
                method: Request.DEFAULT_METHOD,
                ndcId: this.ndcId,
                withNot200Error: true,
                not200Text: "Get chat threads info error"
            }
        );

        return JSON.parse(await response.text());
    }

    /*--------------------*\
     |                    |
     |    SOCKET BLOCK    |
     |                    |
    \*--------------------*/

    /** Start listening messages from websocket */
    public startMessageListening() {
        this.ws = new Socket(this);
        this.ws.start();
    }

    /**
     * Get websocket event callbacks from event names.
     *
     * Available event names are:
     * - textMessage: Messages with **text content** (message type 0)
     * - chatMessage: Every message received from the **chat** (any of the message types)
     * - websocketEvent: **Every** websocket event (chat message, notification, invitation, etc.)
     * @param {string} eventName Name of event to listen
     * @param {Models.SocketCallback} callback Event callback
     */
    public onEvent(eventName: string, callback: Models.SocketCallback) {
        this.ws.on(eventName, callback);
    }

    /**
     * Register bot command.
     *
     * Bot will react on the message if it starts with **``commandName``**
     * @param {string} commandName
     * @param {Models.SocketCallback} callback
     */
    public command(commandName: string, callback: Models.SocketCallback) {
        this.ws.commands.push({
            command: commandName,
            callback: callback
        });
        this.ws.on(commandName, callback);
    }

    /** Stop listening messages from websocket */
    public stopMessageListening() {
        this.ws.stop();
    }
}