'use strict';

const Hapi = require('hapi');

describe('GET /recipes', () => {
    const server = Hapi.server({ debug: false });

    const routeFactory = require('../../../../app/routes/recipe/fetch-all/factory');

    const handler = jest.fn();

    const route = routeFactory(handler);

    const pluginFactory = require('../../../../app/routes/recipe/factory');

    const plugin = pluginFactory([route]);

    beforeAll(() => {
        return server.register(plugin);
    });

    afterEach(() => {
        handler.mockClear();
    });

    const url = '/recipes';

    it(`should call the route's handler when the request is valid`, async () => {
        await server.inject({ url });

        expect(handler).toHaveBeenCalledTimes(1);
    });

    // TODO: test it is using the correct validators.
});
