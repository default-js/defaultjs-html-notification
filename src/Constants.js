import {toNodeName} from "@default-js/defaultjs-html-components/src/utils/DefineComponentHelper"
export const BASE_TEMPLATE_PATH = "/templates/notification/";

export const NODENAME_BASE =  toNodeName("notification");

export const NODENAME_DISPLAY = `${NODENAME_BASE}-display`;
export const NODENAME_MESSAGE = `${NODENAME_BASE}-message`;
export const NODENAME_COUNT = `${NODENAME_BASE}-count`;
