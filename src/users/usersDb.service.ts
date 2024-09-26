import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersDbService{
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    async getUsers(){
        return await this.usersRepository.find()
    }

    async getUserById(id: string){
        return await this.usersRepository.findOne({where: {id}})
    }

    async getUserByEmail(email: any) {
        return await this.usersRepository.findOne({where: {email}})
    }

    async saveUser(user: Omit<User, 'id'>){
        const newUser: User= await this.usersRepository.create(user)
        return await this.usersRepository.save(newUser)
    }
}