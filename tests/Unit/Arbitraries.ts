import { Rectangle, Vertex } from '../../src';
import fc, { Arbitrary } from 'fast-check';

export const number = (): Arbitrary<number> => fc.double({ max: 1 });

export const vertex = (): Arbitrary<Vertex> =>
  fc.record({
    x: number(),
    y: number(),
  });

export const rectangle = (): Arbitrary<Rectangle> =>
  fc
    .array(number(), { minLength: 4, maxLength: 4 })
    .map(([x0, y0, x1, y1]) => new Rectangle(x0, y0, x1, y1));

export const separates = (): Arbitrary<[Rectangle, Rectangle]> =>
  fc
    .tuple(rectangle(), rectangle())
    .filter(
      ([rect, other]) =>
        rect.bottomRight.y < other.topLeft.y ||
        rect.topLeft.y > other.bottomRight.y ||
        rect.bottomRight.x < other.topLeft.x ||
        rect.topLeft.x > other.bottomRight.x
    );

export const overlaps = (): Arbitrary<[Rectangle, Rectangle]> =>
  fc
    .tuple(rectangle(), rectangle())
    .filter(
      ([rect, other]) =>
        rect.bottomRight.y >= other.topLeft.y &&
        rect.topLeft.y <= other.bottomRight.y &&
        rect.bottomRight.x >= other.topLeft.x &&
        rect.topLeft.x <= other.bottomRight.x
    );

export const partialOverlaps = (): Arbitrary<[Rectangle, Rectangle]> =>
  overlaps().filter(([rect, other]) => rect.ratioContaining(other) < 1);

export const completeOverlaps = (): Arbitrary<[Rectangle, Rectangle]> =>
  overlaps().filter(([rect, other]) => rect.ratioContaining(other) == 1);
