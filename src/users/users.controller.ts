import { Body, Controller, Delete, FileTypeValidator, Get, Headers, HttpCode, HttpException, HttpStatus, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, ParseUUIDPipe, Post, Put, Query, Req, Request as NestRequest, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request as ERequest, Request, Response } from "express";
import { User } from "./interfaces/user.interface";
import { AuthGuard } from "../guards/auth.guard";
import { DateAdderInterceptor } from "../interceptors/date-adder.interceptor";
import { UsersDbService } from "./usersDb.service";
import {User as UserEntity} from './users.entity'
import { CreateUserDto } from "./dtos/CreateUser.dto";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { MinSizeValidatorPipe } from "../pipes/minSizeValidatorPipe";
import { AuthService } from "./auth.service";
import { UserCredentialsDto } from "./dtos/UserCredentials.dto";
import { Rol } from "../roles.enum";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller("users")
// Este Guard se usa para todo lo que tenga este controlador
// @UseGuards(AuthGuard)
export class UsersController{
    constructor(
        private readonly usersService: UsersService,
        private readonly usersDbService: UsersDbService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly authService: AuthService,
    ){}

    @Get()
    getUsers(@Query('name') name?: string){
        if(name){
            return this.usersService.getUserByName(name)
        }
        return this.usersDbService.getUsers()
    }

    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(AuthGuard)
    getUserProfile(/*@Headers('token') token?: string*/@Req() request: ERequest & {user:any},){
        // if(token !== '1234'){
        //     return 'Sin acceso'
        // }
        console.log(request.user)
        return 'Este endopint retorna el perfil del usuario'
    }

    @ApiBearerAuth()
    @Post('profile/image')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(MinSizeValidatorPipe)
    @UseGuards(AuthGuard)
    async getUserImage(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 100000,
                    message: 'El archivo debe se menor a 10000kb'
                }),
                new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp)$/,
                })
            ]
        })
    ) file: Express.Multer.File){
        return await this.cloudinaryService.uploadImage(file)
    }

    @HttpCode(418)
    @Get('coffee')
    getCoffee(){
        try{
            throw new Error()
        }
        catch(e){
            throw new HttpException(
                {
                    status: HttpStatus.I_AM_A_TEAPOT,
                    error: 'Envio de cafe fallido',
                },
                HttpStatus.I_AM_A_TEAPOT,
            )
        }
    }

    @Get('message')
    getMessage(@Res() response: Response){
        response.status(200).send('Este es un mensaje')
    }

    @Get('request')
    getRequest(@Req() request: Request){
        console.log(request)
        return 'Esta ruta loguea el request'
    }

    @ApiBearerAuth()
    @Get('admin')
    @Roles(Rol.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    getAdmin(){
        return 'Ruta protegida'
    }

    @Get('auth0/protected')
    async getAuth0Protected(@Req() req: Request){
        console.log(req.oidc)
        return JSON.stringify(req.oidc.user)
    }
    
    @Get(':id')
    async getUserById(@Param('id', ParseUUIDPipe) id: string){
        const user = await this.usersDbService.getUserById(id)
        if(!user){
            throw new NotFoundException('Usuario no encontrado')
        }
        return user
    }

    @Post('signup')
    @UseInterceptors(DateAdderInterceptor)
    createUser(@Body() user: CreateUserDto, @Req() request: Request & {now:string}){
        console.log("Dentro del endpoint: ", request.now)
        return this.authService.signUp({...user, createdAt: request.now})
    }

    @Post('Signin')
    async signin(@Body() user: UserCredentialsDto){
        console.log("asd")
        return await this.authService.signIn(user.email, user.password)
    }

    @Put()
    updateUser(){
        return 'Este endpoint modifica un usuario'
    }
    
    @Delete()
    deleteUser(){
        return 'Este endpint elimina un usuario'
    }
}