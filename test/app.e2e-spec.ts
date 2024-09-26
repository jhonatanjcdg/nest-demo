import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get /users/ Returns an array with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users')
    console.log(req.body)

    expect(req.status).toBe(200)
    expect(req.body).toBeInstanceOf(Array)
  })

  it('Get /users/:id Returns an user with an OK status code', async () => {
    // 91463add-d944-487f-996e-f3e1ab2e5327
    const req = await request(app.getHttpServer()).get('/users/91463add-d944-487f-996e-f3e1ab2e5327')
    console.log(req.body)

    expect(req.status).toBe(200)
    expect(req.body).toBeInstanceOf(Object)
  })

  it('Get /users/:id throws a NotFoundException if the user dosen\'t exist with a message:  Usuario no encontrado', async () => {
    const req = await request(app.getHttpServer()).get('/users/91463add-d944-487f-996e-f3e1ab232327')
    console.log(req.body)

    expect(req.status).toBe(404)
    expect(req.body.message).toBe('Usuario no encontrado')
  })

  it('Get /users/:id throws an error if id es not a UUID', async () => {
    const req = await request(app.getHttpServer()).get('/users/1')
    console.log(req.body)

    expect(req.status).toBe(400)
    expect(req.body).toBeInstanceOf(Object)
  })

  it('Post /users/signUp creates a user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'test@gmail.com',
      password: '12345',
      name: 'Test',
    })

    expect(req.status).toBe(201)
    expect(req.body).toBeInstanceOf(Object)
  })
});
