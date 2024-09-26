import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { UsersDbService } from "./usersDb.service";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { Rol } from "../roles.enum";

@Injectable()
export class AuthService{
    constructor(
        private readonly usersDbService: UsersDbService,
        private readonly jwtService: JwtService,
    ){}

    async signUp(user: Omit<User, 'id'>){
        const dbUser = await this.usersDbService.getUserByEmail(user.email)
        if(dbUser){
            throw new BadRequestException('Email already in use')
        }
        const hashedPassword = await bcrypt.hash(user.password, 10)
        if(!hashedPassword){
            throw new BadRequestException('Password could not be hashed')
        }
        return await  this.usersDbService.saveUser({...user, password: hashedPassword})
        // return {success: 'User created succesfully'}
    }

    async signIn(email: string, password: string){
        const dbUser = await this.usersDbService.getUserByEmail(email)
        if(!dbUser){
            throw new BadRequestException('User not found')
        }
        const isPassValid = await bcrypt.compare(password, dbUser.password)
        if(!isPassValid){
            throw new BadRequestException('Invalid Password')
        }
        
        const userPayload = {
            sub: dbUser.id,
            id: dbUser.id,
            email: dbUser.email,
            // isAdmin: dbUser.isAdmin
            roles: [dbUser.isAdmin ? Rol.Admin: Rol.User]
        }
        
        const token = this.jwtService.sign(userPayload)

        return {success: 'User loggin in successfully: ', token}
    }
}