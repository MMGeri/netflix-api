import { expect } from 'chai';
import userService from '../../src/services/user-repository'
import { User } from '../../src/services/user-repository';
import sinon from 'sinon';
import '../../app';


describe('User repository', function () {
    this.afterEach(() => {
        sinon.restore();
    });
    describe('findUserById()', function () {
        it('should return one user with id 1234567', async () => {
            const user = await userService.findUserById('1234567');

            expect(isUser(user)).to.equal(true);
        });
        it('should return undefined', async () => {
            const user = await userService.findUserById('123');
            expect(user).to.be.undefined;
        });
    });
    describe('createUser()', function () {
        describe('arguments are correct and user does not exist', function () {
            it('should return true', async () => {
                const user = {email:'joska@gmail.com', password:'password'}
                const result = await userService.createUser(user);

                expect(result).to.be.true;
            })
        })
        describe('arguments are correct but user exists', function () {
            it('should return false', async () => {
                const user = {email:'example@gmail.com', password:'password'}
                const result = await userService.createUser(user);

                expect(result).to.be.false;
            })
        })
        describe('arguments are incorrect ', function () {
            it('should return false', async () => {
                const user = {email:'joskagmail.com', password:'password'}
                const result = await userService.createUser(user);

                expect(result).to.be.false;
            })
        })
    });
});

function isUser(obj: any): obj is User {
    if (obj.id && obj.email && obj.password)
        return true
    return false;
}