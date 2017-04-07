var assert = require('chai').assert
var chrome = require('sinon-chrome');

describe('Array', function() {
    describe('#indexOf()',function() {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});

describe('Background.js test', function() {
    describe("click on monBonCoin button", function(){
        before(function() {
            global.chrome = chrome;
        });
        it('should call parsePage function', function(){
            var parsePage = require('../background');
            parsePage.parsePageTest("dummy tab");
            assert.isOk(true,"parsePage is called");
        });
    });
});
