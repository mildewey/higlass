import SVGTrack from './SVGTrack';

class EmptySVGTrack extends SVGTrack {
  constructor(svgElement) {
    super(svgElement);
  }


  // draw() {
  //   // this.axis.scale(this._yScale);
  //   // this.gAxis.call(this.axis);
  //   //
  //   // return this;
  // }
  //
  // zoomed(newXScale, newYScale) {
  //   super.zoomed(newXScale, newYScale);
  //
  //   this.draw();
  // }
  //
  // zoomed(newXScale, newYScale) {
  //   this.xScale(newXScale);
  //   this.yScale(newYScale);
  //
  //   this.draw();
  // }
}

export default EmptySVGTrack;
