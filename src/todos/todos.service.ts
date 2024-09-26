import { Inject, Injectable } from "@nestjs/common";
import { TodosRepository } from "./todos.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./todos.entity";
import { Repository } from "typeorm";

@Injectable()
export class TodosService{
    constructor(
        // private todosRepository: TodosRepository,
        @Inject('ACCESS_TOKEN') private accessToken: string,
        @InjectRepository(Todo) private todosRepository: Repository<Todo>
    ){

    }

    // getTodos(){
    //     return this.accessToken === 'ESTA ES MI CLAVE SECRETA'?
    //     this.todosRepository.getTodos() 
    //     : 'No tiene acceso a esta información'
    // }
    async getTodos(){
        return await this.todosRepository.find({
            relations: ['files']
        })
    }

    async getTodoById(id: number){
        return await this.todosRepository.findOne({where: {id}, relations: ['files']})
    }

    async createTodo(todo: Omit<Todo, 'id'>){
        return await this.todosRepository.save(todo)
    }
}