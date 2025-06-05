export interface FileUploadSerivce {
    uploadFile(
        collectionName: string,
        file: Buffer,
        fileName: string,
        mimeType: string
    ): Promise<string>;
    deleteFile(fileName: string, collectionName: string): Promise<boolean>;
}
