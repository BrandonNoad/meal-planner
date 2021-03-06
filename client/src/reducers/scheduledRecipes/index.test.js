import Moment from 'moment';
import scheduledRecipes, { getScheduledRecipesForDayFactory, getMetaForDayFactory } from './index';
import * as actionTypes from '../../actions/actionTypes';

describe('scheduledRecipes reducer', () => {
    describe('when the state arg is undefined', () => {
        it('should return the initial state', () => {
            const newState = scheduledRecipes(undefined, {});

            expect(newState).toEqual({});
        });
    });

    it('should handle FETCH_SCHEDULED_RECIPES_FOR_DAY_REQUEST', () => {
        const date = '2017-07-31';

        const fetchScheduledRecipesForDayRequest = () => ({
            type: actionTypes.FETCH_SCHEDULED_RECIPES_FOR_DAY_REQUEST,
            date
        });

        let previousState = {};

        let newState = scheduledRecipes(previousState, fetchScheduledRecipesForDayRequest());

        expect(newState).toEqual({
            [date]: {
                meta: {
                    isFetching: true,
                    isCache: false,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        });

        previousState = {
            '2018-08-01': {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: 'error',
                    numFailures: 3,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        };

        newState = scheduledRecipes(previousState, fetchScheduledRecipesForDayRequest());

        expect(newState).toEqual({
            ...previousState,
            [date]: {
                meta: {
                    isFetching: true,
                    isCache: false,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        });

        previousState = {
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: true,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        };

        newState = scheduledRecipes(previousState, fetchScheduledRecipesForDayRequest());

        expect(newState).toEqual({
            [date]: {
                meta: {
                    isFetching: true,
                    isCache: false,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        });
    });

    it('should handle FETCH_SCHEDULED_RECIPES_FOR_DAY_SUCCESS', () => {
        const date = '2017-07-31';

        const nextPage = 2;

        const totalCount = 42;

        const fetchScheduledRecipesForDaySuccess = () => ({
            type: actionTypes.FETCH_SCHEDULED_RECIPES_FOR_DAY_SUCCESS,
            date,
            data: [],
            nextPage,
            totalCount
        });

        let previousState = {};

        let newState = scheduledRecipes(previousState, fetchScheduledRecipesForDaySuccess());

        expect(newState).toEqual({
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: true,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage,
                    totalCount
                },
                data: []
            }
        });

        previousState = {
            '2018-08-01': {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: 'error',
                    numFailures: 3,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        };

        newState = scheduledRecipes(previousState, fetchScheduledRecipesForDaySuccess());

        expect(newState).toEqual({
            ...previousState,
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: true,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage,
                    totalCount
                },
                data: []
            }
        });

        previousState = {
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: 'error',
                    numFailures: 3,
                    nextPage,
                    totalCount
                },
                data: []
            }
        };

        newState = scheduledRecipes(previousState, fetchScheduledRecipesForDaySuccess());

        expect(newState).toEqual({
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: true,
                    errorMessage: null,
                    numFailures: 0,
                    nextPage,
                    totalCount
                },
                data: []
            }
        });
    });

    it('should handle FETCH_SCHEDULED_RECIPES_FOR_DAY_FAILURE', () => {
        const date = '2017-07-31';

        const errorMsg = 'Error fetching data!';

        const fetchScheduledRecipesForDayFailure = () => ({
            type: actionTypes.FETCH_SCHEDULED_RECIPES_FOR_DAY_FAILURE,
            date,
            message: errorMsg
        });

        let previousState = {};

        let newState = scheduledRecipes(previousState, fetchScheduledRecipesForDayFailure());

        expect(newState).toEqual({
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: errorMsg,
                    numFailures: 1,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        });

        previousState = {
            '2018-08-01': {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: 'error',
                    numFailures: 3,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        };

        newState = scheduledRecipes(previousState, fetchScheduledRecipesForDayFailure());

        expect(newState).toEqual({
            ...previousState,
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: errorMsg,
                    numFailures: 1,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        });

        previousState = {
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: 'error',
                    numFailures: 3,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        };

        newState = scheduledRecipes(previousState, fetchScheduledRecipesForDayFailure());

        expect(newState).toEqual({
            [date]: {
                meta: {
                    isFetching: false,
                    isCache: false,
                    errorMessage: errorMsg,
                    numFailures: 4,
                    nextPage: 1,
                    totalCount: 0
                },
                data: []
            }
        });
    });
});

const date = '2018-08-01';

const stateForDate = {
    meta: {
        isFetching: false,
        isCache: false,
        errorMessage: 'error',
        numFailures: 3,
        nextPage: 1,
        totalCount: 0
    },
    data: [
        {
            id: 42,
            dateScheduled: date,
            recipe: { id: 99, name: 'recipe', url: 'www.recipe.com' }
        },
        {
            id: 43,
            dateScheduled: date,
            recipe: { id: 21, name: 'recipe2', url: 'www.recipe2.com' }
        }
    ]
};

const state = {
    [date]: stateForDate,
    '2018-07-27': {
        meta: {
            isFetching: false,
            isCache: true,
            errorMessage: null,
            numFailures: 0,
            nextPage: 1,
            totalCount: 0
        },
        data: []
    }
};

const moment = Moment(date);

describe('getScheduledRecipesForDay selector', () => {
    const getScheduledRecipesForDate = jest.fn();

    const getScheduledRecipesForDay = getScheduledRecipesForDayFactory(getScheduledRecipesForDate);

    it('should call the data selector with the correct state', () => {
        getScheduledRecipesForDay(state, moment);

        expect(getScheduledRecipesForDate).toHaveBeenCalledWith(stateForDate);
    });
});

describe('getMetaForDay selector', () => {
    const getMetaForDate = jest.fn();

    const getMetaForDay = getMetaForDayFactory(getMetaForDate);

    it('should call the meta selector with the correct state', () => {
        getMetaForDay(state, moment);

        expect(getMetaForDate).toHaveBeenCalledWith(stateForDate);
    });
});
