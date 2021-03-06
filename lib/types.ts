/**
 * Information about content rendered within a browser tab
 *
 * This is provided to the extension's popup UI, for presentation
 * to the user
 *
 * @public
 */
export interface TabInfo {
  /**
   * The innerText of the `<title>` element
   */
  pageTitle: string;
  /**
   * The innerText of the `<meta type="description">` element
   */
  pageDescription?: string;

  /**
   * The title to be rendered in the popup
   * @remarks
   * Defaults to {@link TabInfo.pageTitle}
   */
  popupTitle?: string;

  /**
   * The description to be rendered in the popup
   * @remarks
   * Defaults to {@link TabInfo.pageDescription}
   */
  popupDescription?: string;
  /**
   * The URL of the page
   */
  pageUrl: string;
  /**
   * Button color
   * @example
   * "#ff0"
   */
  buttonColor?: string;
}
/**
 * A wrapper around the {@link TabInfo} object
 * that allows us to capture an enabled/disabled
 * state
 *
 * @public
 */
export interface PageInfo {
  /**
   * Whether the extension should be enabled at all for the current tab
   */
  enabled: boolean;
  /**
   * Information about the tab's current contents
   */
  tabInfo: TabInfo;
}

/**
 * A browser tab whose `id` property has already been
 * determined to exist
 *
 * @public
 */
export type TabWithId = chrome.tabs.Tab & { id: number };

/**
 * A base class for messages sent between the three
 * actors in this extension (popup, background thread, content script)
 *
 * Each message should have a unique key, so that we can identify them
 * easily and handle them appropriately
 *
 * @public
 */
export interface MessageBase<K extends string> {
  key: K;
}

/**
 * A message sent from the content script to the background thread
 * to (1) indicate that the content script has loaded and
 * (2) pass the current page info along
 *
 * @public
 */
export interface ContentScriptReadyMessage extends MessageBase<'content_script_ready'> {
  pageInfo: PageInfo;
}
/**
 * A message sent *to* the content script by either the background script
 * or popup frame, as a request to respond with a `PageInfo` value
 *
 * @public
 */
export interface GetPageInfoMessage extends MessageBase<'get_page_info'> {}

/**
 * A message sent *from* the content script *to* the background script
 * asking for pageInfo to be fetched from some API endpoint.
 *
 * @public
 */
export interface FetchRemotePageInfoMessage extends MessageBase<'fetch_remote_page_info'> {
  url: string;
}

/**
 * A mapping of message keys to the types that define their
 * entire shape
 *
 * @public
 */
export interface MessageMap {
  content_script_ready: ContentScriptReadyMessage;
  get_page_info: GetPageInfoMessage;
  fetch_remote_page_info: FetchRemotePageInfoMessage;
}
/**
 * A type that matches any valid message key
 *
 * @public
 */
export type MessageKey = keyof MessageMap;

/**
 * A type that matches any valid message payload
 *
 * @public
 */
export type Message = MessageMap[keyof MessageMap];

/**
 * An array of all valid message keys
 *
 * @public
 */
export const ALL_MESSAGE_KEYS = [
  'content_script_ready' as const,
  'get_page_info' as const,
  'fetch_remote_page_info' as const,
];

/**
 * JSON structure provided by a remote tab info information source
 *
 * @public
 */
export interface RemotePageInfoPayload {
  /**
   * Color of the button in the browser UI
   */
  color: string;
  /**
   * Title to be rendered at the top of the popup
   */
  title: string;
  /**
   * Description (markdown) to be rendered below the title in the popup
   */
  description: string;
}
