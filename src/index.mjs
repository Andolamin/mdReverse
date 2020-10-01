import {CONSOLE_TYPE} from './lib/config.mjs';
import {MdReverse, TablePlugin, StrikethroughPlugin} from "./lib/mdReverse.mjs";

MdReverse.plugin = {
    table: TablePlugin,
    strickthrough: StrikethroughPlugin
};

export default MdReverse;
