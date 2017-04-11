var assert = require('chai').assert
var expect = require('chai').expect
var sinon = require('sinon');
var chrome = require('sinon-chrome');
global.chrome = chrome;
var parsePage = require('../background');

describe('Background.js test ', function() {
    describe("openning of tab", function(){
        var tab;
        before(function(){ 
            tab = { 
                "url":"https://www.leboncoin.fr",
                "id":1
                };
            });
        afterEach(function() {
            chrome.reset();
        });
        it("should show page button if in leboncoin", function(){
            chrome.tabs.onUpdated.dispatch(tab.id,{},tab);
            assert.isOk(chrome.pageAction.show.calledOnce, 'should call parsePage method');
        });
        it("should hide page button if not in leboncoin", function(){
            // register method showMonBonCoinIcon to tabs 
            chrome.tabs.onUpdated.addListener(parsePage.showMonBonCoinIcon);
            assert.isOk(chrome.tabs.onUpdated.addListener.calledOnce);
            // update tabs and raise event
            tab.url = "https://www.example.com";
            chrome.tabs.onUpdated.dispatch(tab.id,{},tab);
            assert.isNotOk(chrome.pageAction.show.calledOnce, 'should not call parsePage method')
            assert.isOk(chrome.pageAction.hide.calledOnce, "should hide button if user not in leboncoin");
        });
    });
    describe("call of parsePage", function(){
        var tab;
        before(function() {
            sinon.spy(parsePage,"parsePageTest");
            tab = {
                "id":1, 
                "title":"tab for test",
                "url":"https://www.leboncoin.fr"
                };
        });
        afterEach(function(){
            tab.id = 1;
            chrome.reset(); // if not reset, counter of called will be false
        })
        it('send one message to all tabs', function(){
            parsePage.parsePageTest(tab);
            assert.isOk(chrome.tabs.sendMessage.calledOnce,"sendMessage not called");
            assert.isOk(chrome.tabs.sendMessage.calledOnce, "message should be raised");
            assert.isOk(chrome.tabs.sendMessage.withArgs(tab.id,"button pressed").calledOnce, "wrong message send");
        });
        it('and not two', function() {
            // This test only show usage of calledTwice 
            parsePage.parsePageTest(tab);
            assert.isNotOk(chrome.tabs.sendMessage.calledTwice,"sendMessage should be called once");
        });
        it ('throw TypeError if tab id is not a number', function(){
            tab.id="not a number";
            assert.throws(()=>{parsePage.parsePageTest(tab);},TypeError);
        });
    });
});
