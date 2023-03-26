import {FastifyRequest} from "fastify";
import {SetPasswordDTO} from "../entities/dto/SetPasswordDTO";
import {User} from "../entities/user";
import {UserService} from "../services/user-service";
import {Repository} from "typeorm";

export class UserController implements IController {
    private readonly userService: UserService;

    constructor(userRepository: Repository<User>) {
        this.userService = UserService.getInstance(userRepository)
    }

    get(id: string)
    {
        console.log("id = ", id)
        return this.userService.findById(id);
    }

    getCollection()
    {
        return this.userService.findAll();
    }
}