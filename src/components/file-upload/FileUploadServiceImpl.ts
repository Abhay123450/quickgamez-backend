import { ConsoleLog } from "../../utils/ConsoleLog.js";
import { FileUploadSerivce } from "./FileUploadService.js";
import { Bucket, Storage } from "@google-cloud/storage";

export class FileUploadSerivceImpl implements FileUploadSerivce {
    private _storage: Storage;
    constructor() {
        this._storage = new Storage();
    }
    async uploadFile(
        collectionName: string,
        file: Buffer,
        fileName: string,
        mimeType: string
    ): Promise<string> {
        const bucket = this._storage.bucket(collectionName);
        const fileToSaved = bucket.file(fileName);
        const filesaved = await fileToSaved.save(file, {
            metadata: {
                contentType: mimeType,
                cacheControl: "public, max-age=31536000"
            },
            public: true
        });
        ConsoleLog.info(
            `file saved: filename: ${fileName}, mimeType: ${mimeType} collectionName: ${collectionName}`
        );
        return `https://storage.googleapis.com/${collectionName}/${fileName}`;
    }
    async deleteFile(
        fileName: string,
        collectionName: string
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    private async _createBucket(bucketName: string) {
        try {
            const bucket = await this._storage.createBucket(bucketName, {
                location: "us"
            });
            ConsoleLog.info(
                `bucket named ${bucketName} created: ${JSON.stringify(bucket)}`
            );
        } catch (error) {
            ConsoleLog.error(error);
        }
    }
}
