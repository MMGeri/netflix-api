import { expect } from 'chai';
import users from '../../src/services/users-service';

describe('Queue service', function () {
    describe('findQueueById()', function () {
        it('should return one queue with id 1', async () => {
            const queue = await users.getQueueByUserId(1);

            expect(queue).to.be.an('array');
        });
        it('should return undefined', async () => {
            const queue = await users.getQueueByUserId(0);
            expect(queue).to.be.an('array');
            expect(queue).to.be.empty;
        });
    });
    describe('updateQueue()', function () {
        it('should return an array of videos with the video of id 1', async () => {
            const result = await users.queueVideo(1, 1);
            expect(result).to.be.an('array');
        });
    });
});


//FIXME: tests are dependent on each other and database state