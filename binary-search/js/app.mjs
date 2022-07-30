import { users } from './data/name.mjs';
import { createUIElement } from './components/elements.mjs';

import {
    getUserByName,
    getUserByNameSimpleSearch,
    getUserByNameGenericBinarySearch,
    getUserByNameGenericRecursiveinarySearch
} from './get-element-from-list/index.mjs';

export class App {

    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);

        this.searchInputElem = null;
        this.searchResultElem = null;
        this.users = users;
        this.searchResult = {
            name: '',
            result: '',
            details: ''
        }

        this.init();
    }

    init() {
        const uiElement = createUIElement({
            users: this.users,
            searchResult: this.searchResult,
            inputRef: (el) => this.searchInputElem = el,
            resultRef: (el) => this.searchResultElem = el,
            onSelectUserName: this.onSelectUserName,
            onSearch: this.onSearch,
        });
        this.container.appendChild(uiElement);
    }

    onSelectUserName = (ev) => {
        this.searchInputElem.value = ev.target.value;
        this.search(ev.target.value);
    }

    onSearch = (ev) => {
        this.search(ev.target.value);
    }

    search(name) {
        this.searchResult.name = name;
        const result = getUserByName(this.users, this.searchResult.name);
        if (result.user) {
            this.searchResult.details = `
                data: ${JSON.stringify(result.user)}
                time: ${result.duration} ms
                step: ${result.step}
            `;
        } else {
            this.searchResult.details = `
                data: Not found any result
                time: ${result.duration} ms
                step: ${result.step}
            `;
        }
        console.group('serach results');
        console.info('getUserByName', result);
        console.info('getUserByNameSimpleSearch', getUserByNameSimpleSearch(this.users, this.searchResult.name));
        console.info('getUserByNameGenericBinarySearch', getUserByNameGenericBinarySearch(this.users, this.searchResult.name));
        console.info('getUserByNameGenericRecursiveinarySearch', getUserByNameGenericRecursiveinarySearch(this.users, this.searchResult.name));
        console.groupEnd();
        this.searchResultElem.textContent = this.searchResult.details;
    }

}
