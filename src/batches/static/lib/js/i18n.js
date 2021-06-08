const en = {
    translation: {
        "Welcome to": "Welcome to",
        "Home": "Home",
        "Contact": "Contact",
        "Error": "Error",
        "Made with": "Made with",
        "by": "by",
        "paragraph 1": "This is the sample page for the home page. It is about you modifying it to adapt it to your needs. Among many of the things it offers you, you will find minimal dependencies for a web front-end project, including jQuery or i18n.",
        "paragraph 2": "",
        "paragraph 3": "",
        "aside paragraph 1": "For more information, please, visit:",
        "contact paragraph 1 part 1": "Greetings, user. My name is Carlos Jimeno Hernández. My Github profile is",
        "contact paragraph 1 part 2": "If you want to contact me directly, you can do it through the email",
        "error message 1": "Ooops, something went wrong...",
    }
};

const es = {
    translation: {
        "Welcome to": "Bienvenido a",
        "Home": "Inicio",
        "Contact": "Contacto",
        "Error": "Error",
        "Made with": "Hecho con",
        "by": "por",
        "paragraph 1": "Esta es la página de ejemplo para la página de inicio. Se trata de que la modifiques para adaptarla a tus necesidades. Entre muchas de las cosas que te ofrece, encontrarás unas dependencias mínimas para un proyecto de front-end de web, incluyendo jQuery o i18n.",
        "paragraph 2": "",
        "paragraph 3": "",
        "aside paragraph 1": "Para más información, por favor, visite:",
        "contact paragraph 1 part 1": "Saludos, usuari@. Mi nombre es Carlos Jimeno Hernández. Mi perfil de Github es",
        "contact paragraph 1 part 2": "Si deseas contactarme directamente, puedes hacerlo a través del correo electrónico",
        "error message 1": "Vaaaya, algo ha ido mal...",
    }
};

const ca = {
    translation: {
        "Welcome to": "Benvingut a",
        "Home": "Inici",
        "Contact": "Contacte",
        "Error": "Error",
        "Made with": "Fet amb",
        "by": "per",
        "paragraph 1": "Aquesta és la pàgina d'exemple per a la pàgina d'inici. Es tracta que la modifiquis per adaptar-la a les teves necessitats. Entre moltes de les coses que t'ofereix, trobaràs unes dependències mínimes per a un projecte de front-end de web, incloent jQuery o i18n.",
        "paragraph 2": "",
        "paragraph 3": "",
        "aside paragraph 1": "Per a més informació, si us plau, visiti:",
        "contact paragraph 1 part 1": "Salutacions, usuaris i usuàries. El meu nom és Carlos Jimeno Hernández. El meu perfil de Github és ",
        "contact paragraph 1 part 2": "Si vols contactar directament, pots fer-ho mitjançant el correu electrònic",
        "error message 1": "Òooondia, alguna cosa ha anat malament...",
    }
};

const availableLanguages = ["en", "es", "ca"];

const userLanguages = (function() {
    if (!("__EXPRESS_SCAFFOLDING_PROJECT__" in localStorage)) {
        localStorage.__EXPRESS_SCAFFOLDING_PROJECT__ = "{}";
    }
    let storageData = undefined;
    try {
        storageData = JSON.parse(localStorage.__EXPRESS_SCAFFOLDING_PROJECT__);
    } catch (error) {
        localStorage.__EXPRESS_SCAFFOLDING_PROJECT__ = "{}";
        storageData = {};
    }
    if(!("languages" in storageData)) {
        storageData.languages = [];
    }
    if (storageData.languages.length !== 0) {
        return [storageData.languages[0]];
    }
    return navigator.languages;
})();

const preferredLanguage = userLanguages.filter(lang => {
    const language = lang.split("-")[0];
    return availableLanguages.indexOf(language) !== -1;
})[0] || "en";

jQuery(function() {
    i18next.init({
        lng: preferredLanguage,
        debug: false,
        resources: { en, es, ca },
    }, function (err, t) {
        jqueryI18next.init(i18next, jQuery);
        jQuery("html").localize();
    });
});