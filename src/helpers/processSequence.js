/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import {
  allPass,
  andThen,
  compose,
  curry,
  gt,
  length,
  lt,
  modulo,
  otherwise,
  prop,
  tap,
  test,
  replace,
  __,
  ifElse,
  assoc,
  converge,
  call,
  applySpec,
  lensProp,
  over,
} from 'ramda';
import Api from '../tools/api';

const api = new Api();

const getValue = prop('value');
const getWriteLog = prop('writeLog');
const getHandleSuccess = prop('handleSuccess');
const getHandleError = prop('handleError');

const data = applySpec({
  value: getValue,
  writeLog: curry(getWriteLog),
  handleError: curry(getHandleError),
  handleSuccess: curry(getHandleSuccess),
});

const log = converge(call, [getWriteLog, getValue]);

const logValidateError = converge(call, [getHandleError, () => 'ValidationError']);

const xValue = lensProp('value');

const isTestAsFloatNumber = compose(test(/^([0-9]*[.])?[0-9]+$/), getValue);
const isGreatThanTwo = lt(2);
const isLengthGreatThanTwo = compose(isGreatThanTwo, length, getValue);
const isLessThanTen = gt(10);
const isLengthLessThanTen = compose(isLessThanTen, length, getValue);
const isInputValid = allPass([isTestAsFloatNumber, isLengthGreatThanTwo, isLengthLessThanTen]);

const parseToFloat = over(xValue, parseFloat);
const roundValue = over(xValue, Math.round);

const convertToNumberAndRound = compose(roundValue, parseToFloat);

const curriedPow = curry(Math.pow);
const getLength = over(xValue, length);
const sq = over(xValue, curriedPow(__, 2));
const remainderBy3 = over(xValue, modulo(__, 3));

const curriedApiGet = curry(api.get);
const fetchAnimalApi = curriedApiGet(__, {});
const fetchNumberApi = curriedApiGet('https://api.tech/numbers/base');
const getPayload = assoc('number', __, { from: 10, to: 2 });

const getPromiseFromNumApi = (data) =>
  compose(assoc('value', __, data), fetchNumberApi, getPayload, getValue)(data);

const getUrlForAnimal = replace('{id}', __, 'https://animals.tech/{id}');

const getPromiseAnimalApi = (data) =>
  compose(assoc('value', __, data), fetchAnimalApi, getUrlForAnimal, getValue)(data);

const successAnimal = (data) => compose(data.handleSuccess, prop('result'));

const promiseAnimal = (data) =>
  compose(otherwise(data.handleError), andThen(successAnimal(data)), getValue)(data);

const parsePromiseAndFetchAnimalApi = (data) =>
  compose(
    promiseAnimal,
    getPromiseAnimalApi,
    tap(log),
    remainderBy3,
    tap(log),
    sq,
    tap(log),
    getLength,
    tap(log),
    assoc('value', __, data),
    prop('result'),
  );

const promiseNum = (data) =>
  compose(
    otherwise(data.handleError),
    andThen(parsePromiseAndFetchAnimalApi(data)),
    getValue,
  )(data);

const ifInputValidFetchApi = ifElse(
  isInputValid,
  compose(promiseNum, getPromiseFromNumApi, tap(log), convertToNumberAndRound),
  logValidateError,
);

const app = compose(ifInputValidFetchApi, tap(log));

const processSequence = app;

export default processSequence;
