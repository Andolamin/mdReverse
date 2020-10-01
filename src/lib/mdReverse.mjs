import {EL_TYPE, DEFAULT_RULE, addToken} from "./config.mjs";
import {TablePlugin} from "./plugins/table.mjs";
import {StrikethroughPlugin} from "./plugins/strikethrough.mjs";
import {Lexer} from "./lexer.mjs";
import {Parser} from "./parser.mjs";
import {VDOMTree} from "./vdomt.mjs";
import {Markdown} from "./markdown.mjs";
import {Tools} from "./tools/tools.mjs";

function MdReverse() {
    this.HTML = '';
}

Object.defineProperties(MdReverse.prototype, {
    toMarkdown: {
        value: toMarkdown
    },
    use: {
        value: use
    }
});

/**
 * 将HTML字符串转换为Markdown格式
 * @param htmlStr
 * @return {String}
 */
function toMarkdown(htmlStr) {
    this.HTML = Tools.trim(htmlStr);
    const lexer = new Lexer(), parser = new Parser(), vdomtree = new VDOMTree(), md = new Markdown();
    let result = lexer.analysis(this.HTML);
    result = parser.analysis(result);
    result = vdomtree.build(result);
    result = md.translate(result);
    return result;
}

function use(plugin) {
    plugin(addToken, EL_TYPE, DEFAULT_RULE);
    return this;
}
export {
    MdReverse,
    TablePlugin,
    StrikethroughPlugin
}
