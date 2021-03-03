import * as A from './Arbitraries';
import { Rectangle, Vertex } from '../../src';
import { Line } from '../../src/Line';
import chai from 'chai';
import fc from 'fast-check';
import * as O from 'fp-ts/Option';
const { expect } = chai;

chai.config.truncateThreshold = 0;

describe('Rectangle', function () {
  describe('#area()', function () {
    it('should return 0 if all four corners are the same', function () {
      fc.assert(
        fc.property(A.number(), (x) => {
          const rect = new Rectangle(x, x, x, x);
          const actualArea = rect.area;
          expect(actualArea).to.be.equal(0);
        })
      );
    });
  });

  describe('#intersects()', function () {
    it('should return a None Option if there are not overlaps between two Rectangle', function () {
      fc.assert(
        fc.property(A.separates(), ([rect, other]) => {
          const actualIntersect = rect.intersects(other);
          expect(actualIntersect).to.satisfies(O.isNone);
        }),
        {
          examples: [
            [[new Rectangle(0, 0, 0.3, 0.3), new Rectangle(0.5, 0.5, 1, 1)]],
          ],
        }
      );
    });

    it('should return the intersection if there are overlaps between two Rectangle', function () {
      const rect = new Rectangle(0, 0, 0.3, 0.3);
      const other = new Rectangle(0.1, 0.1, 0.5, 1);

      const actualIntersect = (rect.intersects(
        other
      ) as O.Some<Rectangle>).value.toObject();

      const expectedIntersect = new Rectangle(0.1, 0.1, 0.3, 0.3).toObject();
      expect(actualIntersect).to.deep.equal(expectedIntersect);
    });
  });

  describe('#adjacent()', function () {
    it('should return an empty array if there are not overlapping lines between two Rectangle', function () {
      fc.assert(
        fc.property(A.separates(), ([rect, other]) => {
          const actualLines = rect.adjacent(other);
          expect(actualLines).to.be.empty;
        }),
        {
          examples: [
            [[new Rectangle(0, 0, 0.3, 0.3), new Rectangle(0.5, 0.5, 1, 1)]],
          ],
        }
      );
    });

    it('should return the overlapping line if the target is sub-line adjacent', function () {
      const rect = new Rectangle(1, 1, 3, 4);
      const other = new Rectangle(3, 2, 4, 3);

      const actualLines = rect.adjacent(other);

      const expectedLines = [new Line(3, 2, 3, 3)];
      expect(actualLines).to.deep.equal(expectedLines);
    });

    it('should return the overlapping line if the target is proper adjacent', function () {
      const rect = new Rectangle(1, 1, 3, 4);
      const other = new Rectangle(3, 1, 4, 4);

      const actualLines = rect.adjacent(other);

      const expectedLines = [new Line(3, 1, 3, 4)];
      expect(actualLines).to.deep.equal(expectedLines);
    });

    it('should return the overlapping line if the target is partial adjacent', function () {
      const rect = new Rectangle(1, 1, 3, 4);
      const other = new Rectangle(3, 0, 4, 2);

      const actualLines = rect.adjacent(other);

      const expectedLines = [new Line(3, 1, 3, 2)];
      expect(actualLines).to.deep.equal(expectedLines);
    });
  });

  describe('#intersectingVertices()', function () {
    it('should return an empty array if there are not overlaps between two Rectangle', function () {
      fc.assert(
        fc.property(A.separates(), ([rect, other]) => {
          const actualIntersect = rect.intersectingVertices(other);
          expect(actualIntersect).to.be.empty;
        }),
        {
          examples: [
            [[new Rectangle(0, 0, 0.3, 0.3), new Rectangle(0.5, 0.5, 1, 1)]],
          ],
        }
      );
    });

    it('should return the intersection if the target is contained in the bottom right corner', function () {
      const rect = new Rectangle(0, 0, 0.3, 0.3);
      const other = new Rectangle(0.1, 0.1, 0.5, 1);

      const actualVertices = rect.intersectingVertices(other);

      const expectedVertices = [new Vertex(0.3, 0.1), new Vertex(0.1, 0.3)];
      expect(actualVertices).to.deep.equal(expectedVertices);
    });

    it('should return the intersection if the target is contained in the top right corner', function () {
      const rect = new Rectangle(1, 1, 3, 4);
      const other = new Rectangle(2, 0, 4, 2);

      const actualVertices = rect.intersectingVertices(other);

      const expectedVertices = [new Vertex(2, 1), new Vertex(3, 2)];
      expect(actualVertices).to.deep.equal(expectedVertices);
    });

    it('should return the intersection if the target is contained in the left middle', function () {
      const rect = new Rectangle(1, 1, 3, 4);
      const other = new Rectangle(0, 2, 2, 3);

      const actualVertices = rect.intersectingVertices(other);

      const expectedVertices = [new Vertex(1, 2), new Vertex(1, 3)];
      expect(actualVertices).to.deep.equal(expectedVertices);
    });
  });

  describe('#ratioContaining()', function () {
    it('should return 0 if there are not overlaps between two Rectangle', function () {
      fc.assert(
        fc.property(A.separates(), ([rect, other]) => {
          const actualArea = rect.ratioContaining(other);
          expect(actualArea).to.be.equal(0);
        }),
        {
          examples: [
            [[new Rectangle(0, 0, 0.3, 0.3), new Rectangle(0.5, 0.5, 1, 1)]],
          ],
        }
      );
    });

    it('should return 1 if given two identical Rectangles', function () {
      fc.assert(
        fc.property(A.rectangle(), (rect) => {
          const actualArea = rect.ratioContaining(rect);
          expect(actualArea).to.be.equal(1);
        })
      );
    });

    it('should return a value greater than 0 if there are overlaps between two Rectangle', function () {
      fc.assert(
        fc.property(A.overlaps(), ([rect, other]) => {
          const actualArea = rect.ratioContaining(other);
          expect(actualArea).to.be.greaterThan(0);
        }),
        {
          examples: [
            [
              [new Rectangle(0, 0, 0.3, 0.3), new Rectangle(0.1, 0.1, 0.5, 1)],
              [new Rectangle(1, 1, 3, 4), new Rectangle(0, 2, 2, 3)],
            ],
          ],
        }
      );
    });
  });

  describe('#contains()', function () {
    it('should return false if there are not overlaps between two Rectangle', function () {
      fc.assert(
        fc.property(A.separates(), ([rect, other]) => {
          const actualResult = rect.contains(other);
          expect(actualResult).to.be.false;
        })
      );
    });

    it('should return false if there are overlaps, but the target is not fully contained by the Rectangle', function () {
      fc.assert(
        fc.property(A.partialOverlaps(), ([rect, other]) => {
          const actualResult = rect.contains(other);
          expect(actualResult).to.be.false;
        }),
        {
          examples: [
            [[new Rectangle(0, 0, 0.3, 0.3), new Rectangle(0.1, 0.1, 0.5, 1)]],
          ],
        }
      );
    });

    it('should return true if the target is fully contained by the Rectangle', function () {
      fc.assert(
        fc.property(A.completeOverlaps(), ([rect, other]) => {
          const actualArea = rect.ratioContaining(other);
          expect(actualArea).to.be.greaterThan(0);
        }),
        {
          examples: [
            [[new Rectangle(0, 0, 0.6, 2), new Rectangle(0.1, 0.1, 0.5, 1)]],
          ],
        }
      );
    });
  });
});
