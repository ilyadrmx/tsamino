import { randomBytes, createHmac } from "crypto";

const PREFIX_HEX = Buffer.from("42", "hex");
const DEVICE_KEY = Buffer.from("02B258C63559D8804321C5D5065AF320358D366F", "hex");
const SIG_KEY = Buffer.from("F8E7A61AC3F725941E3AC7CAE2D688BE97F30B93", "hex");

/** Generate Amino device ID */
export function generateDeviceId(data: string | null = null) {
    const id = data || randomBytes(20).toString("hex");
    const mac = createHmac("sha1", DEVICE_KEY)
        .update(Buffer.from(PREFIX_HEX + id, "binary"))
        .digest("hex");

    return (PREFIX_HEX.toString("hex") + Buffer.from(id, "binary").toString("hex") + mac).toUpperCase();
}

/** Generate signature for JSON data */
export function generateSigFromJson(data: string) {
    let bufferData = Buffer.from(data, "utf8");

    let mac = createHmac("sha1", SIG_KEY)
        .update(bufferData)
        .digest("hex");

    return Buffer.from("42" + mac, "hex").toString("base64");
}

/** Generate signature for Buffer data */
export function generateSigFromBuffer(data: Buffer) {
    let mac = createHmac("sha1", SIG_KEY)
        .update(data)
        .digest("hex");

    return Buffer.from("42" + mac, "hex").toString("base64");
}