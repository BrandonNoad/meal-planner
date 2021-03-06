import Moment from 'moment';
import * as types from './actionTypes';
import * as ActionCreators from './index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Action Creators', () => {

    describe('updateMoment', () => {

        it('should create an action to update the moment value', () => {

            const goto = 'today';

            const expectedAction = {
                type: types.UPDATE_MOMENT,
                goto
            };

            expect(ActionCreators.updateMoment(goto)).toEqual(expectedAction);
        });
    });

    describe('openAddRecipesModal', () => {

        it('should create an action to open the AddRecipesModal', () => {

            const moment = Moment();

            const expectedAction = {
                type: types.OPEN_ADD_RECIPES_MODAL,
                moment
            };

            expect(ActionCreators.openAddRecipesModal(moment)).toEqual(expectedAction);
        });
    });

    describe('closeAddRecipesModal', () => {

        it('should create an action to close the AddRecipesModal', () => {

            const expectedAction = {
                type: types.CLOSE_ADD_RECIPES_MODAL
            };

            expect(ActionCreators.closeAddRecipesModal()).toEqual(expectedAction);
        });
    });

    describe('fetchScheduledRecipesForDay', () => {

        const store = mockStore();

        beforeEach(() => {

            store.clearActions();
        });

        const moment = Moment();

        const date = moment.format('YYYY-MM-DD');

        const scheduledRecipes = [
            {
                id: 42,
                dateScheduled: '2018-07-27',
                recipe: { id: 99, name: 'recipe', url: 'www.recipe.com' }
            },
            {
                id: 43,
                dateScheduled: '2018-07-27',
                recipe: { id: 23, name: 'recipe2', url: 'www.recipe2.com' }
            }
        ];

        const totalCount = 3;

        const headers = {
            'x-total-count': totalCount,
            link: '<http://localhost:3001/api/v1.0/scheduledRecipes?date=2018-07-24&limit=2&page=1>; rel="self", ' +
            '<http://localhost:3001/api/v1.0/scheduledRecipes?date=2018-07-24&limit=2&page=1>; rel="first", ' +
            '<http://localhost:3001/api/v1.0/scheduledRecipes?date=2018-07-24&limit=2&page=2>; rel="last", ' +
            '<http://localhost:3001/api/v1.0/scheduledRecipes?date=2018-07-24&limit=2&page=2>; rel="next"'
        };

        describe('when day\'s metainformation is undefined', () => {

            const getMetaForDay = (state, moment) => undefined;

            describe('and the API request is successful', () => {

                const apiRequest = date => Promise.resolve({ data: scheduledRecipes, headers });

                const deps = { getMetaForDay, fetchScheduledRecipesForDay: apiRequest };

                const fetchScheduledRecipesForDay = ActionCreators.fetchScheduledRecipesForDayFactory(deps);

                it('should create FETCH_SCHEDULED_RECIPES_REQUEST and FETCH_SCHEDULED_RECIPES_SUCCESS actions', async () => {

                    const expectedActions = [
                        { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_REQUEST, date },
                        { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_SUCCESS, date,
                                data: scheduledRecipes, nextPage: 2, totalCount }
                    ];

                    await store.dispatch(fetchScheduledRecipesForDay(moment));

                    expect(store.getActions()).toEqual(expectedActions);
                });
            });

            describe('and the API request fails', () => {

                const errorMsg = 'fetchScheduledRecipesForDay API request failed!';

                const apiRequest = date => Promise.reject(new Error(errorMsg));

                const deps = { getMetaForDay, fetchScheduledRecipesForDay: apiRequest };

                const fetchScheduledRecipesForDay = ActionCreators.fetchScheduledRecipesForDayFactory(deps);

                it('should create FETCH_SCHEDULED_RECIPES_REQUEST and FETCH_SCHEDULED_RECIPES_FAILURE actions', async () => {

                    const expectedActions = [
                        { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_REQUEST, date },
                        { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_FAILURE, date, message: errorMsg }
                    ];

                    await store.dispatch(fetchScheduledRecipesForDay(moment));

                    expect(store.getActions()).toEqual(expectedActions);
                });

                describe('and the error thrown does not have a \'message\' property', () => {

                    const apiRequest = date => Promise.reject('error');

                    const deps = { getMetaForDay, fetchScheduledRecipesForDay: apiRequest };

                    const fetchScheduledRecipesForDay = ActionCreators.fetchScheduledRecipesForDayFactory(deps);

                    it('should create FETCH_SCHEDULED_RECIPES_REQUEST and FETCH_SCHEDULED_RECIPES_FAILURE actions', async () => {

                        const expectedActions = [
                            { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_REQUEST, date },
                            { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_FAILURE, date, message: 'Error fetching data!' }
                        ];

                        await store.dispatch(fetchScheduledRecipesForDay(moment));

                        expect(store.getActions()).toEqual(expectedActions);
                    });
                });
            });
        });

        describe('when day\'s metainformation is defined', () => {

            const apiRequest = date => Promise.resolve({ data: scheduledRecipes, headers });

            describe('when day\'s metainformation indicates an API request is already underway', () => {

                const getMetaForDay = (state, moment) => ({ isFetching: true });

                const deps = { getMetaForDay, fetchScheduledRecipesForDay: apiRequest };

                const fetchScheduledRecipesForDay = ActionCreators.fetchScheduledRecipesForDayFactory(deps);

                it('should not create any actions', async () => {

                    const expectedActions = [];

                    await store.dispatch(fetchScheduledRecipesForDay(moment));

                    expect(store.getActions()).toEqual(expectedActions);
                });
            });

            describe('when day\'s metainformation indicates a cached copy of the data exists', () => {

                const getMetaForDay = (state, moment) => ({ isCache: true });

                const deps = { getMetaForDay, fetchScheduledRecipesForDay: apiRequest };

                const fetchScheduledRecipesForDay = ActionCreators.fetchScheduledRecipesForDayFactory(deps);

                it('should not create any actions', async () => {

                    const expectedActions = [];

                    await store.dispatch(fetchScheduledRecipesForDay(moment));

                    expect(store.getActions()).toEqual(expectedActions);
                });
            });

            describe('when day\'s metainformation indicates the request has failed 3 or more times', () => {

                const getMetaForDay = (state, moment) => ({ numFailures: 3 });

                const deps = { getMetaForDay, fetchScheduledRecipesForDay: apiRequest };

                const fetchScheduledRecipesForDay = ActionCreators.fetchScheduledRecipesForDayFactory(deps);

                it('should not create any actions', async () => {

                    const expectedActions = [];

                    await store.dispatch(fetchScheduledRecipesForDay(moment));

                    expect(store.getActions()).toEqual(expectedActions);
                });
            });

            describe('when the day\'s metainformation would not prevent the request', () => {

                const getMetaForDay = (state, moment) => ({
                    isFetching: false,
                    isCache: false,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage: 2,
                    totalCount
                });

                describe('and the API request is successful', () => {

                    const apiRequest = date => Promise.resolve({ data: scheduledRecipes, headers });

                    const deps = { getMetaForDay, fetchScheduledRecipesForDay: apiRequest };

                    const fetchScheduledRecipesForDay = ActionCreators.fetchScheduledRecipesForDayFactory(deps);

                    it('should create FETCH_SCHEDULED_RECIPES_REQUEST and FETCH_SCHEDULED_RECIPES_SUCCESS actions', async () => {

                        const expectedActions = [
                            { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_REQUEST, date },
                            { type: types.FETCH_SCHEDULED_RECIPES_FOR_DAY_SUCCESS, date,
                                    data: scheduledRecipes, nextPage: 2, totalCount }
                        ];

                        await store.dispatch(fetchScheduledRecipesForDay(moment));

                        expect(store.getActions()).toEqual(expectedActions);
                    });
                });
            });
        });
    });
});
