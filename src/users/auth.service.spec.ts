import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { JwtService } from "@nestjs/jwt"
import { UsersDbService } from "./usersDb.service"
import { User } from "./users.entity"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { sign } from "crypto"

describe('authService', () => {
    let authService: AuthService

    let mockUser: Omit<User, 'id'> = {
        name: 'Fabrizio',
        createdAt: '01/01/2024',
        password: '123456',
        email: 'fabrizio@gmail.com',
        isAdmin: false
    }
    const mockUsersService: Partial<UsersDbService> = {
        getUserByEmail: () => Promise.resolve(undefined),
        saveUser: (user: Omit<User, 'id'>): Promise<User> => Promise.resolve({
            ...user,
            isAdmin: false,
            id: '1234fd-123as-12asds-32asdf',
        })
    }

    const mockJwtService = {
        sign: (payload) => jwt.sign(payload, 'testSecret')
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                provide: UsersDbService,
                useValue: mockUsersService,
            }]
        }).compile()
        authService = module.get<AuthService>(AuthService)
    })

    it('Create an instance of AuthService', async () => {
        expect(authService).toBeDefined()
    })

    it('signUp() creates a new user with an encripted password', async () => {
        const user = await authService.signUp(mockUser)
        expect(user).toBeDefined()
        expect(user.password).not.toEqual(mockUser.password)
    })

    it("signUp() throws an error if the email is already in use", async () => {
        mockUsersService.getUserByEmail = (email: string) =>
            Promise.resolve(mockUser as User)
        try {
            await authService.signUp(mockUser as User)
        } catch (error) {
            expect(error.message).toEqual('Email already in use')
        }
    })

    it('signIn() returns an error if the password is invalid', async () => {
        mockUsersService.getUserByEmail = (email: string) =>
            Promise.resolve(mockUser as User)
        try {
            await authService.signIn(mockUser.email, 'INVALID PASSWORD')
        } catch (error) {
            expect(error.message).toEqual('Invalid Password')
        }
    })

    it('signIn() returns an error if the user is not found', async () => {
        try {
            await authService.signIn(mockUser.email, mockUser.password)
        } catch (error) {
            expect(error.message).toEqual('Invalid Password')
        }
    })

    it('signIn() returns an object with a message and a token if the user is found and the password is valid', async () => {
        const mockUserVariant = {
            ...mockUser,
            password: await bcrypt.hash(mockUser.password, 10)
        }
        mockUsersService.getUserByEmail = (email: string) =>
            Promise.resolve(mockUserVariant as User)
        const response = await authService.signIn(mockUser.email, mockUser.password)

        expect(response).toBeDefined()
        expect(response.token).toBeDefined()
        expect(response.success).toEqual('User loggin in successfully: ')
    })
})
