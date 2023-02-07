const shipPlacementPage = (function() {
    const init = function (root) {
        const text = document.createElement('p');
        text.innerText = 'hello world';
        root.appendChild(text);
    }

    return {
        init,
    }
})();

export default shipPlacementPage;