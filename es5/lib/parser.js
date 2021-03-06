"use strict";

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = Parser;

var _config = require("./config");

var _tools = require("./tools/tools");

function Parser() {}

Object.defineProperties(Parser.prototype, {
  analysis: {
    value: analysis
  }
});

function analysis(tokenArr) {
  if (!_tools.Tools.typeIs(tokenArr, _tools.Tools.TYPE.Array)) return;
  console.time('syntactic analysis');
  var result = [];
  var tag, type, attr, pos, content, token, separator, obj;

  for (var i = tokenArr.length; i--;) {
    token = tokenArr[i];
    separator = indexOfTypeSeparator(tokenArr[i]);
    tag = separator ? token.slice(separator.start, separator.end) : 'textNode'; // HTML标签名

    type = _config.EL_TYPE[tag] || _config.EL_TYPE['htmlNode']; // tag对应类型

    pos = type & 1 ? 3 : separator.start === 1 ? 1 : 2; // 标识标签位置类型（开标签: 1, 闭标签: 2, 空元素: 3）

    attr = pos & 1 ? filterAttribute(token, _config.TOKEN_RULE[type].filterRule.attribute) : null; // HTML标签属性键值对

    content = type === 1 ? token : null; // 文本节点特有，保存节点内容

    obj = {
      tag: tag,
      type: type,
      position: pos
    };
    if (attr) obj['attribute'] = attr;
    if (content) obj['content'] = content;
    result.push(obj);
  }

  console.timeEnd('syntactic analysis');
  return result;
}
/**
 * 过滤掉HTML标签上不必要的属性
 * @param str
 * @param exclude - 需要保留的属性，默认全部去除
 * @return {null} - 返回保留的属性键值对，如果有的话
 */


function filterAttribute(str, exclude) {
  if (!exclude || exclude.length <= 0) return null;
  var avps = str.match(_config.REGEXP.attribute);
  console.log(avps);
  var avp,
      result = {};

  for (var i = avps.length; i--;) {
    avp = avps[i].split('=');

    for (var j = exclude.length, item; j--;) {
      item = exclude[j];

      var type = _tools.Tools.typeOf(item);

      if (type === _tools.Tools.TYPE.String) {
        if (item === avp[0]) {
          result[avp[0]] = avp[1].slice(1, avp[1].length - 1);
          break;
        }
      } else if (type === _tools.Tools.TYPE.Object) {
        if (item.name === avp[0] || item.alias && item.alias.includes(avp[0])) {
          result[avp[0]] = avp[1].slice(1, avp[1].length - 1);
          break;
        }
      }
    } // if (exclude.includes(avp[0])) {
    //     result[avp[0]] = avp[1].slice(1, avp[1].length - 1);
    // }

  }

  return result;
}
/**
 * 搜索标签类型的分隔符（空白符或`>`）
 * @param str
 * @returns {*} - 不属于HTML标签返回null
 */


function indexOfTypeSeparator(str) {
  var start = str[1] === '/' ? 2 : 1,
      end = str.indexOf('<'),
      target = str[end];

  while (target && target !== ' ' && target !== '>') {
    target = str[++end];
  }

  return target ? {
    start: start,
    end: end
  } : null;
}