import { Poly } from './Poly';
import { Vertex } from './Vertex';
import * as O from 'fp-ts/Option';

export class Line extends Poly {
  static fromVertices(v0: Vertex, v1: Vertex): Line {
    return new Line(v0.x, v0.y, v1.x, v1.y);
  }

  get horizontal(): boolean {
    return this.topLeft.y === this.bottomRight.y;
  }

  get vertical(): boolean {
    return this.topLeft.x === this.bottomRight.x;
  }

  /**
   * calculate the overlapping segments of two lines
   * does not account for slopes / slanted lines
   * since our current use case does not need it
   *
   * ```haskell
   * overlaps :: Line -> Option Line
   * ```
   */
  public overlaps(other: Line): O.Option<Line> {
    if (
      this.horizontal &&
      other.horizontal &&
      this.topLeft.y === other.topLeft.y
    ) {
      const left = Math.max(this.topLeft.x, other.topLeft.x);
      const right = Math.min(this.bottomRight.x, other.bottomRight.x);

      if (
        right > left &&
        left >= this.topLeft.x &&
        right <= this.bottomRight.x
      ) {
        return O.some(
          new Line(left, this.topLeft.y, right, this.bottomRight.y)
        );
      }
    }

    if (this.vertical && other.vertical && this.topLeft.x === other.topLeft.x) {
      const top = Math.max(this.topLeft.y, other.topLeft.y);
      const bottom = Math.min(this.bottomRight.y, other.bottomRight.y);

      if (
        bottom > top &&
        top >= this.topLeft.y &&
        bottom <= this.bottomRight.y
      ) {
        return O.some(
          new Line(this.topLeft.x, top, this.bottomRight.x, bottom)
        );
      }
    }

    return O.none;
  }

  /**
   * ```haskell
   * containsVertex :: Vertex -> Bool
   * ```
   */
  public containsVertex(vertex: Vertex): boolean {
    if (this.vertical) {
      return (
        vertex.x === this.topLeft.x &&
        vertex.y >= this.topLeft.y &&
        vertex.y <= this.bottomRight.y
      );
    }

    return (
      this.horizontal &&
      vertex.y === this.topLeft.y &&
      vertex.x >= this.topLeft.x &&
      vertex.x <= this.bottomRight.x
    );
  }
}
