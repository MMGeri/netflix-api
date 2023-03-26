import { expect } from 'chai';
import videoService, { NewVideo } from '../../src/services/video-service'
import { Video } from '../../src/services/video-service';



describe('Video repository', function () {
    describe('findVideoById()', function () {
        it('should return one video with id 1', async () => {
            const video = await videoService.findVideoById(1);

            expect(isVideo(video)).to.equal(true);
            expect(video?.id).to.equal(1);
        });
        it('should return undefined', async () => {
            const video = await videoService.findVideoById(0);
            expect(video).to.be.undefined;
        });
    });
    describe('createVideo()', function () {
        describe('video does not exist', function () {
            it('should return true', async () => {
                const video : NewVideo = {title: 'The Matrix', category: 'Action', type: 'Movie'}
                const result = await videoService.createVideo(video);

                expect(result).to.be.true;
            })
        })
    });
    describe('deleteVideo()', function () {
        describe('video does not exist', function (){
            it('should return false', async () => {
                const result = await videoService.deleteVideo(0);
                expect(result).to.be.false;
            });
        })
        describe('video exists', function (){
            it('should return true', async () => {
                const result = await videoService.deleteVideo(1);
                expect(result).to.be.true;
            });
        })
    });
    describe('updateVideo()', function () {
        describe('video does not exist', function (){
            it('should return undefined', async () => {
                const video:NewVideo = {title: 'The Matrix', category: 'Action', type: 'Movie'}
                const result = await videoService.updateVideo(0,video);
                expect(result).to.be.undefined;
            });
        })
        describe('video exists', function (){
            it('should return true', async () => {
                const video:NewVideo = { title: 'The Matrix', category: 'Action', type: 'Movie'}
                const result = await videoService.updateVideo(1,video);
                expect(result).to.be.true;
            });
        })
    });
    describe('getVideos()', function () {
        it('should return all videos', async () => {
            const videos = await videoService.getVideos();
            expect(isVideo(videos[0])).to.equal(true);
            expect(isVideo(videos[1])).to.equal(true);
            expect(videos.length).to.equal(2);
        });
    });
    describe('searchVideos()', function () {
        it('should return all videos with title The Matrix', async () => {
            const videos = await videoService.searchVideos('The Matrix');
            expect(isVideo(videos[0])).to.equal(true);
            expect(videos.length).to.equal(1);
        });
    });
});

function isVideo(obj: any): obj is Video {
    if (obj.id && obj.email && obj.password)
        return true
    return false;
}
