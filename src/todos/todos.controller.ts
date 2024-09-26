import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Todos')
@Controller('todos')
export class TodosController{
    constructor(
        private readonly todosService: TodosService,
        private readonly filesService: FilesService
    ){}

    @Get()
    getTodos(){
        return this.todosService.getTodos()
    }

    @Get(':id')
    @UsePipes(new ValidationPipe({transform: true}))
    getTodoById(@Param('id') id:number){
        return this.todosService.getTodoById(id);
    }

    @Post('upload')
    // Cualquier nombre
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Body('id') id: number,
        @UploadedFile() file: Express.Multer.File
    ){
        const todo = await this.todosService.getTodoById(id)

        return this.filesService.saveFile({
            name: file.originalname,
            mimeType: file.mimetype,
            data: file.buffer,
            todo
        })
    }

    @Post()
    createTodo(@Body() todo: any){
        return this.todosService.createTodo(todo)
    }
}