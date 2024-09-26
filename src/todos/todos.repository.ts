import { Injectable } from "@nestjs/common";

@Injectable()
export class TodosRepository{
    private todos = [
        {
            id: 1,
            title: 'Todo 1',
            description: 'Description 1',
            inCompleted: false
        },
        {
            id: 2,
            title: 'Todo 2',
            description: 'Description 2',
            inCompleted: false
        },
        {
            id: 3,
            title: 'Todo 3',
            description: 'Description 3',
            inCompleted: false
        },
        {
            id: 4,
            title: 'Todo 4',
            description: 'Description 4',
            inCompleted: false
        },
    ]

    async getTodos() {
        return this.todos
    }
}