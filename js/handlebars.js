Handlebars.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    return mmnt.format(format);
});

var md = window.markdownit();
Handlebars.registerHelper('markdown', function (markdown){
    return md.render(markdown);
})