
const React = require('react');
const ReactDom = require('react-dom');
const $ = require('jquery');
const Link = require('react-router').Link;

const Tabbar = React.createClass({

    render() {

        return (<ul role="nav" className="tabbar">
            <li className="tabbar-item">
                <Link to="/votepage"
                      className="item-icon"
                      activeClassName="item-ac">
                </Link>
            </li>
            <li className="tabbar-item">
                <Link to="/toplist"
                      className="List-icon"
                      activeClassName="List-ac">
                </Link>
            </li>
            <li className="tabbar-item">
                <Link to="/personcenter"
                      className="personal-icon"
                      activeClassName="personal-ac">
                </Link>
            </li>

        </ul>)
    }

});
module.exports = Tabbar;