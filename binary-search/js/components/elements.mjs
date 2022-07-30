import { renderElement } from '../util/createElement.mjs';

export const createUIElement = (props) => {
    const {
        inputRef,
        resultRef,
        users,
        searchResult,
        onSelectUserName,
        onSearch,
    } = props;

    const searchContainer = {
        tagName: 'div',
        attributes: { className: 'search-container' },
        children: [
            {
                tagName: 'select',
                attributes: { onchange: onSelectUserName },
                children: users.map(user => ({
                    tagName: 'option',
                    attributes: { value: user.name },
                    children: [user.name]
                }))
            },
            {
                tagName: 'div',
                attributes: { className: 'input-container' },
                children: [
                    {
                        tagName: 'input',
                        attributes: {
                            type: 'text',
                            value: searchResult.name,
                            ref: inputRef
                        },
                        children: []
                    },
                    {
                        tagName: 'button',
                        attributes: { onclick: onSearch },
                        children: ['search']
                    },
                ]
            },
        ]
    };

    const resultContainer = {
        tagName: 'div',
        attributes: { className: 'result-container' },
        children: [
            {
                tagName: 'h4',
                children: []
            },
            {
                tagName: 'div',
                attributes: { className: 'search-result' },
                children: [searchResult.result]
            },
            {
                tagName: 'div',
                attributes: { className: 'search-detailt', ref: resultRef },
                children: ['Try find something']
            },
        ]
    };

    const component = {
        tagName: 'div',
        attributes: { className: 'app-container' },
        children: [
            searchContainer,
            resultContainer
        ]
    };

    return renderElement(component);
}