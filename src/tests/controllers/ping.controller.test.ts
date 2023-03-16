import { expect } from 'chai';
import axios from 'axios';
import '../../app';

describe('Ping controller', function () {
  const instance = axios.create({
    baseURL: 'http://localhost:3000/v1',
    validateStatus: undefined
  });

  describe('GET /ping', function () {
    it('should return 200.', async () => {
      const response = await instance.get('/ping');

      expect(response.status).to.equal(200);
    });

    it('should return ping.', async () => {
      const response = await instance.get('/ping');

      expect(response.data).to.equal('pong');
    });
  });
});
