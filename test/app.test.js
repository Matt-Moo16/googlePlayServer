const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');


describe('GET /apps endpoint', () => {
    //use case where user queries for all apps with no param
    it('should return an array of apps', () => {
        return request(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.at.least(1);
            const app = res.body[0];
            expect(app).to.include.all.keys('Rating', 'Genres', 'App')
        })
    });

    // use case where user sends sort param but it's invalid
    it('should only sort by rating or app', () => {
        return request(app)
        .get('/apps')
        .query({sort: 'WRONG'})
        .expect(400, 'Sort must be either rating or app');
    });
    
    // use case where it will sort apps by rating and param is valid
    it('should sort by rating', () => {
        return request(app)
        .get('/apps')
        .query({sort:'Rating'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let sorted = true;
            while(sorted && i < res.body.length - 1) {
                sorted = res.body[i].Rating >= res.body[i+1].Rating;
                i++;
            }
            expect(sorted).to.be.true
        })
    });

    // use case to sort by app name if param is valid
    it('should sort by app name', () => {
        return request(app)
        .get('/apps')
        .query({sort: 'App'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].App < res.body[i+1].App;
                    i++;
                }
                expect(sorted).to.be.true;
            })
        })
    });

    // use case to sort by genre if param is valid
    it('should sort by genres', () => {
        const expected = [
            {
                "App": "Block Puzzle Classic Legend !",
                "Category": "GAME",
                "Rating": 4.2,
                "Reviews": "17039",
                "Size": "4.9M",
                "Installs": "5,000,000+",
                "Type": "Free",
                "Price": "0",
                "Content Rating": "Everyone",
                "Genres": "Puzzle",
                "Last Updated": "April 13, 2018",
                "Current Ver": "2.9",
                "Android Ver": "2.3.3 and up"
            },
            {
                "App": "Block Puzzle",
                "Category": "GAME",
                "Rating": 4.6,
                "Reviews": "59800",
                "Size": "7.8M",
                "Installs": "5,000,000+",
                "Type": "Free",
                "Price": "0",
                "Content Rating": "Everyone",
                "Genres": "Puzzle",
                "Last Updated": "March 6, 2018",
                "Current Ver": "2.9",
                "Android Ver": "2.3 and up"
            }
          ]
        return request(app)
        .get('/apps')
        .query({genres: 'Puzzle'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).eql(expected)
        });
    });

})