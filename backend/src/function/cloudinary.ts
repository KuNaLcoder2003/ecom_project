import cloudinary from "cloudinary";
import dotenv from "dotenv"
dotenv.config();

const cloud = cloudinary.v2

cloud.config({
    cloud_name: process.env.cloud_name as string,
    api_key: process.env.api_key as string,
    api_secret: process.env.api_secret as string
})

interface CloudinaryResponse {
    valid?: boolean
    error?: string
    url: string,
    public_id?: string
}

export const upload = async (buffer: Buffer, folder_name: string, type: ("video" | "image" | "raw" | "auto")): Promise<CloudinaryResponse> => {
    return new Promise((resolve, reject) => {
        const result = cloud.uploader.upload_stream({
            folder: folder_name,
            resource_type: type,
            // type: "private"
        },
            (error, res) => {
                if (error) reject({ valid: false, error: error, url: "" })
                else resolve({ valid: true, url: res?.secure_url || "", public_id: `${res?.public_id}` })
            }

        )
        result.end(buffer)
    })
}

export async function uploadMultipleAssets(buffer: Buffer[]) {
    const settled = await Promise.allSettled(
        buffer.map((item) => upload(item, "ecom", "auto"))
    );
    const passed: CloudinaryResponse[] = [];
    const failed: { index: number; reason: any }[] = [];
    settled.forEach((res, idx) => {
        if (res.status === "fulfilled") {
            passed.push(res.value);
        } else {
            failed.push({ index: idx, reason: res.reason });
        }
    });

    return {
        passed,
        failed,
    };

}