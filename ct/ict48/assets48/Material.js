/**
 * 文案、图片素材
 * Created by lip on 2016/6/21.
 */

const $ = require('jquery');
const User = require('./User');
const Util = require('./Util');
const Onfire = require('onfire.js');

var VOTE_TICKET = null;

class Material{

    /**
     * 从服务器上获取文章列表
     * @returns {*}
     */
    static getArticleListFromServer(userId) {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('get_article_list'); //文章列表

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId || '');
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }

    /**
     * 投票
     * @returns {*}
     */
    static vote(articleId,userId,sessionId) {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('post_vote').replace('{articleId}',articleId); //投票

        return $.ajax({
            url: apiUrl,
            type: 'put',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
                request.setRequestHeader("X-iChangTou-Json-Api-Session",sessionId);
            }
        });
    }

    /**
     * 获取排行榜
     * @returns {*}
     */
    static getRankListFromServer() {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('get_rank_list'); //排行榜

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }
    /**
     * 从服务器上获取公号信息
     * @param oaId
     * @param userId
     * @returns {*}
     */
    static postOaIdFromServer(oaId,userId) {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('get_vote_number').replace('{oaId}',oaId);//获取公号

        return $.ajax({
            url: apiUrl,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
            success: function(){
                console.log("success")
            }
        });
    }
    /**
     * 从服务器上获取剩余票数
     * @param userId
     * @returns {*}
     */
    static getVoteTicketFromServer(userId) {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('get_vote_ticket'); //获取剩余票数

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }

    /**
     * 设置剩余投票数
     * @param data
     */
    static setVoteTicket(data) {
        VOTE_TICKET = data;
    }

    /**
     * 获取剩余投票数
     * @returns {*}
     */
    static getVoteTicket() {
        return VOTE_TICKET;
    }

    /**
     * 首次分享
     * @param userId
     * @returns {*}
     */
    static firstShare(userId) {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('put_first_share'); //首次分享
        console.log('apiUrl',apiUrl);
        return $.ajax({
            url: apiUrl,
            type: 'put',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
            success: function(result){
                console.log("首次分享success",result);

                if(result==true){
                    Onfire.fire('FIRST_SHARE');
                }
            }
        });
    }

    /**
     * 获取个人中心内容
     * @returns {object}
     */
    static GetPersonalInfo(userId,callBack) {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('get_personal_data');

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
            success: function(data){
                console.log('请求成功并返回',data);
                callBack(data);
            }
        });
    }

    /**
     * 获取公号详情页内容
     * @returns {object}
     */
    static GetGhInfo(oaId,userId,callBack) {
        let Util = require('./Util');
        let apiUrl = Util.getAPIUrl('get_writer_info').replace("{oaId}",oaId);

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
          /*  success: function(data){
                console.log('返回数据：'+ data);
                callBack(data);
            }*/
        });
    }
}

module.exports = Material;
