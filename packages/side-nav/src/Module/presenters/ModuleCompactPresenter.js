import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { ThemeContext } from "@hig/themes";
import { memoizeCreateButtonEventHandlers } from "@hig/utils";

import "./module.scss";

export default class ModuleCompact extends Component {
  static propTypes = {
    /** Indicates this module is currently active */
    active: PropTypes.bool,
    /** Indicates a nested submodule is currently active */
    activeChildren: PropTypes.bool,
    /** An instance of @hig/icon */
    icon: PropTypes.node.isRequired,
    /** Called when clicking on the title */
    onClickTitle: PropTypes.func,
    /** Called when link is focused  */
    onFocus: PropTypes.func,
    /** Called when hovering over the icon */
    onMouseOver: PropTypes.func
  };

  createEventHandlers = memoizeCreateButtonEventHandlers();

  render() {
    const {
      active,
      activeChildren,
      icon,
      onClickTitle,
      onFocus,
      onMouseOver
    } = this.props;
    const classes = themeClass => cx(themeClass, "hig__side-nav__module");
    const { handleClick, handleKeyDown } = this.createEventHandlers(
      onClickTitle
    );

    const linkClasses = themeClass =>
      cx(themeClass, "hig__side-nav__module__link", {
        "hig__side-nav__module__link--active": active,
        "hig__side-nav__module__link--active-children": activeChildren
      });

    return (
      <ThemeContext.Consumer>
        {({ themeClass }) => (
          <div
            className={classes(themeClass)}
            onFocus={onFocus}
            onMouseOver={onMouseOver}
          >
            <div className="hig__side-nav__module__row">
              <div
                className={linkClasses(themeClass)}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
              >
                <div className="hig__side-nav__module__link__icon">{icon}</div>
              </div>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
