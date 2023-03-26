import { expect } from 'chai';
import videoService from '../../src/services/video-repository'
import { Video } from '../../src/services/video-repository';
import sinon from 'sinon';
import '../../app';


describe('Video repository', function () {
    this.afterEach(() => {
        sinon.restore();
    });
    describe('findVideoById()', function () {
        it('should return one video with id TQIXQKT0OO', async () => {
            const video = await videoService.findVideoById('TQIXQKT0OO');

            expect(isVideo(video)).to.equal(true);
        });
        it('should return undefined', async () => {
            const video = await videoService.findVideoById('7FHR67ELH1');
            expect(video).to.be.undefined;
        });
    });
    describe('createVideo()', function () {
        describe('arguments are correct and video does not exist', function () {
            it('should return true', async () => {
                const video : Video = {title: 'The Matrix', category: 'Action', type: 'Movie'}
                const result = await videoService.createVideo(video);

                expect(result).to.be.true;
            })
        })
        describe('arguments are incorrect ', function () {
            it('should return false', async () => {
                const video : Video = {title: 'The Matrix 1231412312313123123213', category: 'Action', type: 'Movie'}
                const result = await videoService.createVideo(video);

                expect(result).to.be.false;
            })
        })
    });
});

function isVideo(obj: any): obj is Video {
    if (obj.id && obj.email && obj.password)
        return true
    return false;
}