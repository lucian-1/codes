/**
 * Created by Administrator on 16-11-18.
 */
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const Link = require('react-router').Link;
const History =  require('react-router').History;
const browserHistory =  require('react-router').browserHistory;
const hashHistory =  require('react-router').hashHistory;
const IndexRoute = require('react-router').IndexRoute;
const IndexRedirect = require('react-router').IndexRedirect;
const React = require('react');

const App = require('./component/App');

const TopList = require('./component/TopList');
const VotePage = require('./component/VotePage');
const PersonCenter = require('./component/PersonCenter');
const WriterIntroduce = require('./component/WriterIntroduce');

const InnerRouter = React.createClass({

    render(){
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>

                    <IndexRedirect to="/votepage" />

                    <Route path={"/votepage"} component={VotePage}/>

                    <Route path={"/toplist"} component={TopList}/>

                    <Route path={"/personcenter"} component={PersonCenter}/>

                    <Route path={"/writerIntroduce/:oaId"} component={WriterIntroduce}/>

                </Route>

            </Router>
        )
    }
});

module.exports = InnerRouter;