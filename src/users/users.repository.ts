import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";

@Injectable()
export class UsersRepository{
    private users: User[] = [
        {
            id: 1,
            name:"Tota",
            email: 'tota@gmail.com',
        },
        {
            id: 2,
            name:"Gama",
            email: 'gama@gmail.com',
        },
        {
            id: 3,
            name:"Juan",
            email: 'juan@gmail.com',
        },
    ]
    
    async getUsers(){
        return this.users
    }
    
    async getById(id: number) {
        return this.users.find(user => user.id === id)
    }

    async getByName(name: string) {
        return this.users.find(user => user.name === name)
    }

    async getByEmail(email: string) {
        // return this.
    }

    async createUser(user: Omit<User, 'id'>){
        const id = this.users.length+1
        this.users = [...this.users, {id, ...user}]
        return user
    }
}