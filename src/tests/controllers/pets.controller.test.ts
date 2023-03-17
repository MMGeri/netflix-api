import { expect } from 'chai';
import axios from 'axios';
import '../../app'; //ezzel indítjuk el az appot tesztelésnél

describe('Pets controller', function () {
    const instance = axios.create({
        baseURL: 'http://localhost:3000/v1',
        validateStatus: undefined
    });

    describe('GET /pets', function () {
        it('should return an error', async () => {
            const response = await instance.get('/pets');

            expect(isError(response.data)).to.be.true;
            expect(response.status).to.equal(400);
        });
    });

    describe('GET /pets?type=dog&limit=2', function () {
        it('should return all dogs', async () => {
            const response = await instance.get('/pets?type=dog&limit=2');
            console.log(response.data);
            expect(response.data).to.be.an('array');
            expect(response.data.length).to.equal(2);
            expect(response.data[0].id).to.equal(1);
            expect(response.data[0].type).to.equal("dog");
        });
    });

    describe('GET /pets?type=cat&limit=1', function () {
        it('should return one cat', async () => {
            const response = await instance.get('/pets?type=cat&limit=1');

            expect(response.data).to.be.an('array');
            expect(response.data.length).to.equal(1);
            expect(response.data[0].id).to.equal(2);
            expect(response.data[0].type).to.equal("cat");
        });
    });

    describe('GET /pets?type=dog&limit=2&tags[]=sweet',function () {
        it('should return response 200', async () =>{
          const response = await instance.get('/pets?type=dog&limit=2&tags[]=sweet');

          expect(response.status).to.equal(200);
        })
        it('should return two dogs', async () =>{
            const response = await instance.get('/pets?type=dog&limit=2&tags[]=sweet');
            
            expect(response.data).to.be.an('array');
            expect(response.data[0].type).to.equal("dog");
            expect(response.data.length).to.equal(2);
          })
    })

    describe('GET /pets?type=dog&limit=2&tags[]=sweet&tags[]=bestboi',function () {
        it('should return response 200', async () =>{
          const response = await instance.get('/pets?type=dog&limit=2&tags[]=sweet&tags[]=bestboi');

          expect(response.status).to.equal(200);
        })
        it('should return one dog', async () =>{
            const response = await instance.get('/pets?type=dog&limit=2&tags[]=sweet&tags[]=bestboi');
            
            expect(response.data).to.be.an('array');
            expect(response.data[0].type).to.equal("dog");
            expect(response.data.length).to.equal(1);
          })
    })

    describe('GET /pets/0', function () {
        it('should return 404.', async () => {
            const response = await instance.get('/pets/0');

            expect(response.status).to.equal(404);
            expect(response.data.message).to.equal('not found');

        });
    });

    describe('GET /pets/1', function () {
        it('should return 200.', async () => {
            const response = await instance.get('/pets/1');

            expect(response.status).to.equal(200);
        });

        it('should return one pet with id 1', async () => {
            const response = await instance.get('/pets/1');

            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(1);
        });
    });

    describe('DELETE /pets/1', function () {
        it('should return 204', async () => {
            const response = await instance.delete('/pets/1');

            expect(response.status).to.equal(204);
        });

        it('should return pet deleted string', async () => {
            const response = await instance.delete('/pets/1');

            expect(response.data).to.equal("");
        });
    });

    describe('POST /pets', function () {
        const dog = {
            type: "dog",
            name: "Fido",
            tags: ["cute dog"]
        }

        it('should return 200.', async () => {
            const response = await instance.post('/pets', dog);

            expect(response.status).to.equal(200);
        });

        it('should return the pet that was created', async () => {
            const response = await instance.post('/pets', dog);

            expect(response.status).to.equal(200);
        });
    });
});

function isError(obj: any): obj is { message: string, errors: object[] } {
    if (obj.errors && obj.errors.length > 0 && obj.message)
        return true;
    return false;
}