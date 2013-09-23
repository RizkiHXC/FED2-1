module.exports = function(req, res, next) {
  
  // menu
  res.locals.menu = [
    {name:"Home", href:"/", page:"home", target:"_self", in_footer: true},
    {name:"Cases", href:"/why", page:"about", target:"_self", in_footer: true},
    {name:"Products", href:"/demo", page:"demo", target:"_self", in_footer: true},
    {name:"Blog", href:"/press", page:"press", target:"_self", in_footer: true},
    {name:"Contact", href:"/contact", page:"contact", target:"_self", in_footer: true}
  ];
  
  next();
}