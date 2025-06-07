import { generateSecureRandomString } from "../../../utils/generateSecureRandomString.js";
import { FileUploadSerivce } from "../../file-upload/FileUploadService.js";
import { User } from "../../users/User.js";
import { NewRebus, Rebus } from "./Rebus.js";
import { RebusRepositoryImpl } from "./RebusRepositoryImpl.js";
import { RebusService } from "./RebusService.js";

export class RebusServiceImpl implements RebusService {
    private _fileUploadSevice: FileUploadSerivce;
    private _rebusRepository = new RebusRepositoryImpl();
    constructor(
        fileUploadSevice: FileUploadSerivce,
        rebusRepository: RebusRepositoryImpl
    ) {
        this._fileUploadSevice = fileUploadSevice;
        this._rebusRepository = rebusRepository;
    }
    async addRebus(rebus: NewRebus): Promise<Rebus> {
        const rebusImageUrl = await this._fileUploadSevice.uploadFile(
            "rebus-puzzles",
            rebus.rebusImage.buffer,
            "rebus-puzzle-" +
                new Date().toUTCString() +
                generateSecureRandomString(5),
            rebus.rebusImage.mimetype
        );
        return this._rebusRepository.addRebus({
            ...rebus,
            rebusImageUrl: rebusImageUrl
        });
    }
    async addRebusMany(rebus: NewRebus[]): Promise<Rebus[]> {
        throw new Error("Method not implemented.");
    }
    async getRebusById(rebusId: string): Promise<Rebus> {
        throw new Error("Method not implemented.");
    }
    async getRebus(
        filter: Partial<Rebus>,
        page?: number,
        count?: number
    ): Promise<Rebus[]> {
        throw new Error("Method not implemented.");
    }
    async getRandomRebus(
        difficulty: Rebus["difficulty"],
        count: number
    ): Promise<Rebus[]> {
        return this._rebusRepository.getRandomRebus(count, difficulty);
    }
    async getUnplayedRebus(
        userId: User["userId"],
        difficulty: Rebus["difficulty"],
        count: number
    ): Promise<Rebus[]> {
        throw new Error("Method not implemented.");
    }
}
