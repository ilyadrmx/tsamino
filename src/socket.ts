import WebSocket from "ws";
import { EventEmitter } from "events";
// ---
import {Client} from "./client.js";
import { AminoAppsError } from "./lib/errors.js";
// ---
import * as Util from "./lib/util.js";
import * as Models from "./lib/model.js";
import * as Const from "./lib/const.js";

/**
 * Class representing AminoApps API websocket client
 * @description Class that helps to receive and send websocket messages to AminoApps API
 * @property {Client} client Amino client
 * @property {WebSocket} ws Amino websocket
 * @property {Models.SocketCommands} commands Client commands
 */
export class Socket extends EventEmitter {
    private client: Client;
    private ws: WebSocket;

    public commands: Models.SocketCommands[];

    public static readonly WS_URL = "wss://ws3.narvii.com";

    /**
     * @param {Client} client Amino client
     * @see Client
     */
    constructor(client: Client) {
        super();
        this.client = client;
    }

    /** Start listening */
    public start() {
        const data = this.getConnectionData();

        this.ws = new WebSocket(data.url, {
            headers: data.headers
        });
        this.commands = [];

        this.setCallbacks();
    }

    /**
     * Send websocket message
     * @param {string | any} data Data to send
     */
    public send(data: string | any) {
        // TODO: Callback
        this.ws.send(JSON.stringify(data));
    }

    /** Set websocket callbacks */
    private setCallbacks() {
        this.ws.on("open", () => {
            // Debug
            if (this.client.debug)
                console.log("[DEBUG] Connected to websocket");

            // Reconnect after 120s
            setInterval(() => {
                // Debug
                if (this.client.debug)
                    console.log("[DEBUG] Websocket reconnect (120s timeout)");

                // Reconnect
                that.reconnect();
            }, 120_000);
        });

        const that = this;

        this.ws.on("close", (code, reason) => {
            // Debug
            if (this.client.debug)
                console.log(
                    "[DEBUG] Websocket connection closed." + " " +
                    `Trying to reconnect (${code}: ${reason.toString("utf-8")})`
                );

            // Reconnect
            setTimeout(() => {
                that.reconnect();
            }, 1000);
        });

        this.ws.on("error", (error) => {
            // Debug
            if (this.client.debug)
                console.log(`[DEBUG] Websocket error (${error})`);

            process.exit(-1);
        });

        this.ws.on("message", (message) => {
            const textMessage = message.toString("utf-8");
            const struct: Models.SocketStruct = JSON.parse(textMessage);

            switch (struct.t) {
                // Default chat message
                case Const.SocketMessageTypes.CHAT:
                    // Check if message type is 0 (default)
                    if (struct.o.chatMessage.type == Const.ChatMessageTypes.DEFAULT) {
                        // Emit text message
                        this.emit("textMessage", struct.o);

                        // Emit command
                        this.commands.forEach(value => {
                            if (struct.o.chatMessage.content?.startsWith(value.command))
                                this.emit(value.command, struct.o);
                        });
                    }

                    // Set reply function
                    struct.o.chatMessage.reply = async (
                        text,
                        mentionedArray = null,
                        type = 0
                    ) => {
                        const oldNdcId = this.client.ndcId;
                        const newNdc = this.client.setNdc(struct.o.ndcId);

                        const message = await newNdc.sendMessage({
                            text: text,
                            threadId: struct.o.chatMessage.threadId,
                            replyTo: struct.o.chatMessage.messageId,
                            mentionedArray: mentionedArray,
                            type: type
                        });

                        this.client.setNdc(oldNdcId);

                        return message;
                    }

                    // Emit chat message
                    this.emit("chatMessage", struct.o);
            }

            // Emit websocket event
            this.emit("websocketEvent", struct.o);
        });
    }

    /**
     * Get data for websocket connection
     * @private
     * @return {Models.SocketConnectionData} Websocket connection data
     */
    private getConnectionData(): Models.SocketConnectionData {
        if (!this.client.sid)
            throw new AminoAppsError("Please login to your account", "Unauthorized");

        // Connection body
        const body = this.client.deviceId + "|" + new Date().getTime().toString();

        // Connection headers
        const headers = {
            NDCDEVICEID: this.client.deviceId,
            NDCAUTH: "sid=" + this.client.sid,
            "NDC-MSG-SIG": Util.generateSigFromString(body)
        }

        // Connection URL
        const url = `${Socket.WS_URL}/?signbody=${body.replace("|", "%7C")}`;

        return {
            body: body,
            headers: headers,
            url: url
        } as Models.SocketConnectionData;
    }

    /**
     * Reconnect websocket
     * @private
     */
    private reconnect() {
        this.ws.removeAllListeners();
        this.start();
    }
}