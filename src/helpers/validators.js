import { uniq } from 'lodash';
import {
  allPass,
  applySpec,
  complement,
  compose,
  equals,
  filter,
  lt,
  prop,
  values,
  length,
  all,
  anyPass,
  both,
  converge,
} from 'ramda';
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const getSquare = prop('square');
const getStar = prop('star');
const getCircle = prop('circle');
const getTriangle = prop('triangle');
const getFigures = applySpec({
  square: getSquare,
  circle: getCircle,
  triangle: getTriangle,
  star: getStar,
});
const getSquareAndTriangle = applySpec({
  square: getSquare,
  triangle: getTriangle,
});
const getFiguresColorsArray = compose(values, getFigures);

const isColorWhite = equals('white');
const isColorRed = equals('red');
const isColorGreen = equals('green');
const isColorOrange = equals('orange');
const isColorBlue = equals('blue');

const isColorNotWhite = complement(isColorWhite);
const isColorNotRed = complement(isColorRed);

const isSquareWhite = compose(isColorWhite, getSquare);
const isSquareNotWhite = compose(isColorNotWhite, getSquare);
const isSquareOrange = compose(isColorOrange, getSquare);
const isSquareGreen = compose(isColorGreen, getSquare);
const isSquareRed = compose(isColorRed, getSquare);
const isSquareBlue = compose(isColorBlue, getSquare);

const isStarWhite = compose(isColorWhite, getStar);
const isStarNotWhite = compose(isColorNotWhite, getStar);
const isStarOrange = compose(isColorOrange, getStar);
const isStarGreen = compose(isColorGreen, getStar);
const isStarRed = compose(isColorRed, getStar);
const isStarNotRed = compose(isColorNotRed, getStar);
const isStarBlue = compose(isColorBlue, getStar);

const isTriangleWhite = compose(isColorWhite, getTriangle);
const isTriangleNotWhite = compose(isColorNotWhite, getTriangle);
const isTriangleOrange = compose(isColorOrange, getTriangle);
const isTriangleGreen = compose(isColorGreen, getTriangle);
const isTriangleRed = compose(isColorRed, getTriangle);
const isTriangleBlue = compose(isColorBlue, getTriangle);

const isCircleWhite = compose(isColorWhite, getCircle);
const isCircleNotWhite = compose(isColorNotWhite, getCircle);
const isCircleOrange = compose(isColorOrange, getCircle);
const isCircleGreen = compose(isColorGreen, getCircle);
const isCircleRed = compose(isColorRed, getCircle);
const isCircleBlue = compose(isColorBlue, getCircle);

const isAllOrange = all(isColorOrange);
const isAllGreen = all(isColorGreen);

const filterGreen = filter(isColorGreen);
const filterGreenLength = compose(length, filterGreen, getFiguresColorsArray);
const filterBlue = filter(isColorBlue);
const filterBlueLength = compose(length, filterBlue, getFiguresColorsArray);
const filterRed = filter(isColorRed);
const filterRedLength = compose(length, filterRed, getFiguresColorsArray);
const filterOrange = filter(isColorOrange);
const filterOrangeLength = compose(length, filterOrange, getFiguresColorsArray);

const isMoreThanOne = lt(1);
const isMoreThanTwo = lt(2);
const isEqualOne = equals(1);
const isEqualTwo = equals(2);

const isSquareGreenStarRedOtherWhite = allPass([
  isTriangleWhite,
  isCircleWhite,
  isStarRed,
  isSquareGreen,
]);

const isGreenFigureMoreThenOne = compose(isMoreThanOne, filterGreenLength);

const isRedAndBlueEqual = converge(equals, [filterBlueLength, filterRedLength]);

const isCircleBlueStarRedSquareOrange = allPass([isCircleBlue, isStarRed, isSquareOrange]);

const isGreenFigureMoreThenTwo = compose(isMoreThanTwo, filterGreenLength);
const isBlueFigureMoreThenTwo = compose(isMoreThanTwo, filterBlueLength);
const isRedFigureMoreThenTwo = compose(isMoreThanTwo, filterRedLength);
const isOrangeFigureMoreThenTwo = compose(isMoreThanTwo, filterOrangeLength);
const isGreenFigureEqualTwo = compose(isEqualTwo, filterGreenLength);
const isRedFigureEqualOne = compose(isEqualOne, filterRedLength);

const isSameColorFigureMoreThenTwo = anyPass([
  isGreenFigureMoreThenTwo,
  isBlueFigureMoreThenTwo,
  isRedFigureMoreThenTwo,
  isOrangeFigureMoreThenTwo,
]);

const isTwoGreenOneRed = allPass([isTriangleGreen, isGreenFigureEqualTwo, isRedFigureEqualOne]);

const isAllFigureOrange = compose(isAllOrange, getFiguresColorsArray);

const isStarNotWhiteNotRed = both(isStarNotWhite, isStarNotRed);

const isAllFigureGreen = compose(isAllGreen, getFiguresColorsArray);

const isSquareAndTriangleSameColor = compose(
  isEqualOne,
  length,
  uniq,
  values,
  getSquareAndTriangle,
);
const isSquareAndTriangleSameColorAndNotWhite = allPass([
  isSquareAndTriangleSameColor,
  isTriangleNotWhite,
]);

// tap(console.log),

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = isSquareGreenStarRedOtherWhite;

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = isGreenFigureMoreThenOne;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = isRedAndBlueEqual;
// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = isCircleBlueStarRedSquareOrange;

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = isSameColorFigureMoreThenTwo;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = isTwoGreenOneRed;

// 7. Все фигуры оранжевые.
export const validateFieldN7 = isAllFigureOrange;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = isStarNotWhiteNotRed;

// 9. Все фигуры зеленые.
export const validateFieldN9 = isAllFigureGreen;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = isSquareAndTriangleSameColorAndNotWhite;
