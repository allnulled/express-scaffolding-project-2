window.CustomTheme = {};

CustomTheme.functions = {};

CustomTheme.functions.toggleNavigation = function() {
    jQuery("#navigation-menu-box").slideToggle();
};

CustomTheme.functions.changeLanguage = function(newLanguage) {
    i18next.changeLanguage(newLanguage, function() {
        const storageData = JSON.parse(localStorage.__EXPRESS_SCAFFOLDING_PROJECT__);
        storageData.languages = [newLanguage];
        localStorage.__EXPRESS_SCAFFOLDING_PROJECT__ = JSON.stringify(storageData);
        CustomTheme.functions.localizeApplication();
    });
};

CustomTheme.functions.localizeApplication = function () {
    jQuery("html").localize();
};