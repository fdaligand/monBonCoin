var assert = require('chai').assert
var expect = require('chai').expect
var sinon = require('sinon');
var chrome = require('sinon-chrome');
var jsdom = require("jsdom");
var fs = require("fs");

global.chrome = chrome;



describe('ContentScript.js test ', function() {
    var contentScript;
    before(function(done){
            jsdom.env({
            // generated background page
            html: '<html></html>',
            // js source
            src:[],
            created: function (errors, wnd) {
                // attach `chrome` to window
                wnd.chrome = chrome;
                wnd.console = console;
                wnd.localStorage = {};
                wnd.localStorage.getItem = function (key) { return this[key];};
                wnd.localStorage.setItem = function (key,value) { this[key]=value;};
            },
            done: function (errors, wnd) {
                if (errors) {
                    console.log(errors);
                    done(true);
                } 
                else {
                    global.window = wnd;
                    contentScript = require("../contentScript")
                    done();
                }
            }
            });
    });
    describe("Message from background", function () {
        var msg;
        before(function(){
            msg = "button pressed";
        });
        it("receive with message 'button pressed'",function(){
            var sendResponse = sinon.spy();
            chrome.runtime.onMessage.trigger(msg, {}, sendResponse);
            assert(sendResponse.called,"initPage not called on new message from background script");
        });
        it("do nothing on wrong message",function(){
            var sendResponse = sinon.spy();
            chrome.runtime.onMessage.trigger("wrong message", {}, sendResponse);
            assert.isNotOk(sendResponse.called,"response should not be send on wrong message");
        })
    });
    describe("initPage function", function() {
        var localStorageKey = "buttonPressed";
        it("create buttonPressed item in locale storage and set it to false", function() {
            // reset localStorage 
            window.localStorage.setItem(localStorageKey,null);
            assert.isOk(window.localStorage[localStorageKey] == null, "button pressed item already exist");
            contentScript.initPage();
            assert(window.localStorage[localStorageKey] == false,"buttonPressed not created in local storage");
        });
        it("toogle buttonPressed item in local storage", function() {
            buttonPressedStatus = window.localStorage.getItem(localStorageKey);
            assert(window.localStorage[localStorageKey] != null, "buttonPressed not created yet");
            // first call should complement buttonPressedStatus
            contentScript.initPage();
            assert(buttonPressedStatus == (!window.localStorage[localStorageKey]), "toogle not working");
            // second call should restore initial valuye
            contentScript.initPage();
            assert(buttonPressedStatus == window.localStorage[localStorageKey], "toogle not working");
        });
    })
});