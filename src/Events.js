import {NODENAME_BASE} from "./Constants";

export const EVENT_BASE = `${NODENAME_BASE}-event`;

export const EVENT_SHOW_DISPAY = `${EVENT_BASE}:show-display`;
export const EVENT_SHOW_MESSAGE = `${EVENT_BASE}:show-message`;
export const EVENT_CLOSE_MESSAGE = `${EVENT_BASE}:close-message`;
export const EVENT_DISPLAY_REMOVE_MESSAGE = `${EVENT_BASE}:display-remove-message`;
export const EVENT_DISPLAY_MESSAGE_REMOVED = `${EVENT_BASE}:display-message-removed`;
export const EVENT_UPDATE_COUNT = `${EVENT_BASE}:update-count`;