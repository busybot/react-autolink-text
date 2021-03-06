'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var renderIntoDocument = _reactAddonsTestUtils2['default'].renderIntoDocument;
var createRenderer = _reactAddonsTestUtils2['default'].createRenderer;

describe('<AutoLinkText />', function () {
  var renderer = undefined;

  beforeEach(function () {
    renderer = createRenderer();
  });

  function renderText(text) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return _react2['default'].renderToStaticMarkup(_react2['default'].createElement(_index2['default'], _extends({ text: text }, props)));
  }

  it('renders an empty span if no text is provided', function () {
    expect(renderText()).toEqual('<span></span>');
  });

  describe('URL linking', function () {
    it('should automatically link URLs in the form of http://opengov.com', function () {
      expect(renderText('Joe went to http://opengov.com')).toEqual('<span><span>Joe went to </span><a href="http://opengov.com">opengov.com</a></span>');
    });

    it('should automatically link URLs in the form of https://opengov.com', function () {
      expect(renderText('Joe went to https://opengov.com')).toEqual('<span><span>Joe went to </span><a href="https://opengov.com">opengov.com</a></span>');
    });

    it('should automatically link localhost URLs when there is a protocol', function () {
      expect(renderText('Joe visited http://localhost today')).toEqual('<span><span>Joe visited </span><a href="http://localhost">localhost</a><span> today</span></span>');
    });

    it('should automatically link localhost URLs when there is a protocol and port', function () {
      expect(renderText('Joe visited http://localhost:8000 today')).toEqual('<span><span>Joe visited </span><a href="http://localhost:8000">localhost:8000</a><span> today</span></span>');
    });

    it('should automatically link URLs in the form of http://www.opengov.com (i.e. protocol and www prefix)', function () {
      expect(renderText('Joe checked out http://www.opengov.com last week')).toBe('<span><span>Joe checked out </span><a href="http://www.opengov.com">opengov.com</a><span> last week</span></span>');
    });

    it('should NOT autolink possible URLs with the "javascript:" URI scheme', function () {
      expect(renderText('do not link javascript:window.alert("hi") please')).toBe('<span><span>do not link javascript:window.alert(&quot;hi&quot;) please</span></span>');
    });

    it('should NOT automatically link strings of the form "git:d" (using the heuristic that the domain name does not have a "." in it)', function () {
      expect(renderText('Something like git:d should not be linked as a URL')).toBe('<span><span>Something like git:d should not be linked as a URL</span></span>');
    });

    it('should NOT automatically link strings of the form ":git:domain" (using the heuristic that the domain name does not have a "." in it)', function () {
      expect(renderText('Something like git:domain should not be linked as a URL')).toBe('<span><span>Something like git:domain should not be linked as a URL</span></span>');
    });

    it('should automatically link strings of the form "git:domain.com", interpreting this as a protocol and domain name', function () {
      expect(renderText('Something like git:domain.com should be linked as a URL')).toBe('<span><span>Something like </span><a href="git:domain.com">git:domain.com</a><span> should be linked as a URL</span></span>');
    });

    it('should NOT automatically link a string in the form of "git:1.0"', function () {
      expect(renderText('git:1.0')).toBe('<span><span>git:1.0</span></span>');
    });

    it("should NOT automatically link supposed protocol-relative URLs in the form of abc//yahoo.com, which is most likely not supposed to be interpreted as a URL", function () {
      expect(renderText('Joe went to abc//opengov.com')).toBe('<span><span>Joe went to abc//opengov.com</span></span>');
    });

    it('should automatically link protocol-relative URLs', function () {
      expect(renderText('Joe visited //opengov.com this morning')).toBe('<span><span>Joe visited </span><a href="//opengov.com">opengov.com</a><span> this morning</span></span>');
    });
  });

  describe('truncating text with links', function () {
    it('should truncate a text span', function () {
      expect(renderText('Joe bookmarked http://opengov.com yesterday in his browser', { maxLength: 36 })).toBe('<span><span>Joe bookmarked </span><a href="http://opengov.com">opengov.com</a><span> yesterday</span></span>');
    });

    it('should allow "maxLength" prop to be a string', function () {
      expect(renderText('This message will be cut off', { maxLength: '13' })).toBe('<span><span>This message </span></span>');
    });
  });
});