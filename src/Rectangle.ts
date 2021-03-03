import { Line } from './Line';
import { Poly } from './Poly';
import { Vertex } from './Vertex';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

export class Rectangle extends Poly {
  public get width(): number {
    return this.bottomRight.x - this.topLeft.x;
  }

  public get height(): number {
    return this.bottomRight.y - this.topLeft.y;
  }

  public get area(): number {
    return this.width * this.height;
  }

  public get bottomLeft(): Vertex {
    return new Vertex(this.topLeft.x, this.bottomRight.y);
  }

  public get topRight(): Vertex {
    return new Vertex(this.bottomRight.x, this.topLeft.y);
  }

  public get top(): Line {
    return Line.fromVertices(this.topLeft, this.topRight);
  }

  public get left(): Line {
    return Line.fromVertices(this.topLeft, this.bottomLeft);
  }

  public get bottom(): Line {
    return Line.fromVertices(this.bottomLeft, this.bottomRight);
  }

  public get right(): Line {
    return Line.fromVertices(this.topRight, this.bottomRight);
  }

  /**
   * calculate the intersected areas of two rectangles
   * I can refactor to use null for no intersects found
   * if team is not familiar with monads
   *
   * using arrow functions to prevent bind(this) in pipe
   *
   * ```haskell
   * intersects :: Rectangle -> Option Rectangle
   * ```
   */
  public intersects = (other: Rectangle): O.Option<Rectangle> => {
    const x0 = Math.max(this.topLeft.x, other.topLeft.x);
    const y0 = Math.max(this.topLeft.y, other.topLeft.y);
    const x1 = Math.min(this.bottomRight.x, other.bottomRight.x);
    const y1 = Math.min(this.bottomRight.y, other.bottomRight.y);
    return x1 < x0 || y1 < y0 ? O.none : O.some(new Rectangle(x0, y0, x1, y1));
  };

  /**
   * calculate the adjacent line of two rectangles
   * using arrow functions to prevent bind(this) in pipe
   *
   * ```haskell
   * intersects :: Rectangle -> Line[]
   * ```
   */
  public adjacent = (other: Rectangle): Line[] => {
    // can do it with multiple if statements as well
    const lineSegment = [
      ['left', 'right'],
      ['top', 'bottom'],
    ];

    // we can use reduce to achieve this
    // but a conventional forEach seem
    // easier to maintain
    const adjacents = [];

    lineSegment.forEach((lines) =>
      lines.forEach((myLine) =>
        lines.forEach((theirLine) => {
          // if lines on the same dimension overlaps
          const overlap = this[myLine].overlaps(
            other[theirLine]
          ) as O.Option<Line>;

          // it is adjacent
          if (O.isSome(overlap)) {
            adjacents.push(overlap.value);
          }
        })
      )
    );

    return adjacents;
  };

  /**
   * calculate the point of intersections two rectangles
   *
   * ```haskell
   * intersectingVertices :: Rectangle -> [Vertex]
   * ```
   */
  public intersectingVertices(other: Rectangle): Vertex[] {
    // done in a functional programming paradigm
    // I can switch to imperative trivially if needed
    return pipe(
      other,
      this.intersects,
      O.fold(
        // empty array if no intersect
        () => [],
        // find overlapping vertices if intersect found
        (intersect) => {
          const vertices = [
            intersect.topLeft,
            intersect.topRight,
            intersect.bottomLeft,
            intersect.bottomRight,
          ];
          return vertices.filter(
            (vertex) =>
              this.overlapsVertex(vertex) && other.overlapsVertex(vertex)
          );
        }
      )
    );
  }

  /**
   * calculate the intersected union of two rectangles
   * does not account for missing areas
   *
   * ```haskell
   * unions :: Rectangle -> Rectangle
   * ```
   */
  public unions(other: Rectangle): Rectangle {
    const x0 = Math.max(this.topLeft.x, other.topLeft.x);
    const y0 = Math.max(this.topLeft.y, other.topLeft.y);
    const x1 = Math.min(this.bottomRight.x, other.bottomRight.x);
    const y1 = Math.min(this.bottomRight.y, other.bottomRight.y);
    return new Rectangle(x0, y0, x1, y1);
  }

  /**
   * ```haskell
   * ratioContaining :: Rectangle -> Float
   * ```
   */
  public ratioContaining(other: Rectangle): number {
    // once again, can do it imperative if preferred
    return pipe(
      other,
      this.intersects,
      O.fold(
        // no intersects
        () => 0,
        // intersects found
        ({ area }) => area / this.area
      )
    );
  }

  /**
   * ```haskell
   * contains :: Rectangle -> bool
   * ```
   */
  public contains(other: Rectangle, threshold = 1): boolean {
    const areaContaining = this.ratioContaining(other);
    const areaContainedBy = other.ratioContaining(this);
    return areaContaining >= threshold && areaContaining > areaContainedBy;
  }

  /**
   * ```haskell
   * overlapsVertex :: Vertex -> bool
   * ```
   */
  private overlapsVertex = (vertex: Vertex): boolean => {
    return (
      this.top.containsVertex(vertex) ||
      this.left.containsVertex(vertex) ||
      this.bottom.containsVertex(vertex) ||
      this.right.containsVertex(vertex)
    );
  };
}
