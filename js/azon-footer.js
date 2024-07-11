function processSpanLink() {
    const regionMappings = {
        'ca': { tld: 'ca', tag: 'ca-promo-20' },
        'de': { tld: 'de', tag: 'de-promo-21' },
        'fr': { tld: 'fr', tag: 'fr-promo-21' },
        'it': { tld: 'it', tag: 'it-promo-21' },
        'es': { tld: 'es', tag: 'es-promo-21' },
        'us': { tld: 'com', tag: 'us-promo-20' },
        'gb': { tld: 'co.uk', tag: 'uk-promo-21' },
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

    const spanElements = document.querySelectorAll('span[region], span[name="spanlink"]');
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
            const decodedUrl = decodeURIComponent(spanElement.getAttribute('dataurl'));
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
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('style', spanElement.getAttribute('style'));
        linkElement.setAttribute('rel', 'noopener noreferrer nofollow');
        linkElement.setAttribute('target', '_blank');
        linkElement.textContent = spanElement.textContent;
        return linkElement;
    }
}
document.addEventListener('DOMContentLoaded', processSpanLink);