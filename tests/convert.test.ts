import request from 'supertest';
import { app } from '../app';

const baseQuery = {
  from: 'USD',
  to: 'JPY',
  amount: '1000'
};

describe(`GET /convert`, () => {
  describe(`"from" parameter`, () => {
    it('should be required', async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          ...baseQuery,
          from: undefined
        });

      expect(response.status).toEqual(400);
    });

    it('should be a currency supported by the ECB', async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          ...baseQuery,
          from: 'XXX'
        });

      expect(response.status).toEqual(400);
    });
  });

  describe(`"to" parameter`, () => {
    it('should be required', async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          ...baseQuery,
          to: undefined
        });

      expect(response.status).toEqual(400);
    });

    it('should be a currency supported by the ECB', async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          ...baseQuery,
          to: 'XXX'
        });

      expect(response.status).toEqual(400);
    });
  });

  describe(`"amount" parameter`, () => {
    it('should be required', async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          ...baseQuery,
          amount: undefined
        });

      expect(response.status).toEqual(400);
    });

    it(`should be a number`, async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          ...baseQuery,
          amount: '$100'
        });

      expect(response.status).toEqual(400);
    });
  });

  describe(`"precision" parameter`, () => {
    it(`should be optional and default to 4`, async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          from: 'EUR',
          to: 'EUR',
          amount: '1',
          precision: undefined
        });

      expect(response.status).toEqual(200);
      expect(response.body.amount.split('.')[1].length).toEqual(4);
    });

    it(`should be a positive integer`, async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          from: 'USD',
          to: 'EUR',
          amount: '100',
          precision: -1
        });

      expect(response.status).toEqual(400);
    });

    it(`can be changed`, async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          from: 'USD',
          to: 'EUR',
          amount: '100',
          precision: 6
        });

      expect(response.status).toEqual(200);
      expect(response.body.amount.split('.')[1].length).toEqual(6);
    });
  });

  describe(`conversion`, () => {
    it(`should convert from any two currencies`, async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          from: 'USD',
          to: 'JPY',
          amount: '1234.56'
        });

      expect(response.status).toEqual(200);
    });

    it(`should return same amount if currencies are the same`, async () => {
      const response = await request(app)
        .get('/convert')
        .query({
          from: 'USD',
          to: 'USD',
          amount: '50'
        });

      expect(response.status).toEqual(200);
      expect(response.body.amount).toEqual('50.0000');
    });
  });

  describe(`response`, () => {
    it(`should return a JSON object in UTF-8`, async () => {
      const response = await request(app)
        .get('/convert')
        .query(baseQuery);

      expect(response.status).toEqual(200);
      expect(response.header['content-type']).toBe(
        'application/json; charset=utf-8'
      );
    });

    it(`should have "currency" and "amount"`, async () => {
      const response = await request(app)
        .get('/convert')
        .query(baseQuery);

      expect(response.status).toEqual(200);
      expect(typeof response.body.currency).toBe('string');
      expect(typeof response.body.amount).toBe('string');
    });

    it(`should return the target currency`, async () => {
      const response = await request(app)
        .get('/convert')
        .query(baseQuery);

      expect(response.status).toEqual(200);
      expect(response.body.currency).toBe(baseQuery.to);
    });
  });
});
