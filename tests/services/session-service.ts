import { expect } from 'chai';
import queueService from '../../src/services/queues-service';
import { Video } from '../../src/services/videos-service';
import { isVideo } from '../../src/utils/type-checker';

describe('Queue service', function () {
    describe('findQueueById()', function () {
        it('should return one queue with id 1', async () => {
            const queue = await queueService.getQueueByUserId(1);

            expect(queue).to.be.an('array');
        });
        it('should return undefined', async () => {
            const queue = await queueService.getQueueByUserId(0);
            expect(queue).to.be.an('array');
            expect(queue).to.be.empty;
        });
    });
    describe('updateQueue()', function () {
        it('should return an array of videos with the video of id 1', async () => {
            const result = await queueService.queueVideo(1, 1);
            expect(result).to.be.an('array');
        });
    });
});


//FIXME: tests are dependent on each other and database state