function removeSpanAdd2Cart() {
    const remEl = document.querySelectorAll('span.Add2Cart');
    remEl.forEach(el => {el.innerHTML = '';});
}
document.addEventListener('DOMContentLoaded', removeSpanAdd2Cart);

function processSpanLink() {
    const regionMappings = {
        'ca': { tld: 'ca', tag: 'ca-blogger-20' },
        'de': { tld: 'de', tag: '' },
        'fr': { tld: 'fr', tag: '' },
        'it': { tld: 'it', tag: '' },
        'es': { tld: 'es', tag: '' },
        'us': { tld: 'com', tag: '' },
        'gb': { tld: 'co.uk', tag: '' },
        'jp': { tld: 'co.jp', tag: '' },
        'mx': { tld: 'com.mx', tag: '' },
        'br': { tld: 'com.br', tag: '' },
        'au': { tld: 'com.au', tag: '' },
        'tr': { tld: 'com.tr', tag: '' },
        'nl': { tld: 'nl', tag: '' },
        'in': { tld: 'in', tag: '' },
        'ae': { tld: 'ae', tag: '' },
        'sa': { tld: 'sa', tag: '' },
        'sg': { tld: 'sg', tag: '' },
        'se': { tld: 'se', tag: '' },
        'pl': { tld: 'pl', tag: '' },
        'dk': { tld: 'dk', tag: '' },
        'no': { tld: 'no', tag: '' }
    };
    const navEls = document.querySelectorAll('a[target="_blank"]');
    navEls.forEach(el => {
        if (el.getAttribute('target') === '_blank') {
            const decodedUrl = el.getAttribute('href');
            const countryCode = getCountry(decodedUrl);

            if (countryCode && regionMappings.hasOwnProperty(countryCode)) {
                const { tld, tag } = regionMappings[countryCode];
                const url = changeTags(decodedUrl, tag);
                el.setAttribute('target', '_self'); //_blank <- temporary
                el.setAttribute('href', '/'); //url <- temporary
            } else {
                //console.warn(`Unsupported country code: ${countryCode}`);
            }
        }
    });
    const spanElements = document.querySelectorAll('span[region], span[name="spanlink"]"]');
    spanElements.forEach(spanElement => {
        if (spanElement.getAttribute('region')) {
            const regionValue = spanElement.getAttribute('region').toLowerCase();
            const asinValue = spanElement.getAttribute('asin');

            if (regionMappings.hasOwnProperty(regionValue)) {
                const { tld, tag } = regionMappings[regionValue];
                const url = `https://www.amazon.${tld}/dp/${asinValue}?tag=${tag}`;

                const linkElement = createLinkElement(url, spanElement);
                spanElement.parentNode.replaceChild(linkElement, spanElement);
            } else {
                console.warn(`Unsupported region: ${regionValue}`);
            }
        } else if (spanElement.getAttribute('name') === 'spanlink') {
            const dataurl = decodeURIComponent(spanElement.getAttribute('dataurl'));
            const decodedUrl = dataurl.includes('://') ? dataurl : atob(dataurl);
            const countryCode = getCountry(decodedUrl);

            if (countryCode && regionMappings.hasOwnProperty(countryCode)) {
                const { tld, tag } = regionMappings[countryCode];
                const url = changeTags(decodedUrl, tag);
                const linkElement = createLinkElement(url, spanElement);
                spanElement.parentNode.replaceChild(linkElement, spanElement);
            } else {
                //console.warn(`Unsupported country code: ${countryCode}`);
            }
        }
    });
    function changeTags(url, tag) {
        let urlObj = new URL(url);
        if (urlObj.searchParams.has('AssociateTag')) {
            urlObj.searchParams.set('AssociateTag', tag);
        }
        if (urlObj.searchParams.has('tag')) {
            urlObj.searchParams.set('tag', tag);
        }
        return urlObj.toString();
    }
    function getCountry(url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?amazon\.([a-z\.]{2,6})\/?/i);
        if (match) {
            const tld = match[1];
            const countryCodeMap = {
                'com': 'us',
                'co.uk': 'gb', 'com.mx': 'mx', 
                'co.jp': 'jp', 'com.br': 'br', 
                'com.au': 'au','com.tr': 'tr',
            };
            return countryCodeMap[tld] || tld;
        }
        return null;
    }
    function createLinkElement(url, spanElement) {
        return spanElement; //temporary
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('style', spanElement.getAttribute('style') ?? '');
        linkElement.setAttribute('rel', 'noopener noreferrer nofollow');
        linkElement.setAttribute('target', '_blank');
        linkElement.innerHTML = spanElement.innerHTML;
        return linkElement;
    }
}
document.addEventListener('DOMContentLoaded', processSpanLink);
document.addEventListener('livewire:navigated', processSpanLink);