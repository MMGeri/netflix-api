import { expect } from 'chai';
import userService from '../../src/api/services/user-repository'
import { User } from '../../src/api/services/user-repository';
import sinon from 'sinon';
import '../../app';


describe('users resource', function () {
    this.afterEach(() => {
        sinon.restore();
    });
    describe('POST /users', function () {
        describe('request body is correct', function () {
            
        })
        describe('email is wrong', function () {

        })
        describe('password is too short', function () {

        })
        describe('password is too long', function () {

        })
        describe('user with email already exists', function () {

        });
        describe('request body is incorrect', function () {

        })
    });
    describe('POST /users/1234567/login', function () {
        describe('password is wrong', function () {

        })
        describe('password is correct', function () {

        })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', function () {

            })
        })
    })
    describe('GET /users/1234567/logout', function () {
        describe('provided valid session id', function () {

        })
        describe('no or incorrect session id', function () {
            it('should return response with 401 Unauthorized', function () {
                
            })
        })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', function () {

            })
        })
    })
    describe('PUT /users/1234567/queue', function () {
        describe('provided valid session id', function () {

        })
        describe('no or incorrect session id', function () {
            it('should return response with 401 Unauthorized', function () {
                
            })
        })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', function () {

            })
        })
    })
    describe('GET /users/1234567/queue', function () {
        describe('provided valid session id', function () {

        })
        describe('no or incorrect session id', function () {
            it('should return response with 401 Unauthorized', function () {

            })
        })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', function () {

            })
        })
    })
});

function isUser(obj: any): obj is User {
    if (obj.id && obj.email && obj.password)
        return true
    return false;
}