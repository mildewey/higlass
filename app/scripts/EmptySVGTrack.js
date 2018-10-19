import SVGTrack from './SVGTrack';

class EmptySVGTrack extends SVGTrack {
  constructor(svgElement) {
    super(svgElement);
    this.gEmpty = this.gMain
      .append('g');
  }

  // draw() {
  //   console.log('draw?')
  //   // TODO
  // }

  zoomed(newXScale, newYScale) {
    console.log('zoomed');
    //super.zoomed(newXScale, newYScale
    const x = newXScale(0);
    const y = newYScale(0);
    this.gEmpty.attr('transform', `translate(${x}, ${y})`);

    this.draw();
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
