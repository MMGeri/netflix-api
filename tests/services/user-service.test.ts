import { expect } from 'chai';
import userService from '../../src/services/users-service'
import { User } from '../../src/services/users-service';
import { Video } from '../../src/services/video-service';



describe('User repository', function () {
    describe('findUserById()', function () {
        it('should return one user with id 1', async () => {
            const user = await userService.findUserById(1);

            expect(isUser(user)).to.equal(true);
        });
        it('should return undefined', async () => {
            const user = await userService.findUserById(0);
            expect(user).to.be.undefined;
        });
    });
    describe('createUser()', function () {
        describe('user does not exist', function () {
            it('should return true', async () => {
                const user = {email:'joska@gmail.com', password:'password'}
                const result = await userService.createUser(user);

                expect(result).to.be.true;
            })
        })
        describe('user exists', function () {
            it('should return false', async () => {
                const user = {email:'example@gmail.com', password:'password'}
                const result = await userService.createUser(user);

                expect(result).to.be.false;
            })
        })
    });
    describe('deleteUser()', function () {
        describe('user does not exist', function (){
            it('should return false', async () => {
                const result = await userService.deleteUser(0);
                expect(result).to.be.false;
            });
        })
        describe('user exists', function (){
            it('should return true', async () => {
                const result = await userService.deleteUser(1);
                expect(result).to.be.true;
            });
        })
    });
    describe('updateUser()', function () {
        describe('user does not exist', function (){
            it('should return undefined', async () => {
                const user = {email:'example@gmail.com', password:'password'}
                const result = await userService.updateUser(0,user);
                expect(result).to.be.undefined;
            });
        })
        describe('user exists', function (){
            it('should return a user', async () => {
                const user = {id:1, email:'example@gmail.com', password:'password'}
                const result = await userService.updateUser(1,user);
                expect(isUser(result)).to.be.true;
            });
        })
    });
    describe('getQueue()', function () {
        it('should return an empty array', async () => {
            const result = await userService.getQueue(2);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(0);
        });
        it('should return an array with 2 videos', async () => {
            const result = await userService.getQueue(1);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(2);
            expect(isVideo(result[0])).to.be.true;
        });
    });
    describe('queueVideo()', function () {
        it('should return an array with 3 videos', async () => {
            const video = {id:3, title:'video3', category:'category3', type:'type3'}
            const result = await userService.queueVideo(1,1);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(3);
            expect(isVideo(result[0])).to.be.true;
        });
    });
});

function isVideo(obj: any): obj is Video {
    if (obj.id && obj.title && obj.category && obj.type){
        return true;
    }
    return false
}

function isUser(obj: any): obj is User {
    if (obj.id && obj.email && obj.password)
        return true
    return false;
}

