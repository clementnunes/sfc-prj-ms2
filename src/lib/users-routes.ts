import {FastifyInstance, FastifyRequest} from "fastify";
import {UserController} from "../controllers/UserController";
import {User} from "../entities/user";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json"
import {DbConn} from "../dbConn";
import {KafkaConfig} from "../config/kafka.config";
import {Kafka} from "kafkajs";
import {KafkaJS} from "../kafka";
import PasswordFactory from "../services/password-factory";
import {SetPasswordDTO} from "../entities/dto/SetPasswordDTO";
import {UserService} from "../services/user-service";

export function usersRoutes (fastify: FastifyInstance, options: object, done: any) {
    const kafkaIns: KafkaJS = KafkaJS.getInstance()
    const dbConn = DbConn.getInstance();
    const userRepo = dbConn.appDataSource.getRepository(User)
    const userController = new UserController(userRepo);
    const userService: UserService = UserService.getInstance(userRepo)

    fastify.get('/', (request) => {
        return { hello: 'world' }
    })

    fastify.get('/users', {},
        async (request: FastifyRequest) => await userController.getCollection()
    );

    fastify.get('/consume-users', {}, async (request: FastifyRequest) => {
        await kafkaIns.consumer.run({
            eachMessage: async ({message}) => {
                if (null === message || null === message.value)
                    return;

                console.log({
                    value: message.value.toString(),
                })
            },
        });
    });

    fastify.get('/consume-users-add', {}, async (request) => {
        await kafkaIns.consumer.run({
            eachMessage: async ({message}) => {
                if (null === message || null === message.value)
                    return;

                const userData: UserDTO = message.value as unknown as UserDTO;
                const password = PasswordFactory.generate();
                const setPassword : SetPasswordDTO = new SetPasswordDTO(password, password);

                await userService.addAndPersist(
                    userData.firstName,
                    userData.lastName,
                    userData.email,
                    setPassword
                )

                console.log({
                    value: message.value.toString(),
                })
            },
        });
    });

    fastify.get<{ Params: { id: string } }>('/users/:id', async (request) => await userController.get(request.params.id));

    done();
}