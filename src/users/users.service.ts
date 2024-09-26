import { User } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UsersService{
    constructor(private usersRepository: UsersRepository,
        @Inject('API_USERS') private apiUsers: User[]
    ){
        
    }
    
    async getUsers() {
        const dbUsers = await this.usersRepository.getUsers()
        const users = [...dbUsers, ...this.apiUsers]
        return users;
    }
    
    async getUsersById(id: number) {
        return this.usersRepository.getById(id)
    }

    async getUserByName(name: string) {
        return this.usersRepository.getByName(name)
    }
    
    getUserByEmail(email: string) {
        return this.usersRepository.getByEmail(email)
    }

    async createUser(user: Omit<User, 'id'>): Promise<Omit<User, 'id'>>{
        return this.usersRepository.createUser(user)
    }
}