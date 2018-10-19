import SVGTrack from './SVGTrack';

class EmptySVGTrack extends SVGTrack {
  constructor(svgElement) {
    super(svgElement);
    this.gEmpty = this.gMain
      .append('g');
  }

  zoomed(newXScale, newYScale) {
    const x = newXScale(0);
    const y = newYScale(0);
    const dx = newXScale(1) - x;
    this.gEmpty.attr('transform', `translate(${x}, ${y}) scale(${dx})`);
    this.draw();
  }
}

export default EmptySVGTrack;
