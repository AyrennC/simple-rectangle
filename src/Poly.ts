import { makeBottomRightVertex, makeTopLeftVertex, Vertex } from './Vertex';

export class Poly {
  public readonly topLeft: Vertex;
  public readonly bottomRight: Vertex;

  constructor(x0: number, y0: number, x1: number, y1: number) {
    this.topLeft = makeTopLeftVertex(x0, y0, x1, y1);
    this.bottomRight = makeBottomRightVertex(x0, y0, x1, y1);
  }

  public get bottomLeft(): Vertex {
    return new Vertex(this.topLeft.x, this.bottomRight.y);
  }

  public get topRight(): Vertex {
    return new Vertex(this.bottomRight.x, this.topLeft.y);
  }

  public toObject(): Record<string, number> {
    return {
      x0: this.topLeft.x,
      y0: this.topLeft.y,
      x1: this.bottomRight.x,
      y1: this.bottomRight.y,
    };
  }
}
