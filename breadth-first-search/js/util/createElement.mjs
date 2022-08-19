export const renderElement = (data) => {

    if (typeof data !== 'object') {
        if (typeof data === 'string') {
            return document.createTextNode(data);
        } else if (typeof data === 'number') {
            return document.createTextNode(String(data));
        }
    }
    const { tagName, attributes, children } = data;
    const element = document.createElement(tagName.toUpperCase());
    if (typeof attributes === 'object') {
        for (let attributeName in attributes) {
            let value = attributes[attributeName];
            if (attributeName.startsWith('ref')) {
                value(element);
                continue;
            } else if (attributeName.startsWith('data-')) {
                element.dataset[attributeName.substring(5)] = value;
                continue;
            } else if (attributeName.startsWith('on')) {
                attributeName = attributeName.toLowerCase();
            } else if (attributeName === 'className' && Array.isArray(value)) {
                value = value.filter(Boolean).join(' ');
            }
            element[attributeName] = value;
        }
    }
    if (Array.isArray(children)) {
        for (const child of children) {
            if (!child) { continue; }
            element.appendChild(renderElement(child));
        }
    }
    return element;
};
