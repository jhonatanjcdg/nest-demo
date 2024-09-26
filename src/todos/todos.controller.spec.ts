import { Test } from "@nestjs/testing"
import { TodosController } from "./todos.controller"
import { TodosService } from "./todos.service"
import { FilesService } from "./files.service"
import { Todo } from "./todos.entity"
import { Readable } from "typeorm/platform/PlatformTools"

describe('TodosController', () => {
    let todosController: TodosController
    let mockTodosService: Partial<TodosService>
    let mockFilesService: Partial<FilesService>

    const mockTodo: Partial<Todo> = {
        title: 'Todo 1',
        description: 'Description 1'
    }

    const mockFile: Express.Multer.File = {
        fieldname: "example",
        originalname: "example.txt",
        encoding: "utf-8",
        mimetype: "text/plain",
        size: 0,
        stream: new Readable(),
        destination: "",
        filename: "",
        path: "",
        buffer: Buffer.from([])
    }

    beforeEach(async () => {
        mockTodosService = {
            getTodos: () => Promise.resolve([{...mockTodo, id: 1, isCompleted: false}] as Todo[]),
            getTodoById: (id: number) => Promise.resolve({...mockTodo, id: 1, isCompleted: false} as Todo),
            createTodo: (todo: Partial<Todo>) => Promise.resolve({...mockTodo, id: 1, isCompleted: false} as Todo)
        }

        mockFilesService = {
            saveFile: () => Promise.resolve({
                id: 1,
                name: 'example.txt',
                mimeType: 'text/plain',
                data: Buffer.from([]),
                todo: {
                    ...mockTodo,
                    id: 1,
                    isCompleted: false,
                } as Todo,
            })
        }

        const module = await Test.createTestingModule({
            controllers: [TodosController],
            providers: [
                {
                    provide: TodosService,
                    useValue: mockTodosService
                },
                {
                    provide: FilesService,
                    useValue: mockFilesService
                }
            ]
        }).compile()
        todosController = module.get<TodosController>(TodosController)
    })

    it('Should be defined', () => {
        expect(todosController).toBeDefined()
    })

    it('getTodos() should return an array of todos', async () => {
        const todos = await todosController.getTodos()

        expect(todos).toEqual([{
            id: 1,
            title: 'Todo 1',
            description: 'Description 1',
            isCompleted: false
        }] as Todo[])
    })

    it('createTodo() should create a new todo', async () => {
        const todo = await todosController.createTodo(mockTodo)

        expect(todo).toEqual({
            id: 1,
            title: 'Todo 1',
            description: 'Description 1',
            isCompleted: false
        } as Todo)
    })

    it('uploadFile() should upload a file', async () => {
        const file = await todosController.uploadFile(1, mockFile)
        
        expect(file).toEqual({
            id: 1,
            name: 'example.txt',
            mimeType: 'text/plain',
            data: Buffer.from([]),
            todo: {
                ...mockTodo,
                id: 1,
                isCompleted: false,
            } as Todo,
        })
    })
})