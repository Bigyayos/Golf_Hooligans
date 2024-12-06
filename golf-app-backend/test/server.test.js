import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';

chai.use(chaiHttp);
const should = chai.should();

describe('Torneos', () => {
  it('debería obtener todos los torneos', (done) => {
    chai.request(server)
      .get('/torneos')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('debería añadir un nuevo torneo', (done) => {
    const torneo = {
      name: 'Torneo de Prueba',
      date: '2023-10-10',
      location: 'Madrid'
    };
    chai.request(server)
      .post('/torneos')
      .send(torneo)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('Torneo añadido...');
        done();
      });
  });
});