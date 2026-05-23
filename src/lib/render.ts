export function renderTemplate<T>(template: (data: T) => string, data: T): string {
	return template(data);
}

export function mountTemplate<T>(
	target: HTMLElement,
	template: (data: T) => string,
	data: T
): void {
	target.innerHTML = renderTemplate(template, data);
}

export function mountHtml(target: HTMLElement, html: string): void {
	target.innerHTML = html;
}

export function appendTemplate<T>(
	target: HTMLElement,
	template: (data: T) => string,
	data: T
): void {
	target.insertAdjacentHTML("beforeend", renderTemplate(template, data));
}