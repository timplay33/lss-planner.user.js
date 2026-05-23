export {};

declare global {
	interface JQuery<TElement = HTMLElement> {
		modal(action?: string): JQuery<TElement>;
	}
}