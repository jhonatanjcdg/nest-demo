import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEmpty, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'El nombre no debe estar vacío',
        example: 'Nombre_apellido'
    })
    name: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        description: 'El Email debe ser un email válido',
        example: 'example@gmail.com'
    })
    email: string

    /**
     * La contraseña, debe ser dificil de descifrar
     * @example contraseña12(3

     */
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    // @ApiProperty({
    //     description: 'La contraseña debe ser dificil de descifrar',
    //     example: 'ffd@223"!#LK'
    // })
    password: string

    @IsEmpty()
    @ApiProperty({
        description: 'Asigna por default al momento de crear al usuario, no debe ser incluida en el body',
        default: false
    })
    isAdmin: boolean
}