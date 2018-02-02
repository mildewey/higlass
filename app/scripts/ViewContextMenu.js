import { mix } from 'mixwith';

import React from 'react';
import PropTypes from 'prop-types';

import { getSeriesItems } from './SeriesListItems';

import ContextMenuItem from './ContextMenuItem';
import ContextMenuContainer from './ContextMenuContainer';
import SeriesListSubmenuMixin from './SeriesListSubmenuMixin';

// Styles
import '../styles/ContextMenu.module.scss';

class ViewContextMenu extends mix(ContextMenuContainer).with(SeriesListSubmenuMixin) {
  render() {
    return (
      <div
        ref={(c) => { this.div = c; }}
        style={{
          left: this.state.left,
          top: this.state.top,
        }}
        styleName="context-menu"
      >

        {getSeriesItems(
          this.props.tracks,
          this.handleItemMouseEnter.bind(this),
          this.handleMouseLeave.bind(this),
          null
        )}

        <hr styleName="context-menu-hr" />

        <ContextMenuItem
          onClick={() => this.props.onAddTrack({
            type: 'horizontal-rule',
            y: this.props.coords[1],
            position: 'whole',
          })}
          onMouseEnter={e => this.handleOtherMouseEnter(e)}
        >
          {'Add Horizontal Rule'}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => this.props.onAddTrack({
            type: 'vertical-rule',
            x: this.props.coords[0],
            position: 'whole',
          })}
          onMouseEnter={e => this.handleOtherMouseEnter(e)}
        >
          {'Add Vertical Rule'}
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => this.props.onAddTrack({
            type: 'cross-rule',
            x: this.props.coords[0],
            y: this.props.coords[1],
            position: 'whole',
          })}
          onMouseEnter={e => this.handleOtherMouseEnter(e)}
        >
          {'Add Cross Rule'}
        </ContextMenuItem>


        { /* from the SeriesListSubmenuMixin */ }
        { this.getSubmenu() }

      </div>
    );
  }
}

ViewContextMenu.propTypes = {
  // the data coordinates where this context menu was initiated
  coords: PropTypes.array,
};

export default ViewContextMenu;
