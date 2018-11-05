const X2JS = require('x2js');

const xml2json = (path) => {
    const xhttp =new XMLHttpRequest();
    xhttp.open("GET", path, false);
    xhttp.send();
    return new X2JS().xml2js(new XMLSerializer().serializeToString(xhttp.responseXML.documentElement));
};

export default xml2json;
