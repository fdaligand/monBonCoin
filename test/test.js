var assert = require('chai').assert
var background = require('../background.js');
describe('Array', function() {
    describe('#indexOf()',function() {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});

describe('Background.js test', function() {
    describe("click on monBonCoin button", function(){
        it('should call parsePage function', function(){
            debugger;
            background.parsePage();
            assert.isOk(true,"parsePage is called");
        });
    });
});
