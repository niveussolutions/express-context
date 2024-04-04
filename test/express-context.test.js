'use-strict';

const express = require('express');
const expressContext = require('../index');
const supertest = require('supertest');


describe('Context scope.', () => {
    it('Does not store or return context outside of request', () => {
        const key = 'key';
        const [key1, key2] = ['key`', 'key2'];

        expressContext.set(key, 'key');
        expressContext.setMany({ key1, key2 });


        const result = expressContext.get(key);
        const [result1, result2] = expressContext.getMany([key1, key2]);

        expect.assertions(3);

        expect(result).not.toBe(key);
        expect(result1).not.toBe(key1);
        expect(result2).not.toBe(key2);
    });

});

describe('Context namespace : default namespace', () => {
    it('Should return default namespace if namespace id not specified', (done) => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {

            setTimeout(() => {
                const namespace = expressContext.getNs();

                res.status(200).json({ namespace: namespace.name });
            }, 5);
        });

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // Assert
            expect(res.body.namespace).toBe('018e142b-59d3-7222-a397-638b535086e5');

            done();
        });
    });
});


describe('Context namespace :  custom namespace', () => {
    it('Should return custom namespace if it is created.', (done) => {
        const app = express();

        app.use(expressContext.expressContextMiddleware({ nsid: 'custom-namespace' }));

        app.get('/test', (req, res) => {

            setTimeout(() => {
                const namespace = expressContext.getNs({ nsid: 'custom-namespace' });

                res.status(200).json({ namespace: namespace.name });
            }, 5);
        });

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // Assert
            expect(res.body.namespace).toBe('custom-namespace');

            done();
        });
    });
});


describe('Context namespace :  non exisitng namespace', () => {
    it('Should return undefined if namespace does not exist', (done) => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {

            setTimeout(() => {
                const namespace = expressContext.getNs({ nsid: 'missing-namespace-id' });

                res.status(200).json({ namespace: typeof (namespace) });
            }, 5);
        });

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // Assert
            expect(res.body.namespace).toBe('undefined');

            done();
        });
    });
});

describe('', () => {
    it('Should return undefined if namespace does not exist', (done) => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {

            setTimeout(() => {
                const namespace = expressContext.getNs({ nsid: 'missing-namespace-id' });

                res.status(200).json({ namespace: typeof (namespace) });
            }, 5);
        });

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // Assert
            expect(res.body.namespace).toBe('undefined');

            done();
        });
    });
});

describe('Returning undefined if value not found.', () => {
    it('Returns undefined when key is not found (get:set)', (done) => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {
            expressContext.set('existing-key', 'key-value');

            setTimeout(() => {
                const valueFromContext = expressContext.get('missing-key');
                res.status(200).json({ value: typeof (valueFromContext) });
            }, 5);
        });

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // Assert
            expect(res.body.value).toBe('undefined');

            done();
        });
    });

    it('Returns undefined when key is not found (getMany:setMany)', (done) => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {
            expressContext.setMany({ 'existing-key': 'key-value' });

            setTimeout(() => {
                const contextDataArray = expressContext.getMany(['missing-key']);
                res.status(200).json({ value: contextDataArray, itemType: typeof (contextDataArray[0]) });
            }, 5);
        });

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // Assert
            expect.assertions(3);

            expect(Array.isArray(res.body.value)).toBe(true);
            expect(res.body.value.length).toBe(1);
            expect(res.body.itemType).toBe('undefined'); // Because JSON.stringify([undefined]) = [null]

            done();
        });
    });

});

describe('callbacks', () => {
    it('Maintains unique value across concurrent requests with callbacks', () => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {
            const { value1, value2 } = req.query;

            // Set values in context
            expressContext.set('value1', value1);
            expressContext.setMany({ value2 });


            setTimeout(() => {
                const value1 = expressContext.get('value1');
                const [value2] = expressContext.getMany(['value2']);

                res.status(200).json({ value1, value2 });
            }, 5);
        });

        const sut = supertest(app);

        const value1 = 'value1';
        const value2 = 'value2';

        sut.get('/test').query({ value1, value2 }).end((err, res) => {
            expect.assertions(2);

            expect(res.body.value1).toBe(value1);
            expect(res.body.value2).toBe(value2);
        });
    });
});

describe('promises', () => {
    it('Maintains unique value across concurrent requests with promises', () => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {
            const { value1, value2 } = req.query;

            // Set values in context
            expressContext.set('value1', value1);
            expressContext.setMany({ value2 });

            const task = () => {
                new Promise(resolve => setTimeout(resolve, 5)).then(() => {
                    const value1 = expressContext.get('value1');
                    const [value2] = expressContext.getMany(['value2']);

                    res.status(200).json({ value1, value2 });
                });
            };

            task();
        });

        const sut = supertest(app);

        const value1 = 'value1';
        const value2 = 'value2';

        sut.get('/test').query({ value1, value2 }).end((err, res) => {
            expect.assertions(2);

            expect(res.body.value1).toBe(value1);
            expect(res.body.value2).toBe(value2);
        });
    });
});

describe('async/await', () => {
    it('Maintains unique value across concurrent requests with async/await', () => {
        const app = express();

        app.use(expressContext.expressContextMiddleware());

        app.get('/test', (req, res) => {
            const { value1, value2 } = req.query;

            // Set values in context
            expressContext.set('value1', value1);
            expressContext.setMany({ value2 });

            const task = async () => {
                await new Promise(resolve => setTimeout(resolve, 5));

                const value1 = expressContext.get('value1');
                const [value2] = expressContext.getMany(['value2']);

                res.status(200).json({ value1, value2 });
            };

            task();
        });

        const sut = supertest(app);

        const value1 = 'value1';
        const value2 = 'value2';

        sut.get('/test').query({ value1, value2 }).end((err, res) => {
            expect.assertions(2);

            expect(res.body.value1).toBe(value1);
            expect(res.body.value2).toBe(value2);
        });
    });
});
