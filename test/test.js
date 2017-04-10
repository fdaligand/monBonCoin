var assert = require('chai').assert
var expect = require('chai').expect
var sinon = require('sinon');
var chrome = require('sinon-chrome');

describe('Background.js test ', function() {
    // set chrome variable global to all tests
    global.chrome = chrome;
    describe("openning of tab", function(){
        var tab;
        before(function(){ tab = {"url":"https://www.leboncoin.fr" }});
        it("should show button if in leboncoin", function(){
            assert(false == true, 'should call parsePage method');
        });
        it("should not show button if not in leboncoin", function(){
            assert(false == true, 'should not call parsePage method');
        });
    });
    describe("call of parsePage", function(){
        var tab, parsePage;
        before(function() {
            parsePage = require('../background');
            sinon.spy(parsePage,"parsePageTest");
            tab = {
                "id":1, 
                "title":"tab for test",
                "url":"https://www.leboncoin.fr"
                };
        });
        afterEach(function(){
            tab.id = 1;
        })
        it('send one message to all tabs', function(){
            parsePage.parsePageTest(tab);
            assert.isOk(chrome.tabs.sendMessage.calledOnce,"sendMessage not called");
        });
        it('and not two', function() {
            chrome.reset(); // if not reset, counter of called will be false
            parsePage.parsePageTest(tab);
            assert.isNotOk(chrome.tabs.sendMessage.calledTwice,"sendMessage should be called once");
        });
        it ('throw TypeError if tab id is not a number', function(){
            tab.id="not a number";
            assert.throws(()=>{parsePage.parsePageTest(tab);},TypeError);
        });
    });
});
