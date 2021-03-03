export class Vertex {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * ```haskell
 * makeTopLeftVertex :: (Float, Float, Float, Float) -> Vertex
 * ```
 */
export const makeTopLeftVertex = (
  x0: number,
  y0: number,
  x1: number,
  y1: number
): Vertex => new Vertex(Math.min(x0, x1), Math.min(y0, y1));

/**
 * ```haskell
 * makeTopRightVertex :: (Float, Float, Float, Float) -> Vertex
 * ```
 */
export const makeTopRightVertex = (
  x0: number,
  y0: number,
  x1: number,
  y1: number
): Vertex => new Vertex(Math.max(x0, x1), Math.min(y0, y1));

/**
 * ```haskell
 * makeBottomLeftVertex :: (Float, Float, Float, Float) -> Vertex
 * ```
 */
export const makeBottomLeftVertex = (
  x0: number,
  y0: number,
  x1: number,
  y1: number
): Vertex => new Vertex(Math.min(x0, x1), Math.max(y0, y1));

/**
 * ```haskell
 * makeBottomRightVertex :: (Float, Float, Float, Float) -> Vertex
 * ```
 */
export const makeBottomRightVertex = (
  x0: number,
  y0: number,
  x1: number,
  y1: number
): Vertex => new Vertex(Math.max(x0, x1), Math.max(y0, y1));
